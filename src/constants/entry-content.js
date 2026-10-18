/**
 * Limits for saved entry content.
 * MAX_LENGTH counts UTF-16 code units after trimming.
 * This limit stays well below the capacity of the MySQL TEXT column.
 * @constant
 * @type {Readonly<Record<string, number>>}
 */
export const ENTRY_CONTENT = Object.freeze({
  MAX_LENGTH: 2000,
});
