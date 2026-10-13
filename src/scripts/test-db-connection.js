/**
 * Checks connectivity to the configured MySQL database.
 * Logs the database name and server time on success.
 * Sets exit code 1 if the query fails and closes the pool in all cases.
 *
 * @file
 */
import { LOG_MESSAGES } from '../constants/messages-logs.js';
import dbPool from '../config/database.js';
console.info(LOG_MESSAGES.DB_CONNECTION_TEST);

try {
  const [result] = await dbPool.execute(
    'SELECT DATABASE() AS databaseName, NOW() AS connectedAt',
  );

  console.log(LOG_MESSAGES.DB_CONNECTION_SUCCESS, result[0]);
} catch (error) {
  console.error(LOG_MESSAGES.DB_CONNECTION_FAILURE, error.message);
  process.exitCode = 1;
} finally {
  console.info(LOG_MESSAGES.DB_POOL_CLOSING);
  await dbPool.end();
}
