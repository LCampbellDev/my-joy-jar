import { jest } from "@jest/globals";
import { mockEntries } from './mock-entries';

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

describe('createEntryController', () => {
  it.todo('creates an entry and returns status 201');
  it.todo('returns status 400 when the input is invalid');
  it.todo('logs and throws when creating an entry fails');
});

/*
describe("getAllEntriesController", () => {
  // Success
  // - returns all entries with status 200

  entryRepo.create.mockResolvedValue(mockEntry);

  // Empty
  // - returns an empty array with status 200

  // Failure
  // - repository rejects
  // - logs an error explaining that entries could not be retrieved
  // - throws an error containing retrieval context
});
*/