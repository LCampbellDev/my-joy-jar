import entriesList from "../data/entries.js";
import { ALLOWED_CATEGORIES } from "../constants/entry-categories.js";
import database from "../config/database.js";

// Return all entries
export const getAllEntries = async (req, res) => {
  const [entries] = await database.execute(`
    SELECT
      id,
      category,
      content,
      created_at AS createdAt
    FROM entries
    ORDER BY created_at DESC
  `);

  return res.status(200).json(entries);
};

// Create a new entry from the category and content in the request body.
// TODO: Make async when entries are saved to MySQL.
export const createEntry = async (req, res) => {
  const { category, content } = req.body ?? {};

  // request validation
  if (!category || !content) {
    return res.status(400).json({
      message: "Category and content are required.",
    });
  }

  if (!ALLOWED_CATEGORIES.includes(category)) {
    return res.status(400).json({
      message: `Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`,
    });
  }

  if (typeof content !== "string" || !content.trim()) {
    return res.status(400).json({
      message: "Content must be a non-empty string.",
    });
  }

  const [result] = await database.execute(
    "INSERT INTO entries (category, content) VALUES (?, ?)",
    [category, content.trim()],
  );

  // Insert valid data into MySQL
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

  // Return succes status
  return res.status(201).json({
    message: "Entry created successfully.",
    entry: entries[0],
  });
};

// Return a randomised entry
export const getRandomEntry = (req, res) => {
  if (entriesList.length === 0) {
    return res.status(404).json({
      message: "No entries are available.",
    });
  }

  const randomIndex = Math.floor(Math.random() * entriesList.length);
  const randomEntry = entriesList[randomIndex];

  return res.status(200).json(randomEntry);
};

// Delete an entry using its ID.
export const deleteEntry = (req, res) => {
  const entryId = Number(req.params.id);

  if (!Number.isInteger(entryId)) {
    return res.status(400).json({
      message: "Entry ID must be a number.",
    });
  }

  const entryIndex = entriesList.findIndex((entry) => entry.id === entryId);

  if (entryIndex === -1) {
    return res.status(404).json({
      message: "Entry not found.",
    });
  }

  const [deletedEntry] = entriesList.splice(entryIndex, 1);

  return res.status(200).json({
    message: "Entry deleted successfully.",
    entry: deletedEntry,
  });
};
