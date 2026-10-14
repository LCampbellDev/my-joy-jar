/**
 * Success and error messages returned in API responses.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const RESPONSE_MESSAGES = Object.freeze({
  ENTRY_CREATED: 'Entry created successfully.',
  ENTRY_DELETED: 'Entry deleted successfully.',
  VALIDATION_ERROR: 'Validation errors.',
  INVALID_ENTRY_ID: 'Entry ID must be a positive integer.',
  ENTRY_NOT_FOUND: 'Entry not found.',
  EMPTY_JAR: 'No entries are available.',
  INTERNAL_ERROR: 'Something went wrong. Please try again later.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  INVALID_JSON: 'Request body must contain valid JSON.',
  INVALID_REQUEST: 'The request could not be processed.',
});
