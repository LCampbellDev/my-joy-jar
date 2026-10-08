import { jest } from '@jest/globals';
import { mockEntries } from '../controllers/mock-entries';

const database = {
  execute: jest.fn(),
};

jest.unstable_mockModule('../config/database', () => ({
  default: database,
}));

const { entryRepo } = await import('./mysql-entry.repo');

describe('entryRepo.getAll', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns all entries from the database', async () => {
      // Arrange
      database.execute.mockResolvedValue([mockEntries]);

      // Act
      const entries = await entryRepo.getAll();

      // Assert
      expect(entries).toEqual(mockEntries);
      expect(database.execute).toHaveBeenCalledWith(
        expect.stringMatching(/ORDER BY created_at DESC/),
      );
    });

    it('returns an empty array when no entries exist', async () => {
      // Arrange
      database.execute.mockResolvedValue([[]]);

      // Act
      const entries = await entryRepo.getAll();

      // Assert
      expect(entries).toEqual([]);
    });

    it('propagates database errors', async () => {
      // Arrange
      const databaseError = new Error('Database unavailable');
      database.execute.mockRejectedValue(databaseError);

      // Act and Assert
      await expect(entryRepo.getAll()).rejects.toBe(databaseError);
    });
  });