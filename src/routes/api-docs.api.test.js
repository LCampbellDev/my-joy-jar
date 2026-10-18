import request from 'supertest';
import app from '../app';

describe('GET /api-docs/', () => {
  it('returns the Swagger UI page with status 200', async () => {
    // Act
    const response = await request(app).get('/api-docs/');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('id="swagger-ui"');
    expect(response.text).toContain('swagger-ui-bundle.js');
  });

  it('serves the Swagger UI JavaScript with status 200', async () => {
    // Act
    const response = await request(app).get('/api-docs/swagger-ui-bundle.js');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.headers['content-type']).toMatch(/javascript/);
    expect(response.text.length).toBeGreaterThan(0);
  });
});
