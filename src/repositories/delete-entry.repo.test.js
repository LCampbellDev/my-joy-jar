import { jest } from '@jest/globals';
import { mockEntries } from '../controllers/mock-entries';

const database = {
  execute: jest.fn(),
};

jest.unstable_mockModule('../config/database', () => ({
  default: database,
}));

const { entryRepo } = await import('./mysql-entry.repo');

describe('entryRepo.delete', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('retrieves and deletes an existing entry', async () => {
      // Arrange
      const mockEntry = mockEntries[0];

      database.execute
        .mockResolvedValueOnce([[mockEntry]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      // Act
      const entry = await entryRepo.delete(mockEntry.id);

      // Assert
      expect(entry).toEqual(mockEntry);

      expect(database.execute).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/WHERE id = \?/),
        [mockEntry.id],
      );

      expect(database.execute).toHaveBeenNthCalledWith(
        2,
        'DELETE FROM entries WHERE id = ?',
        [mockEntry.id],
      );
    });

    it('returns null without deleting when the entry does not exist', async () => {
      // Arrange
      database.execute.mockResolvedValueOnce([[]]);

      // Act
      const entry = await entryRepo.delete(mockEntries[0].id);

      // Assert
      expect(entry).toBeNull();
      expect(database.execute).not.toHaveBeenCalledWith(
        'DELETE FROM entries WHERE id = ?',
        expect.any(Array),
      );
    });

    it('propagates errors when retrieving the entry fails', async () => {
      // Arrange
      const databaseError = new Error('Retrieval failed');
      database.execute.mockRejectedValueOnce(databaseError);

      // Act and Assert
      await expect(
        entryRepo.delete(mockEntries[0].id),
      ).rejects.toBe(databaseError);

      expect(database.execute).not.toHaveBeenCalledWith(
        'DELETE FROM entries WHERE id = ?',
        expect.any(Array),
      );
    });

    it('propagates errors when deleting the entry fails', async () => {
      // Arrange
      const mockEntry = mockEntries[0];
      const databaseError = new Error('Delete failed');

      database.execute
        .mockResolvedValueOnce([[mockEntry]])
        .mockRejectedValueOnce(databaseError);

      // Act and Assert
      await expect(
        entryRepo.delete(mockEntry.id),
      ).rejects.toBe(databaseError);
    });
  });
