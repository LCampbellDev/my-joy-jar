/**
 * Checks connectivity to the configured MySQL database.
 * Logs the database name and server time on success.
 * Sets exit code 1 if the query fails and closes the pool in all cases.
 *
 * @file
 */
import dbPool from "../config/database";

try {
  const [result] = await dbPool.execute(
    "SELECT DATABASE() AS databaseName, NOW() AS connectedAt",
  );

  console.log("Database connection successful:", result[0]);
} catch (error) {
  console.error("Database connection failed:", error.message);
  process.exitCode = 1;
} finally {
  await dbPool.end();
}
