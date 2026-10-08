import { jest } from '@jest/globals';
import request from 'supertest';

const entryRepo = {
  getAll: jest.fn(),
  getRandom: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

jest.unstable_mockModule(
  '../repositories/mysql-entry-repository',
  () => ({
    entryRepo,
  }),
);

const { default: app } = await import('../app');

describe('GET /api/entries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all entries with status 200', async () => {
    // Arrange
    const entries = [
      {
        id: 1,
        category: 'gratitude',
        content: 'I am grateful for learning API testing.',
        createdAt: '2026-10-03T12:00:00.000Z',
      },
    ];

    entryRepo.getAll.mockResolvedValue(entries);

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(entries);
  });
});
