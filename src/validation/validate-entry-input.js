import { ALLOWED_ENTRY_CATEGORIES } from '../constants/entry-categories';
import { ENTRY_VALIDATION_MESSAGES } from '../constants/validation-messages';

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
 * Validates the category and content required for a complete entry.
 * Collects all validation errors without modifying the input.
 *
 * @param {Object} [input={}] - The entry data to validate.
 * @param {*} [input.category] - Must be a supported category string.
 * @param {*} [input.content] - Must be a string containing non-whitespace text.
 * @returns {string[]} Validation messages, or an empty array if valid.
 */
/* TODO: If PATCH support is added, create a separate partial-update
validator or adapt this validator to support optional fields. */
export const validateEntryInput = ({ category, content } = {}) => {
  const validationErrors = [];

  if (isMissingValue(category)) {
    validationErrors.push(ENTRY_VALIDATION_MESSAGES.CATEGORY_REQUIRED);
  } else if (typeof category !== 'string') {
    validationErrors.push(ENTRY_VALIDATION_MESSAGES.CATEGORY_MUST_BE_STRING);
  } else if (!ALLOWED_ENTRY_CATEGORIES.includes(category)) {
    validationErrors.push(
      ENTRY_VALIDATION_MESSAGES.CATEGORY_UNSUPPORTED(ALLOWED_ENTRY_CATEGORIES),
    );
  }

  if (isMissingValue(content)) {
    validationErrors.push(ENTRY_VALIDATION_MESSAGES.CONTENT_REQUIRED);
  } else if (typeof content !== 'string') {
    validationErrors.push(ENTRY_VALIDATION_MESSAGES.CONTENT_MUST_BE_STRING);
  } else if (!content.trim()) {
    validationErrors.push(ENTRY_VALIDATION_MESSAGES.CONTENT_CANNOT_BE_EMPTY);
  }

  return validationErrors;
};
