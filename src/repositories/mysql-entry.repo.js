/**
 * MySQL data access operations for MyJoyJar entries.
 *
 * @file
 */

/**
 * An entry retrieved from the database.
 *
 * @typedef {Object} Entry
 * @property {number} id - The unique entry ID.
 * @property {'gratitude'|'compliment'|'joyful-moment'} category - The entry category.
 * @property {string} content - The saved entry text.
 * @property {Date} createdAt - The creation timestamp.
 */

import database from "../config/database";

/**
 * Helper function - Retrieves an entry by ID for create and delete operations.
 *
 * @private
 * @param {number|string} id - The entry ID, supplied as a number or numeric string.
 * @returns {Promise<Entry|null>} The matching entry, or null if none exists.
 */

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

/**
 * Repository for retrieving, creating and deleting MyJoyJar entries.
 * Database failures reject the returned promises.
 */
export const entryRepo = {
  /**
   * Retrieves all entries, ordered from newest to oldest.
   *
   * @returns {Promise<Entry[]>} All entries, or an empty array if none exist.
   */
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

  /**
   * Retrieves one randomly selected entry.
   *
   * @returns {Promise<Entry|null>} An entry, or null if the jar is empty.
   */
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

  /**
   * Inserts an entry and retrieves it using its generated ID.
   *
   * @param {Object} input - The validated entry data.
   * @param {string} input.category - The entry category.
   * @param {string} input.content - The trimmed entry text.
   * @returns {Promise<Entry|null>} The created entry, or null if the subsequent lookup finds no entry.
   */
  async create({ category, content }) {
    const [result] = await database.execute(
      `INSERT INTO entries (category, content)
       VALUES (?, ?)`,
      [category, content],
    );

    return getById(result.insertId);
  },

  /**
   * Retrieves an entry and deletes it if found.
   *
   * @param {number|string} id - The entry ID, supplied as a number or numeric string.
   * @returns {Promise<Entry|null>} The deleted entry, or null if no matching entry was found.
   */
  async delete(id) {
    const entry = await getById(id);

    if (!entry) {
      return null;
    }

    await database.execute("DELETE FROM entries WHERE id = ?", [id]);

    return entry;
  },
};
