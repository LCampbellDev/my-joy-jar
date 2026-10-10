import { jest } from '@jest/globals';
import { mockEntry } from '../../tests/mock-entries';

import {
  createMockEntryRepo,
  createMockResponse,
} from '../../tests/test-helpers';

const entryRepo = createMockEntryRepo();

// repo mock required for ESM
jest.unstable_mockModule('../repositories/mysql-entry.repo', () => ({
  entryRepo,
}));

const { createEntryController } = await import('./create-entry-controller');

describe('createEntryController', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns status 400 when the request body is missing', async () => {
    // Arrange
    const req = {};
    const res = createMockResponse();

    // Act
    await createEntryController(req, res);

    // Assert
    expect(entryRepo.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation errors.',
      errors: expect.any(Array),
    });
  });

  it('creates an entry and returns status 201', async () => {
    // Arrange
    entryRepo.create.mockResolvedValue(mockEntry);

    const req = {
      body: {
        category: mockEntry.category,
        content: `  ${mockEntry.content}  `,
      },
    };

    const res = createMockResponse();

    // Act
    await createEntryController(req, res);

    // Assert
    expect(entryRepo.create).toHaveBeenCalledWith({
      category: mockEntry.category,
      content: mockEntry.content,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Entry created successfully.',
      entry: mockEntry,
    });
  });

  it('returns status 400 when the input is invalid', async () => {
    // Arrange
    const req = {
      body: {
        content: 'A valid piece of content.',
      },
    };

    const res = createMockResponse();

    // Act
    await createEntryController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(entryRepo.create).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation errors.',
      errors: ['Category is required.'],
    });
  });
  
  it('throws a contextual error when creating an entry fails', async () => {
  // Arrange
  const databaseError = new Error('Database unavailable');
  entryRepo.create.mockRejectedValue(databaseError);

  const req = {
    body: {
      category: mockEntry.category,
      content: mockEntry.content,
    },
  };

  const res = createMockResponse();

  // Act
  const result = createEntryController(req, res);

  // Assert
  await expect(result).rejects.toThrow(
    'Error creating entry: Database unavailable',
  );
  await expect(result).rejects.toHaveProperty('cause', databaseError);

  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
  });
});
