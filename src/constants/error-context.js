/**
 * Context messages used when logging and wrapping controller errors.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const ERROR_CONTEXT = Object.freeze({
  FETCH_ENTRIES: 'Error fetching all entries',
  FETCH_RANDOM_ENTRY: 'Error fetching a random entry',
  CREATE_ENTRY: 'Error creating entry',
  DELETE_ENTRY: 'Error deleting entry',
  INTERNAL_ERROR: 'Something went wrong. Please try again later.',
});
