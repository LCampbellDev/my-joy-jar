import database from "../config/database.js";

// Return a randomised entry
export const getRandomEntry = async (req, res) => {
  const [entries] = await database.execute(
    `SELECT
      id,
      category,
      content,
      created_at AS createdAt
    FROM entries
    ORDER BY RAND()
    LIMIT 1`,
  );

  if (entries.length === 0) {
    return res.status(404).json({
      message: "No entries are available.",
    });
  }

  return res.status(200).json(entries[0]);
};
