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

const { getRandomEntryController } = await import(
  "./get-random-entry-controller"
);

describe('getRandomEntryController', () => {
  it.todo('returns a random entry with status 200');
  it.todo('returns status 404 when no entries exist');
  it.todo('logs and throws when retrieving a random entry fails');
});

/*
describe("getAllEntriesController", () => {
  // Success
  // - returns all entries with status 200

  entryRepo.getRandom.mockResolvedValue(mockEntry);
  
  // Empty
  // - returns an empty array with status 200

  // Failure
  // - repository rejects
  // - logs an error explaining that entries could not be retrieved
  // - throws an error containing retrieval context
});
*/