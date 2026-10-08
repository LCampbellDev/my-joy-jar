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

const { deleteEntryController } = await import(
  "./delete-entry-controller"
);

describe('deleteEntryController', () => {
  it.todo('deletes an entry and returns status 200');
  it.todo('returns status 400 when the entry ID is invalid');
  it.todo('returns status 404 when the entry does not exist');
  it.todo('logs and throws when deleting an entry fails');
});


/*
describe("getAllEntriesController", () => {
  // Success
  // - returns all entries with status 200

  entryRepo.delete.mockResolvedValue(mockEntry);

  // Empty
  // - returns an empty array with status 200

  // Failure
  // - repository rejects
  // - logs an error explaining that entries could not be retrieved
  // - throws an error containing retrieval context
});
*/