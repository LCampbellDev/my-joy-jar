import { ALLOWED_ENTRY_CATEGORIES } from '../constants/entry-categories';
import { ENTRY_VALIDATION_MESSAGES } from '../constants/messages-validation';
import { ENTRY_CONTENT } from '../constants/entry-content';

/**
 * Checks whether a value is undefined, null or an empty string.
 *
 * @private
 * @param {*} value - The value to check.
 * @returns {boolean} Whether the value is missing.
 */
const isMissingValue = (value) =>
  value === undefined || value === null || value === '';

/**
 * Validates an entry category.
 *
 * @private
 * @param {*} category - The category to validate.
 * @returns {string|null} The first applicable error, or null if valid.
 */
const validateCategory = (category) => {
  switch (true) {
    case isMissingValue(category):
      return ENTRY_VALIDATION_MESSAGES.CATEGORY_REQUIRED;

    case typeof category !== 'string':
      return ENTRY_VALIDATION_MESSAGES.CATEGORY_MUST_BE_STRING;

    case !ALLOWED_ENTRY_CATEGORIES.includes(category):
      return ENTRY_VALIDATION_MESSAGES.CATEGORY_UNSUPPORTED(
        ALLOWED_ENTRY_CATEGORIES,
      );

    default:
      return null;
  }
};

/**
 * Validates entry content.
 *
 * @private
 * @param {*} content - Must be a string containing non-whitespace text,
 *   no longer than ENTRY_CONTENT.MAX_LENGTH UTF-16 code units after trimming.
 * @returns {string|null} The first applicable error, or null if valid.
 */
const validateContent = (content) => {
  switch (true) {
    case isMissingValue(content):
      return ENTRY_VALIDATION_MESSAGES.CONTENT_REQUIRED;

    case typeof content !== 'string':
      return ENTRY_VALIDATION_MESSAGES.CONTENT_MUST_BE_STRING;

    case !content.trim():
      return ENTRY_VALIDATION_MESSAGES.CONTENT_CANNOT_BE_EMPTY;

    case content.trim().length > ENTRY_CONTENT.MAX_LENGTH:
      return ENTRY_VALIDATION_MESSAGES.CONTENT_TOO_LONG(
        ENTRY_CONTENT.MAX_LENGTH,
      );

    default:
      return null;
  }
};

/* TODO: If PATCH support is added, create a separate partial-update
validator or adapt this validator to support optional fields. */

/**
 * Validates the category and content required for a complete entry.
 * Collects the first applicable error for each field without modifying input.
 *
 * @param {Object} [input={}] - The entry data to validate.
 * @param {*} [input.category] - Must be a supported category string.
 * @param {*} [input.content] - Must be a string containing non-whitespace text,
 *   no longer than ENTRY_CONTENT.MAX_LENGTH UTF-16 code units after trimming.
 * @returns {string[]} Validation messages, or an empty array if valid.
 */
export const validateEntryInput = ({ category, content } = {}) => {
  const validationErrors = [
    validateCategory(category),
    validateContent(content),
  ];

  return validationErrors.filter((error) => error !== null);
};
