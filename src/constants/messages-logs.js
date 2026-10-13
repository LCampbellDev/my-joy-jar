/**
 * Informational messages for application operations.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const LOG_MESSAGES = Object.freeze({
  // Entry operation messages
  FETCH_ENTRIES: 'Fetching entries',
  FETCH_RANDOM_ENTRY: 'Fetching a random entry',
  CREATE_ENTRY: 'Creating entry',
  DELETE_ENTRY: 'Deleting entry',

  // DB connection messages
  DB_CONNECTION_TEST: 'Testing database connection',
  DB_CONNECTION_SUCCESS: 'Database connection successful:',
  DB_CONNECTION_FAILURE: 'Database connection failed:',
  DB_POOL_CLOSING: 'Closing database connection pool',
});
