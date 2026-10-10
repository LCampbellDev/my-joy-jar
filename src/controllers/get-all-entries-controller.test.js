import { jest } from '@jest/globals';
import { mockEntries } from './mock-entries';

import {
  createMockEntryRepo,
  createMockResponse,
} from './controller-test-helpers';

const entryRepo = createMockEntryRepo();

// repo mock required for ESM
jest.unstable_mockModule('../repositories/mysql-entry.repo', () => ({
  entryRepo,
}));

const { getAllEntriesController } =
  await import('./get-all-entries-controller');

describe('getAllEntriesController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws a contextual error when retrieving entries fails', async () => {
    // Arrange
    const databaseError = new Error('Database unavailable');

    entryRepo.getAll.mockRejectedValue(databaseError);

    const req = {};
    const res = createMockResponse();

    // Act
    const result = getAllEntriesController(req, res);

    // Assert
    await expect(result).rejects.toThrow(
      'Error fetching all entries: Database unavailable',
    );
  });

  it('returns an empty array with status 200 when no entries exist', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue([]);

    const req = {};
    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('returns all entries with status 200', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue(mockEntries);

    const req = {};
    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEntries);
  });
});
