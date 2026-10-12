import request from 'supertest';
import app from '../app';

describe('Security headers', () => {
  it('adds security headers to successful responses', async () => {
    // Act
    const response = await request(app).get('/health');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.headers['x-content-type-options']).toEqual('nosniff');
    expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
    expect(response.headers['referrer-policy']).toEqual('no-referrer');
    expect(response.headers['content-security-policy']).toEqual(
      expect.any(String),
    );
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('adds security headers to error responses', async () => {
    // Arrange
    const invalidJson = '{"category":';

    // Act
    const response = await request(app)
      .post('/api/entries')
      .set('Content-Type', 'application/json')
      .send(invalidJson);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: 'Request body must contain valid JSON.',
    });
    expect(response.headers['x-content-type-options']).toEqual('nosniff');
    expect(response.headers['x-frame-options']).toEqual('SAMEORIGIN');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
