import { jest } from "@jest/globals";
import { mockEntry } from './mock-entries';

import {
  createMockEntryRepo,
  createMockResponse,
} from './controller-test-helpers';

const entryRepo = createMockEntryRepo();

// repo mock required for ESM
jest.unstable_mockModule(
  "../repositories/mysql-entry-repository",
  () => ({
    entryRepo,
  }),
);

const { createEntryController } = await import(
  "./create-entry-controller"
);

jest.unstable_mockModule(
  '../repositories/mysql-entry-repository',
  () => ({
    entryRepo,
  }),
);

describe('createEntryController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation errors.',
      errors: ['Category is required.'],
    });

    expect(entryRepo.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Validation errors.',
      errors: ['Category is required.'],
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
});