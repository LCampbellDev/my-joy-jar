import { jest } from '@jest/globals';
import request from 'supertest';
import { mockEntries } from '../controllers/mock-entries';
import { createMockEntryRepo } from '../controllers/controller-test-helpers';

const entryRepo = createMockEntryRepo();

jest.unstable_mockModule(
  '../repositories/mysql-entry-repository',
  () => ({
    entryRepo,
  }),
);

const { default: app } = await import('../app');

describe('GET /api/entries/random', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a random entry with status 200', async () => {
    // Arrange
    const mockEntry = mockEntries[0];
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
  });
});
