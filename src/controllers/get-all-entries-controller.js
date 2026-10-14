import { entryRepo } from '../repositories/mysql-entry.repo';
import { HTTP_STATUS } from '../constants/http-status';
import { ERROR_CONTEXT } from '../constants/messages-error-context';
import { validatePagination } from '../validation/validate-pagination';
import { LOG_MESSAGES } from '../constants/messages-logs';
import { RESPONSE_MESSAGES } from '../constants/messages-responses';
import { createPagination } from '../helpers/create-pagination';

/**
 * Handles GET /api/entries with optional page and limit query parameters.
 * Responds with 200 and entries plus pagination metadata.
 * The entries array is empty when no entries match the requested page.
 * Responds with 400 when pagination parameters are invalid.
 * Repository failures are wrapped with context and rethrown for central error middleware.
 *
 *  @param {Object} req - The Express request containing optional page and limit query parameters.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const getAllEntriesController = async (req, res) => {
  const { page, limit, offset, validationErrors } = validatePagination(
    req.query,
  );

  if (validationErrors.length) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: RESPONSE_MESSAGES.VALIDATION_ERROR,
      errors: validationErrors,
    });
  }

  try {
    console.info(LOG_MESSAGES.FETCH_ENTRIES);

    const { entries, total } = await entryRepo.getAll({ limit, offset });

    return res.status(HTTP_STATUS.OK).json({
      entries,
      pagination: createPagination({ page, limit, total }),
    });
  } catch (error) {
    throw new Error(`${ERROR_CONTEXT.FETCH_ENTRIES}: ${error.message}`, {
      cause: error,
    });
  }
};
