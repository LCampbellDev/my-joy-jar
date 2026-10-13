import { jest } from '@jest/globals';
import request from 'supertest';

const database = {
  execute: jest.fn(),
};

// Database mock must be registered before importing the ESM application.
jest.unstable_mockModule('../config/database', () => ({
  default: database,
}));

const { default: app } = await import('../app');

describe('GET /ready', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns status 200 when the database is available', async () => {
    // Arrange
    database.execute.mockResolvedValue([[], []]);

    // Act
    const response = await request(app).get('/ready');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      status: 'ready',
    });
    // Check that MySQL accepts a query without reading or changing application data.
    expect(database.execute).toHaveBeenCalledWith('SELECT 1');
  });

  it('returns status 503 when the database is unavailable', async () => {
    // Arrange
    const databaseError = new Error('Database unavailable');
    database.execute.mockRejectedValue(databaseError);

    // Act
    const response = await request(app).get('/ready');

    // Assert
    expect(response.status).toEqual(503);
    expect(response.body).toEqual({
      status: 'not ready',
    });
    expect(database.execute).toHaveBeenCalledWith('SELECT 1');
  });
});
