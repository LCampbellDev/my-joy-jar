import { databaseHealthRepo } from '../repositories/database-health.repo';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_CONTEXT } from '../constants/messages-error-context';
import { HEALTH_STATUS } from '../constants/health-status';

/**
 * Handles GET /ready.
 * Responds with 200 when MySQL accepts a query, or 503 when it fails.
 * Logs failures without exposing database details in the response.
 * This checks connectivity, not the database schema or every API operation.
 *
 * @param {Object} req - The Express request; no request data is used.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const readinessController = async (req, res) => {
  try {
    await databaseHealthRepo.checkConnection();

    return res.status(HTTP_STATUS.OK).json({
      status: HEALTH_STATUS.READY,
    });
  } catch (error) {
    console.error(ERROR_CONTEXT.CHECK_READINESS, error);

    return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
      status: HEALTH_STATUS.NOT_READY,
    });
  }
};
