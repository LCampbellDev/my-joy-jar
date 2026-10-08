// MySQL data access operations for entries stored in the MyJoyJar DB

import database from "../config/database";

// Private helper shared by create and delete operations.
const getById = async (id) => {
  const [entries] = await database.execute(
    `SELECT
      id,
      category,
      content,
      created_at AS createdAt
    FROM entries
    WHERE id = ?`,
    [id],
  );

  return entries[0] ?? null;
};

export const entryRepo = {
  // Return all entries, or an empty array if none exist.
  async getAll() {
    const [entries] = await database.execute(
      `SELECT
        id,
        category,
        content,
        created_at AS createdAt
      FROM entries
      ORDER BY created_at DESC`,
    );

    return entries;
  },

  // Return one random entry, or null if the jar is empty.
  async getRandom() {
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

    return entries[0] ?? null;
  },

  // Insert and return a new entry.
  async create({ category, content }) {
    const [result] = await database.execute(
      `INSERT INTO entries (category, content)
       VALUES (?, ?)`,
      [category, content],
    );

    return getById(result.insertId);
  },

  // Delete and return an entry, or null if it does not exist.
  async delete(id) {
    const entry = await getById(id);

    if (!entry) {
      return null;
    }

    await database.execute("DELETE FROM entries WHERE id = ?", [id]);

    return entry;
  },
};