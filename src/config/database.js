/**
 * Shared promise-based MySQL connection pool.
 * Uses connection settings loaded from environment variables.
 * Reused by repository methods to execute database queries.
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const database = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default database;
