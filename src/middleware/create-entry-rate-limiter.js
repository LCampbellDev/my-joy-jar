import { rateLimit } from 'express-rate-limit';
import { RATE_LIMIT } from '../constants/rate-limit';
import { HTTP_STATUS } from '../constants/http-status';
import { RESPONSE_MESSAGES } from '../constants/response-messages';

/**
 * Creates rate-limiting middleware for entry API requests.
 * Uses an in-memory store belonging to this limiter instance.
 *
 * @param {Object} [options={}] - Optional settings for the limiter.
 * @param {number} [options.windowMs] - Request window in milliseconds.
 * @param {number} [options.limit] - Maximum requests allowed per client.
 * @returns {Function} The configured Express middleware.
 */
export const createEntryRateLimiter = ({
  windowMs = RATE_LIMIT.WINDOW_MS,
  limit = RATE_LIMIT.MAX_REQUESTS,
} = {}) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: {
      message: RESPONSE_MESSAGES.RATE_LIMIT_EXCEEDED,
    },
  });
