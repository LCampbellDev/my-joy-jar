import express from "express";
import morgan from "morgan";

import { entryRoutes } from "./routes/entries";

/**
 * Express application configured with request logging,
 * JSON body parsing, entry routes and central error handling.
 */
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/entries", entryRoutes());

/**
 * Central error middleware.
 * Sends a generic JSON 500 response without exposing internal error details.
 * Delegates to the next error handler if response headers have already been sent.
 *
 * @param {Error} error - The error passed through Express.
 * @param {Object} req - The Express request.
 * @param {Object} res - The Express response.
 * @param {Function} next - Passes the error to the next error handler.
 */
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Request failed", error);

  return res.status(500).json({
    message: "Something went wrong. Please try again later.",
  });
});

export default app;
