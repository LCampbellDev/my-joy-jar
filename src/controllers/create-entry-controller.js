import database from "../config/database.js";
import { validateEntryInput } from "../validation/validate-entry-input.js";

// Create a new entry from the category and content in the request body.
export const createEntry = async (req, res) => {
  const { category, content } = req.body ?? {};
  const validationErrors = validateEntryInput({ category, content });

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
