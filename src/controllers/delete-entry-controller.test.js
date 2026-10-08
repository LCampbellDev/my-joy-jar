import { jest } from "@jest/globals";
import { mockEntries } from './mock-entries';

import {
  createMockEntryRepo,
  createMockResponse,
} from './controller-test-helpers';


const entryRepo = createMockEntryRepo();

// repo mock required for ESM
jest.unstable_mockModule(
  "../repositories/mysql-entry.repo",
  () => ({
    entryRepo,
  }),
);

const mockEntry = mockEntries[0];

// Repo mock required for ESM
jest.unstable_mockModule(
  '../repositories/mysql-entry.repo',
  () => ({
    entryRepo,
  }),
);

const { deleteEntryController } = await import(
  './delete-entry-controller'
);

describe('deleteEntryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes an entry and returns status 200', async () => {
    // Arrange
    entryRepo.delete.mockResolvedValue(mockEntry);

    const req = {
      params: {
        id: String(mockEntry.id),
      },
    };

    const res = createMockResponse();

    // Act
    await deleteEntryController(req, res);

    // Assert
    expect(entryRepo.delete).toHaveBeenCalledWith(mockEntry.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Entry deleted successfully.',
      entry: mockEntry,
    });
  });

  it('returns status 400 when the entry ID is invalid', async () => {
    // Arrange
    const req = {
      params: {
        id: 'abc',
      },
    };

    const res = createMockResponse();

    // Act
    await deleteEntryController(req, res);

    // Assert
    expect(entryRepo.delete).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Entry ID must be a positive integer.',
    });
  });

  it('returns status 404 when the entry does not exist', async () => {
    // Arrange
    entryRepo.delete.mockResolvedValue(null);

    const req = {
      params: {
        id: String(mockEntry.id),
      },
    };

    const res = createMockResponse();

    // Act
    await deleteEntryController(req, res);

    // Assert
    expect(entryRepo.delete).toHaveBeenCalledWith(mockEntry.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Entry not found.',
    });
  });

  it('logs and throws when deleting an entry fails', async () => {
    // Arrange
    const databaseError = new Error('Database unavailable');
    entryRepo.delete.mockRejectedValue(databaseError);

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const req = {
      params: {
        id: String(mockEntry.id),
      },
    };

    const res = createMockResponse();

    try {
      // Act and Assert
      await expect(deleteEntryController(req, res)).rejects.toThrow(
        'Error deleting entry: Database unavailable',
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error deleting entry',
        databaseError,
      );

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});