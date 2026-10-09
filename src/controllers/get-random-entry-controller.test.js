import { jest } from '@jest/globals';
import { mockEntry } from './mock-entries';

import {
  createMockEntryRepo,
  createMockResponse,
} from './controller-test-helpers';

const entryRepo = createMockEntryRepo();

// repo mock required for ESM
jest.unstable_mockModule('../repositories/mysql-entry.repo', () => ({
  entryRepo,
}));

const { getRandomEntryController } =
  await import('./get-random-entry-controller');

describe('getRandomEntryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a random entry with status 200', async () => {
    // Arrange
    entryRepo.getRandom.mockResolvedValue(mockEntry);

    const req = {};
    const res = createMockResponse();

    // Act
    await getRandomEntryController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEntry);
  });

  it('returns status 404 when no entries exist', async () => {
    // Arrange
    entryRepo.getRandom.mockResolvedValue(null);

    const req = {};
    const res = createMockResponse();

    // Act
    await getRandomEntryController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No entries are available.',
    });
  });

  it('throws a contextual error when retrieving a random entry fails', async () => {
    // Arrange
    const databaseError = new Error('Database unavailable');

    entryRepo.getRandom.mockRejectedValue(databaseError);

    const req = {};
    const res = createMockResponse();

    // Act
    const result = getRandomEntryController(req, res);

    // Assert
    await expect(result).rejects.toThrow(
      'Error fetching a random entry: Database unavailable',
    );
  });
});
