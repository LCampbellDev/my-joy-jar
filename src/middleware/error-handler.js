import { HTTP_STATUS } from '../constants/http-status';
import { RESPONSE_MESSAGES } from '../constants/response-messages';

/**
 * Handles errors passed through the Express middleware chain.
 * Logs detailed request failures centrally.
 * Controllers preserve error context without logging it again.
 * Morgan separately logs HTTP request summaries.
 * Sends a generic 500 response, or delegates to the next error handler
 * if response headers were already sent.
 *
 * @param {Error} error - The request error.
 * @param {Object} req - The Express request.
 * @param {Object} res - The Express response.
 * @param {Function} next - Passes the error to the next handler.
 * @returns {Object|undefined} The response, or the result of delegation.
 */

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error('Request failed', error);

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: RESPONSE_MESSAGES.INTERNAL_ERROR,
  });
};
