import { jest } from "@jest/globals";
import { mockEntry } from "./mock-entries";

import {
  createMockEntryRepo,
  createMockResponse,
} from "./controller-test-helpers";

const entryRepo = createMockEntryRepo();

// repo mock required for ESM
jest.unstable_mockModule("../repositories/mysql-entry.repo", () => ({
  entryRepo,
}));

const { createEntryController } = await import("./create-entry-controller");

describe("createEntryController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns status 400 when the request body is missing", async () => {
    // Arrange
    const req = {};
    const res = createMockResponse();

    // Act
    await createEntryController(req, res);

    // Assert
    expect(entryRepo.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Validation errors.",
      errors: expect.any(Array),
    });
  });

  it("returns status 400 when the input is invalid", async () => {
    // Arrange
    const req = {
      body: {
        content: "A valid piece of content.",
      },
    };

    const res = createMockResponse();

    // Act
    await createEntryController(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Validation errors.",
      errors: ["Category is required."],
    });
  });

  it("creates an entry and returns status 201", async () => {
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
      message: "Entry created successfully.",
      entry: mockEntry,
    });
  });

  it("throws a contextual error when creating an entry fails", async () => {
    // Arrange
    entryRepo.create.mockRejectedValue(new Error("Database unavailable"));

    const req = {
      body: {
        category: mockEntry.category,
        content: mockEntry.content,
      },
    };

    const res = createMockResponse();

    // Act and Assert
    await expect(createEntryController(req, res)).rejects.toThrow(
      "Error creating entry: Database unavailable",
    );

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
