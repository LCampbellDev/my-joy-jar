import { entryRepo } from '../repositories/mysql-entry.repo';
import { isValidId } from '../validation/is-valid-id';

/**
 * Handles DELETE /api/entries/:id.
 * Validates the URL ID and converts it to a number before deleting.
 * Responds with 200 and the deleted entry, 400 for an invalid ID,
 * or 404 if the entry does not exist.
 * Repository failures are logged and rethrown for central error middleware.
 *
 * @param {Object} req - The Express request containing the entry ID in params.id.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const deleteEntryController = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({
      message: 'Entry ID must be a positive integer.',
    });
  }

  const entryId = Number(id);

  try {
    console.info('Deleting entry');

    const entry = await entryRepo.delete(entryId);

    if (!entry) {
      return res.status(404).json({
        message: 'Entry not found.',
      });
    }

    return res.status(200).json({
      message: 'Entry deleted successfully.',
      entry,
    });
  } catch (error) {
    console.error('Error deleting entry', error);

    throw new Error(`Error deleting entry: ${error.message}`, {
      cause: error,
    });
  }
};
