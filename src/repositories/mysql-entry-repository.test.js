import { jest } from '@jest/globals';
import { mockEntries } from '../controllers/mock-entries';

const database = {
  execute: jest.fn(),
};

jest.unstable_mockModule('../config/database', () => ({
  default: database,
}));

const { entryRepo } = await import('./mysql-entry-repository');

describe('entryRepo', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getAll', () => {
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

    describe('getRandom', () => {
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

    describe('create', () => {
    it('inserts an entry and retrieves it using the new ID', async () => {
      // Arrange
      const mockEntry = mockEntries[0];
      const input = {
        category: mockEntry.category,
        content: mockEntry.content,
      };

      database.execute
        .mockResolvedValueOnce([{ insertId: mockEntry.id }])
        .mockResolvedValueOnce([[mockEntry]]);

      // Act
      const entry = await entryRepo.create(input);

      // Assert
      expect(entry).toEqual(mockEntry);

      expect(database.execute).toHaveBeenNthCalledWith(
        1,
        expect.stringMatching(/INSERT INTO entries/),
        [input.category, input.content],
      );

      expect(database.execute).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(/WHERE id = \?/),
        [mockEntry.id],
      );
    });

    it('propagates errors when inserting fails', async () => {
      // Arrange
      const databaseError = new Error('Insert failed');
      database.execute.mockRejectedValueOnce(databaseError);

      const input = {
        category: mockEntries[0].category,
        content: mockEntries[0].content,
      };

      // Act and Assert
      await expect(entryRepo.create(input)).rejects.toBe(databaseError);
    });

    it('propagates errors when retrieving the created entry fails', async () => {
      // Arrange
      const databaseError = new Error('Retrieval failed');

      database.execute
        .mockResolvedValueOnce([{ insertId: mockEntries[0].id }])
        .mockRejectedValueOnce(databaseError);

      const input = {
        category: mockEntries[0].category,
        content: mockEntries[0].content,
      };

      // Act and Assert
      await expect(entryRepo.create(input)).rejects.toBe(databaseError);
    });

      describe('delete', () => {
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
  });
});