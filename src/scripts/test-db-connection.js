import dbPool from "../config/database.js";

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
