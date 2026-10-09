import { ALLOWED_CATEGORIES } from '../constants/entry-categories';

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
    validationErrors.push('Category is required.');
  } else if (typeof category !== 'string') {
    validationErrors.push('Category must be a string.');
  } else if (!ALLOWED_CATEGORIES.includes(category)) {
    validationErrors.push(
      `Category must be one of: ${ALLOWED_CATEGORIES.join(', ')}.`,
    );
  }

  if (isMissingValue(content)) {
    validationErrors.push('Content is required.');
  } else if (typeof content !== 'string') {
    validationErrors.push('Content must be a string.');
  } else if (!content.trim()) {
    validationErrors.push('Content cannot be empty.');
  }

  return validationErrors;
};
