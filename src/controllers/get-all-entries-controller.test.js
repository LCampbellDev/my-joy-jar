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

const { getAllEntriesController } = await import(
  "./get-all-entries-controller"
);

describe("getAllEntriesController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all entries with status 200", async () => {
    // Arrange
    const entries = mockEntries;

      entryRepo.getAll.mockResolvedValue(mockEntries);

      const req = {};
      const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEntries);
  });

  it("returns an empty array with status 200 when no entries exist", async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue([]);

    const req = {};
    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("returns status 500 when retrieving entries fails", async () => {
    // Arrange
    entryRepo.getAll.mockRejectedValue(new Error("Database unavailable"));

    const req = {};
    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unable to retrieve entries.",
    });
  });
});
