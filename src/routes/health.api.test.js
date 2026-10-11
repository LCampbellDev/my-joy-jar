import request from 'supertest';
import app from '../app';

describe('GET /health', () => {
  it('returns status 200 when the server is responding', async () => {
    // Act
    const response = await request(app).get('/health');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      status: 'ok',
    });
  });
});
