import { entryRepo } from '../repositories/mysql-entry.repo';
import { HTTP_STATUS } from '../constants/http-status';
import { RESPONSE_MESSAGES } from '../constants/messages-responses';
import { ERROR_CONTEXT } from '../constants/messages-error-context';
import { LOG_MESSAGES } from '../constants/messages-logs';

/**
 * Handles GET /api/entries/random.
 * Responds with 200 and one randomly selected entry,
 * or 404 if the jar is empty.
 * Repository failures are wrapped with context and rethrown for central error middleware.
 *
 * @param {Object} req - The Express request; no request data is used.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const getRandomEntryController = async (req, res) => {
  try {
    console.info(LOG_MESSAGES.FETCH_RANDOM_ENTRY);

    const entry = await entryRepo.getRandom();

    if (!entry) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.EMPTY_JAR,
      });
    }

    return res.status(HTTP_STATUS.OK).json(entry);
  } catch (error) {
    throw new Error(`${ERROR_CONTEXT.FETCH_RANDOM_ENTRY}: ${error.message}`, {
      cause: error,
    });
  }
};
