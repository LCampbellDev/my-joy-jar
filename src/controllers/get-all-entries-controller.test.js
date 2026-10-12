import { jest } from '@jest/globals';
import { mockEntries } from '../../tests/mock-entries';

import {
  createMockEntryRepo,
  createMockResponse,
} from '../../tests/test-helpers';

const entryRepo = createMockEntryRepo();

// Repository mock must be registered before importing the ESM controller.
jest.unstable_mockModule('../repositories/mysql-entry.repo', () => ({
  entryRepo,
}));

const { getAllEntriesController } =
  await import('./get-all-entries-controller');

describe('getAllEntriesController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns the default page with status 200 when pagination is omitted', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue({
      entries: mockEntries,
      total: 25,
    });

    const expectedResponse = {
    entries: mockEntries,
    pagination: {
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    },
  };

    const req = {
      query: {},
    };

    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(entryRepo.getAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('returns the requested page and page size with status 200', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue({
      entries: mockEntries,
      total: 12,
    });

    const req = {
      query: {
        page: '2',
        limit: '5',
      },
    };

    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(entryRepo.getAll).toHaveBeenCalledWith({
      limit: 5,
      offset: 5,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      entries: mockEntries,
      pagination: {
        page: 2,
        limit: 5,
        total: 12,
        totalPages: 3,
      },
    });
  });

  it('returns an empty page with status 200 when no entries exist', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue({
      entries: [],
      total: 0,
    });

    const req = {
      query: {},
    };

    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      entries: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });
  });

  it('returns an empty page with status 200 when the requested page exceeds the total pages', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue({
      entries: [],
      total: 25,
    });

    const req = {
      query: {
        page: '4',
        limit: '10',
      },
    };

    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(entryRepo.getAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 30,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      entries: [],
      pagination: {
        page: 4,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    });
  });

  it('returns status 400 without retrieving entries when pagination is invalid', async () => {
    // Arrange
    const req = {
      query: {
        page: '0',
        limit: '101',
      },
    };

    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(entryRepo.getAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation errors.',
      errors: [
        'Page must be a positive integer.',
        'Limit must be no greater than 100.',
      ],
    });
  });

  it('throws a contextual error when retrieving entries fails', async () => {
    // Arrange
    const databaseError = new Error('Database unavailable');
    entryRepo.getAll.mockRejectedValue(databaseError);

    const req = {
      query: {},
    };

    const res = createMockResponse();

    // Act
    const result = getAllEntriesController(req, res);

    // Assert
    await expect(result).rejects.toThrow(
      'Error fetching all entries: Database unavailable',
    );
    await expect(result).rejects.toHaveProperty('cause', databaseError);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
