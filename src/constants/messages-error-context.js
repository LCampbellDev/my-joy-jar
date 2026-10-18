/**
 * Context messages used when wrapping or logging operation failures.
 * Entry controller errors are logged centrally.
 * Readiness failures are handled and logged by the readiness controller.
 *
 * @constant
 * @type {Readonly<Record<string, string>>}
 */
export const ERROR_CONTEXT = Object.freeze({
  FETCH_ENTRIES: 'Error fetching all entries',
  FETCH_RANDOM_ENTRY: 'Error fetching a random entry',
  CREATE_ENTRY: 'Error creating entry',
  DELETE_ENTRY: 'Error deleting entry',
  CHECK_READINESS: 'Error checking database readiness',
});
