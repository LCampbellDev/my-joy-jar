import entriesList from "../data/entries.js";
import { ALLOWED_CATEGORIES } from "../constants/entry-categories.js";

// TODO: Make async when entries are retrieved from MySQL
export const getAllEntries = (req, res) => {
  return res.status(200).json(entriesList);
};

// Create a new entry from the category and content in the request body.
// TODO: Make async when entries are saved to MySQL.
export const createEntry = (req, res) => {
  const { category, content } = req.body ?? {};

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

  const nextId =
    entriesList.length === 0
      ? 1
      : Math.max(...entriesList.map((entry) => entry.id)) + 1;

  const newEntry = {
    id: nextId,
    category,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  entriesList.push(newEntry);

  return res.status(201).json(newEntry);
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
