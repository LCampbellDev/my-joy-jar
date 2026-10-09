/**
 * Supported entry categories, frozen to prevent modification.
 * Keep these values in sync with chk_entry_category in database/schema.sql.
 *
 * @type {ReadonlyArray<string>}
 */
export const ALLOWED_CATEGORIES = Object.freeze([
  'gratitude',
  'compliment',
  'joyful-moment',
]);
