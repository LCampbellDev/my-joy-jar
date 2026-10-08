import { jest } from '@jest/globals';
import { mockEntries } from '../controllers/mock-entries';

const database = {
  execute: jest.fn(),
};

jest.unstable_mockModule('../config/database', () => ({
  default: database,
}));

const { entryRepo } = await import('./mysql-entry.repo');

describe('entryRepo.getRandom', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('returns a single entry from the database', async () => {
      // Arrange
      const mockEntry = mockEntries[0];
      database.execute.mockResolvedValue([[mockEntry]]);

      // Act
      const entry = await entryRepo.getRandom();

      // Assert
      expect(entry).toEqual(mockEntry);
      expect(database.execute).toHaveBeenCalledWith(
        expect.stringMatching(/ORDER BY RAND\(\)\s+LIMIT 1/),
      );
    });

    it('returns null when no entries exist', async () => {
      // Arrange
      database.execute.mockResolvedValue([[]]);

      // Act
      const entry = await entryRepo.getRandom();

      // Assert
      expect(entry).toBeNull();
    });

    it('propagates database errors', async () => {
      // Arrange
      const databaseError = new Error('Database unavailable');
      database.execute.mockRejectedValue(databaseError);

      // Act and Assert
      await expect(entryRepo.getRandom()).rejects.toBe(databaseError);
    });
  });