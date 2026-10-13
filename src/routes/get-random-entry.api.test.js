import { jest } from '@jest/globals';
import request from 'supertest';
import { mockEntry } from '../../tests/mock-entries';
import { createMockEntryRepo } from '../../tests/test-helpers';

const entryRepo = createMockEntryRepo();

// repo mock required for ESM
jest.unstable_mockModule('../repositories/mysql-entry.repo', () => ({
  entryRepo,
}));

const { default: app } = await import('../app');

describe('GET /api/entries/random', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns a random entry with status 200', async () => {
    // Arrange
    entryRepo.getRandom.mockResolvedValue(mockEntry);

    // Act
    const response = await request(app).get('/api/entries/random');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockEntry);
  });

  it('returns status 404 when no entries exist', async () => {
    // Arrange
    entryRepo.getRandom.mockResolvedValue(null);

    // Act
    const response = await request(app).get('/api/entries/random');

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      message: 'No entries are available.',
    });
  });

  it('returns status 500 when retrieving a random entry fails', async () => {
    // Arrange
    entryRepo.getRandom.mockRejectedValue(new Error('Database unavailable'));

    // Act
    const response = await request(app).get('/api/entries/random');

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({
      message: 'Something went wrong. Please try again later.',
    });
  });
});
