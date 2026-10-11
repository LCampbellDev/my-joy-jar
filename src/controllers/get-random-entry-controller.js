import { entryRepo } from '../repositories/mysql-entry.repo';
import { HTTP_STATUS } from '../constants/http-status';
import { RESPONSE_MESSAGES } from '../constants/response-messages';
import { ERROR_CONTEXT } from '../constants/error-context';

/**
 * Handles GET /api/entries/random.
 * Responds with 200 and one randomly selected entry,
 * or 404 if the jar is empty.
 * Repository failures are logged and rethrown for central error middleware.
 *
 * @param {Object} req - The Express request; no request data is used.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const getRandomEntryController = async (req, res) => {
  try {
    console.info('Fetching a random entry');

    const entry = await entryRepo.getRandom();

    if (!entry) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.EMPTY_JAR,
      });
    }

    return res.status(HTTP_STATUS.OK).json(entry);
  } catch (error) {
    console.error(ERROR_CONTEXT.FETCH_RANDOM_ENTRY, error);

    throw new Error(`${ERROR_CONTEXT.FETCH_RANDOM_ENTRY}: ${error.message}`, {
      cause: error,
    });
  }
};
