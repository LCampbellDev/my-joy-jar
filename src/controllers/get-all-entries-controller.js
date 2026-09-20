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
