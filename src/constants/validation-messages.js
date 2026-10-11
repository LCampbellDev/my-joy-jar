// constants/validation-messages.js
export const ENTRY_VALIDATION_MESSAGES = {
  CATEGORY_REQUIRED: 'Category is required.',
  CATEGORY_MUST_BE_STRING: 'Category must be a string.',
  CATEGORY_UNSUPPORTED: (categories) =>
    `Category must be one of: ${categories.join(', ')}.`,
  CONTENT_REQUIRED: 'Content is required.',
  CONTENT_MUST_BE_STRING: 'Content must be a string.',
  CONTENT_CANNOT_BE_EMPTY: 'Content cannot be empty.',
};
