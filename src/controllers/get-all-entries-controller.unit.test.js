import { jest } from "@jest/globals";

import { createGetAllEntriesController } from "./get-all-entries-controller.js";

describe("getAllEntriesController", () => {
  // Valid case
  // retrieves all entries from the repository
  // returns the entries with HTTP status 200

  it("returns all entries with status 200", async () => {
    const entries = [
      {
        id: 1,
        category: "gratitude",
        content: "I am grateful for learning Jest.",
        createdAt: "2026-10-03T12:00:00.000Z",
      },
    ];

    const entryRepository = {
      getAllEntries: jest.fn().mockResolvedValue(entries),
    };

    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const getAllEntriesController =
      createGetAllEntriesController(entryRepository);

    await getAllEntriesController(req, res);

    expect(entryRepository.getAllEntries).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(entries);
  });
});

// Edge case: repository returns an empty array, controller returns 200 and []
it("returns an empty array with status 200 when no entries exist", async () => {
  const entryRepository = {
    getAllEntries: jest.fn().mockResolvedValue([]),
  };

  const req = {};

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const getAllEntriesController =
    createGetAllEntriesController(entryRepository);

  await getAllEntriesController(req, res);

  expect(entryRepository.getAllEntries).toHaveBeenCalledTimes(1);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([]);
});

// Invalid case
// TO REVIEW: - Add error for When repository rejects because the database operation fails.
