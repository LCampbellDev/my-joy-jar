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

describe('GET /api/entries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all entries with status 200', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue(mockEntries);

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockEntries);
  });

  it('returns an empty array with status 200 when no entries exist', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue([]);

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
    });
  });