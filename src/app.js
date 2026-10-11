import express from 'express';
import morgan from 'morgan';
import { createEntryRouter } from './routes/entries';
import { HTTP_STATUS } from './constants/http-status';
import { RESPONSE_MESSAGES } from './constants/response-messages';

/**
 * Express application configured with request logging,
 * JSON body parsing, entry routes and central error handling.
 */
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/entries', createEntryRouter());

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

  console.error('Request failed', error);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: RESPONSE_MESSAGES.INTERNAL_ERROR,
  });
});

export default app;
