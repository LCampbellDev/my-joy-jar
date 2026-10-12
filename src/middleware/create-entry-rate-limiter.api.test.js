import express from 'express';
import request from 'supertest';
import { createEntryRateLimiter } from './create-entry-rate-limiter';

// Each test gets a fresh app and limiter, so request counts are isolated.
const createTestApp = () => {
  const app = express();

  app.use(
    '/api/entries',
    createEntryRateLimiter({
      windowMs: 60 * 1000,
      limit: 2,
    }),
  );

  app.get('/api/entries', (req, res) => {
    return res.status(200).json({ entries: [] });
  });

  app.get('/health', (req, res) => {
    return res.status(200).json({ status: 'ok' });
  });

  return app;
};

describe('Entry API rate limiting', () => {
  it('allows requests up to the configured limit', async () => {
    // Arrange
    const app = createTestApp();

    // Act
    const firstResponse = await request(app).get('/api/entries');
    const secondResponse = await request(app).get('/api/entries');

    // Assert
    expect(firstResponse.status).toEqual(200);
    expect(secondResponse.status).toEqual(200);
    expect(secondResponse.body).toEqual({ entries: [] });

    expect(secondResponse.headers['ratelimit']).toEqual(expect.any(String));
    expect(secondResponse.headers['ratelimit-policy']).toEqual(
      expect.any(String),
    );
    expect(secondResponse.headers['x-ratelimit-limit']).toBeUndefined();
  });

  it('returns status 429 when the request limit is exceeded', async () => {
    // Arrange
    const app = createTestApp();

    await request(app).get('/api/entries');
    await request(app).get('/api/entries');

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(429);
    expect(response.body).toEqual({
      message: 'Too many requests. Please try again later.',
    });
    expect(response.headers['retry-after']).toEqual(expect.any(String));
    expect(Number(response.headers['retry-after'])).toBeGreaterThan(0);
  });

  it('allows health requests after the entry API limit is exceeded', async () => {
    // Arrange
    const app = createTestApp();

    await request(app).get('/api/entries');
    await request(app).get('/api/entries');
    const blockedResponse = await request(app).get('/api/entries');

    // Act
    const response = await request(app).get('/health');

    // Assert
    expect(blockedResponse.status).toEqual(429);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(response.headers['ratelimit']).toBeUndefined();
  });
});
