import database from '../config/database';

/**
 * Database operations used to check application readiness.
 */
export const databaseHealthRepo = {
  /**
   * Checks whether the configured MySQL database accepts a query.
   * Database failures reject the returned promise.
   *
   * @returns {Promise<void>} Resolves when the query succeeds.
   */
  async checkConnection() {
    await database.execute('SELECT 1');
  },
};
