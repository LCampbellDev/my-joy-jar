import { HTTP_STATUS } from '../constants/http-status';
import { RESPONSE_MESSAGES } from '../constants/messages-responses';

/**
 * Checks whether an error is explicitly marked as an exposable client error.
 *
 * @private
 * @param {Error} error - The error, optionally carrying status and expose properties.
 * @returns {boolean} Whether it has an integer 4xx status and expose is true.
 */
const isClientError = (error) =>
  error.expose === true &&
  Number.isInteger(error.status) &&
  error.status >= HTTP_STATUS.BAD_REQUEST &&
  error.status < HTTP_STATUS.INTERNAL_SERVER_ERROR;

/**
 * Handles errors passed through the Express middleware chain.
 * Returns 400 for malformed JSON, the supplied status for exposable client
 * errors, and a generic 500 for unexpected failures.
 * Logs unexpected failures; Morgan separately records HTTP request summaries.
 * Delegates when response headers were already sent.
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

  switch (true) {
    case error.type === 'entity.parse.failed':
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: RESPONSE_MESSAGES.INVALID_JSON,
      });

    case isClientError(error):
      return res.status(error.status).json({
        message: RESPONSE_MESSAGES.INVALID_REQUEST,
      });

    default:
      console.error('Request failed', error);

      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: RESPONSE_MESSAGES.INTERNAL_ERROR,
      });
  }
};