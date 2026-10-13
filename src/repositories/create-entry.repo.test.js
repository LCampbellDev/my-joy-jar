import { jest } from '@jest/globals';
import { mockEntry } from '../../tests/mock-entries';

const database = {
  execute: jest.fn(),
};

// repo mock required for ESM
jest.unstable_mockModule('../config/database', () => ({
  default: database,
}));

const { entryRepo } = await import('./mysql-entry.repo');

describe('entryRepo.create', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('inserts an entry and retrieves it using the new ID', async () => {
    // Arrange
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
    const input = {
      category: mockEntry.category,
      content: mockEntry.content,
    };

    database.execute.mockRejectedValueOnce(databaseError);

    // Act
    const result = entryRepo.create(input);

    // Assert
    await expect(result).rejects.toBe(databaseError);
  });

  it('propagates errors when retrieving the created entry fails', async () => {
    // Arrange
    const databaseError = new Error('Retrieval failed');
    const input = {
      category: mockEntry.category,
      content: mockEntry.content,
    };

    database.execute
      .mockResolvedValueOnce([{ insertId: mockEntry.id }])
      .mockRejectedValueOnce(databaseError);

    // Act
    const result = entryRepo.create(input);

    // Assert
    await expect(result).rejects.toBe(databaseError);
  });
});
