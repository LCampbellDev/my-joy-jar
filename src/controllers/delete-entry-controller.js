import { entryRepo } from '../repositories/mysql-entry.repo';
import { isPositiveIntegerString } from '../validation/helpers/is-positive-integer-string';
import { HTTP_STATUS } from '../constants/http-status';
import { RESPONSE_MESSAGES } from '../constants/messages-responses';
import { ERROR_CONTEXT } from '../constants/messages-error-context';
import { LOG_MESSAGES } from '../constants/messages-logs';

/**
 * Handles DELETE /api/entries/:id.
 * Validates the URL ID and converts it to a number before deleting.
 * Responds with 200 and the deleted entry, 400 for an invalid ID,
 * or 404 if the entry does not exist.
 * Repository failures are wrapped with context and rethrown for central error middleware.
 *
 * @param {Object} req - The Express request containing the entry ID in params.id.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const deleteEntryController = async (req, res) => {
  const { id } = req.params;

  if (!isPositiveIntegerString(id)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: RESPONSE_MESSAGES.INVALID_ENTRY_ID,
    });
  }

  const entryId = Number(id);

  try {
    console.info(LOG_MESSAGES.DELETE_ENTRY, { entryId });

    const entry = await entryRepo.delete(entryId);

    if (!entry) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: RESPONSE_MESSAGES.ENTRY_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: RESPONSE_MESSAGES.ENTRY_DELETED,
      entry,
    });
  } catch (error) {
    throw new Error(`${ERROR_CONTEXT.DELETE_ENTRY}: ${error.message}`, {
      cause: error,
    });
  }
};
