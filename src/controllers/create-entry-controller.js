import { entryRepo } from '../repositories/mysql-entry.repo';
import { validateEntryInput } from '../validation/validate-entry-input';

/**
 * Handles POST /api/entries.
 * Validates the request body and trims content before saving.
 * Responds with 201 and the created entry, or 400 with validation errors.
 * Repository failures are logged and rethrown for central error middleware.
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
    return res.status(400).json({
      message: 'Validation errors.',
      errors: validationErrors,
    });
  }

  try {
    console.info('Creating entry');

    const entry = await entryRepo.create({
      category,
      content: content.trim(),
    });

    return res.status(201).json({
      message: 'Entry created successfully.',
      entry,
    });
  } catch (error) {
    console.error('Error creating entry', error);

    throw new Error(`Error creating entry: ${error.message}`, {
      cause: error,
    });
  }
};
