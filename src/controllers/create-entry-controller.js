import { ALLOWED_CATEGORIES } from "../constants/entry-categories.js";
import database from "../config/database.js";

// Create a new entry from the category and content in the request body.
export const createEntry = async (req, res) => {
  const { category, content } = req.body ?? {};
  const validationErrors = [];

  // Collect and return all request validation errors.
  if (category === undefined || category === null || category === "") {
    validationErrors.push("Category is required.");
  } else if (typeof category !== "string") {
    validationErrors.push("Category must be a string.");
  } else if (!ALLOWED_CATEGORIES.includes(category)) {
    validationErrors.push(
      `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`,
    );
  }

  if (content === undefined || content === null || content === "") {
    validationErrors.push("Content is required.");
  } else if (typeof content !== "string") {
    validationErrors.push("Content must be a string.");
  } else if (!content.trim()) {
    validationErrors.push("Content cannot be empty.");
  }

  if (validationErrors.length > 0) {
    return res.status(400).json({
      message: "Validation errors.",
      errors: validationErrors,
    });
  }

  // Insert the valid data into MySQL.
  const [result] = await database.execute(
    "INSERT INTO entries (category, content) VALUES (?, ?)",
    [category, content.trim()],
  );

  // Retrieve the newly created entry.
  const [entries] = await database.execute(
    `SELECT
      id,
      category,
      content,
      created_at AS createdAt
    FROM entries
    WHERE id = ?`,
    [result.insertId],
  );

  return res.status(201).json({
    message: "Entry created successfully.",
    entry: entries[0],
  });
};
