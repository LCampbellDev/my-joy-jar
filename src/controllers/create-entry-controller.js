import { entryRepo } from '../repositories/mysql-entry.repo';
import { validateEntryInput } from '../validation/validate-entry-input';
import { HTTP_STATUS } from '../constants/http-status';
import { RESPONSE_MESSAGES } from '../constants/messages-responses';
import { ERROR_CONTEXT } from '../constants/messages-error-context';
import { LOG_MESSAGES } from '../constants/messages-logs';
/**
 * Handles POST /api/entries.
 * Validates the request body and trims content before saving.
 * Responds with 201 and the created entry, or 400 with validation errors.
Repository failures are wrapped with context and rethrown for central error middleware.
 *
 * @param {Object} req - The Express request containing category and content in its body.
 * @param {Object} res - The Express response used to send JSON.
 * @returns {Promise<Object>} The Express response after sending JSON.
 */
export const createEntryController = async (req, res) => {
  const { category, content } = req.body ?? {};

  const validationErrors = validateEntryInput({
    category,
    content,
  });

  if (validationErrors.length) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: RESPONSE_MESSAGES.VALIDATION_ERROR,
      errors: validationErrors,
    });
  }

  try {
    console.info(LOG_MESSAGES.CREATE_ENTRY);

    const entry = await entryRepo.create({
      category,
      content: content.trim(),
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: RESPONSE_MESSAGES.ENTRY_CREATED,
      entry,
    });
  } catch (error) {
    throw new Error(`${ERROR_CONTEXT.CREATE_ENTRY}: ${error.message}`, {
      cause: error,
    });
  }
};
