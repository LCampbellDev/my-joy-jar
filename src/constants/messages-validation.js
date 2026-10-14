/**
 * Validation messages for entry category and content.
 * CATEGORY_UNSUPPORTED builds a message from the allowed categories.
 */
export const ENTRY_VALIDATION_MESSAGES = {
  CATEGORY_REQUIRED: 'Category is required.',
  CATEGORY_MUST_BE_STRING: 'Category must be a string.',
  CATEGORY_UNSUPPORTED: (categories) =>
    `Category must be one of: ${categories.join(', ')}.`,
  CONTENT_REQUIRED: 'Content is required.',
  CONTENT_MUST_BE_STRING: 'Content must be a string.',
  CONTENT_CANNOT_BE_EMPTY: 'Content cannot be empty.',
  CONTENT_TOO_LONG: (maxLength) =>
    `Content must be no longer than ${maxLength} characters.`,
};

/**
 * Validation messages for entry pagination query parameters.
 */
export const PAGINATION_VALIDATION_MESSAGES = Object.freeze({
  PAGE_INVALID: 'Page must be a positive integer.',
  LIMIT_INVALID: 'Limit must be a positive integer.',
  LIMIT_TOO_LARGE: (maxLimit) => `Limit must be no greater than ${maxLimit}.`,
  OFFSET_TOO_LARGE: 'The requested page is too large.',
});
