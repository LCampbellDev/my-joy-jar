import { entryRepo } from '../repositories/mysql-entry.repo';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_CONTEXT } from '../constants/error-context';

/**
 * Handles GET /api/entries.
 * Responds with 200 and all entries ordered from newest to oldest,
 * or an empty array if no entries exist.
 * Repository failures are logged and rethrown for central error middleware.
 *
 * @param {Object} req - The Express request; no request data is used.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const getAllEntriesController = async (req, res) => {
  try {
    console.info('Fetching all entries');

    const entries = await entryRepo.getAll();

    return res.status(HTTP_STATUS.OK).json(entries);
  } catch (error) {
    console.error(ERROR_CONTEXT.FETCH_ENTRIES, error);

    throw new Error(`${ERROR_CONTEXT.FETCH_ENTRIES}: ${error.message}`, {
      cause: error,
    });
  }
};
