import { jest } from "@jest/globals";

const entryRepo = {
  getAll: jest.fn(),
};

jest.unstable_mockModule(
  "../repositories/mysql-entry-repository",
  () => ({
    entryRepo,
  }),
);

const { getAllEntriesController } = await import(
  "./get-all-entries-controller"
);

const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe("getAllEntriesController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all entries with status 200", async () => {
    // Arrange
    const entries = [
      {
        id: 1,
        category: "gratitude",
        content: "I am grateful for learning Jest.",
        createdAt: "2026-10-03T12:00:00.000Z",
      },
    ];

    entryRepo.getAll.mockResolvedValue(entries);

    const req = {};
    const res = createMockResponse();

    // Act
    await getAllEntriesController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(entries);
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
