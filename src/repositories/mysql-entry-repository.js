// MySQL data access operations for entries stored in the MyJoyJar DB


export const createMySqlEntryRepository = (databaseConnection) => ({
    // Return all MyJoyJar entries, or empty array if none exist
    async getAllEntries() {
    const [entries] = await databaseConnection.execute(
      `SELECT
        id,
        category,
        content,
        created_at AS createdAt
      FROM entries
      ORDER BY created_at DESC`
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

  /* 
const entryRepository = createMySqlEntryRepository(database);

  // Return one entry, or null if it does not exist
  async findById(id) {
    
  },



  // Insert and return a new entry
  async create({ category, content }) {
    
  },

  // Delete an entry and return the result needed by the caller
  async deleteById(id) {
    
  },
*/
});
