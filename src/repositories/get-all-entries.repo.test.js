import { jest } from '@jest/globals';
import { mockEntries } from '../../tests/mock-entries';

const database = {
  execute: jest.fn(),
};

// repo mock required for ESM
jest.unstable_mockModule('../config/database', () => ({
  default: database,
}));

const { entryRepo } = await import('./mysql-entry.repo');

describe('entryRepo.getAll', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns a page of entries and the total count', async () => {
    // Arrange
    const options = {
      limit: 10,
      offset: 20,
    };

    database.execute
      .mockResolvedValueOnce([mockEntries])
      .mockResolvedValueOnce([[{ total: 25 }]]);

    // Act
    const result = await entryRepo.getAll(options);

    // Assert
    expect(result).toEqual({
      entries: mockEntries,
      total: 25,
    });

    expect(database.execute).toHaveBeenNthCalledWith(
      1,
      expect.stringMatching(
        /ORDER BY created_at DESC, id DESC\s+LIMIT \? OFFSET \?/,
      ),
      [10, 20],
    );

    expect(database.execute).toHaveBeenNthCalledWith(
      2,
      'SELECT COUNT(*) AS total FROM entries',
    );
  });

  it('converts a string database count to a number', async () => {
    // Arrange
    const options = {
      limit: 10,
      offset: 0,
    };

    database.execute
      .mockResolvedValueOnce([mockEntries])
      .mockResolvedValueOnce([[{ total: '25' }]]);

    // Act
    const result = await entryRepo.getAll(options);

    // Assert
    expect(result).toEqual({
      entries: mockEntries,
      total: 25,
    });
  });

  it('returns an empty page and zero total when no entries exist', async () => {
    // Arrange
    const options = {
      limit: 10,
      offset: 0,
    };

    database.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([[{ total: 0 }]]);

    // Act
    const result = await entryRepo.getAll(options);

    // Assert
    expect(result).toEqual({
      entries: [],
      total: 0,
    });
  });

  it('returns an empty page with the total when the offset exceeds the entry count', async () => {
    // Arrange
    const options = {
      limit: 10,
      offset: 30,
    };

    database.execute
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([[{ total: 25 }]]);

    // Act
    const result = await entryRepo.getAll(options);

    // Assert
    expect(result).toEqual({
      entries: [],
      total: 25,
    });

    expect(database.execute).toHaveBeenCalledWith(
      expect.stringContaining('LIMIT ? OFFSET ?'),
      [10, 30],
    );
  });

  it('propagates errors when retrieving entries fails', async () => {
    // Arrange
    const options = {
      limit: 10,
      offset: 0,
    };

    const databaseError = new Error('Entries query failed');
    database.execute.mockRejectedValueOnce(databaseError);

    // Act
    const result = entryRepo.getAll(options);

    // Assert
    await expect(result).rejects.toBe(databaseError);

    expect(database.execute).not.toHaveBeenCalledWith(
      'SELECT COUNT(*) AS total FROM entries',
    );
  });

  it('propagates errors when retrieving the total count fails', async () => {
    // Arrange
    const options = {
      limit: 10,
      offset: 0,
    };

    const databaseError = new Error('Count query failed');

    database.execute
      .mockResolvedValueOnce([mockEntries])
      .mockRejectedValueOnce(databaseError);

    // Act
    const result = entryRepo.getAll(options);

    // Assert
    await expect(result).rejects.toBe(databaseError);
  });
});
