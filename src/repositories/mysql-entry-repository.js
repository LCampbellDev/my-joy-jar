// MySQL data access operations for entries stored in the MyJoyJar DB

export const createMySqlEntryRepository = (databaseConnection) => {
  // Private helper shared by create and delete operations.
  const getEntryById = async (id) => {
    const [entries] = await databaseConnection.execute(
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

  return {
    // Return all MyJoyJar entries, or empty array if none exist
    async getAllEntries() {
      const [entries] = await databaseConnection.execute(
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

    // Return one random entry, or null if the jar is empty
    async getRandomEntry() {
      const [entries] = await databaseConnection.execute(
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
    async createEntry({ category, content }) {
      const [result] = await databaseConnection.execute(
        `INSERT INTO entries (category, content)
         VALUES (?, ?)`,
        [category, content],
      );

      return getEntryById(result.insertId);
    },

    // Delete and return an entry, or null if it does not exist.
    async deleteEntryById(id) {
      const entry = await getEntryById(id);

      if (!entry) {
        return null;
      }

      await databaseConnection.execute("DELETE FROM entries WHERE id = ?", [
        id,
      ]);

      return entry;
    },
  };
};
