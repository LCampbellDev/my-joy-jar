import { entryRepo } from '../repositories/mysql-entry.repo';

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

    return res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching all entries:', error);

    throw new Error(`Error fetching all entries: ${error.message}`, {
      cause: error,
    });
  }
};
