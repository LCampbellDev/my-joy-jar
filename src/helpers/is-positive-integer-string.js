/**
 * Checks whether a value is a positive integer string without leading zeros.
 * Does not check numeric range.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} Whether the value has the required string format.
 */
export const isPositiveIntegerString = (value) =>
  // Regex: Match a first digit from 1–9 followed by any additional digits.
  // Anchors require the whole string to match, excluding leading zeros.
  typeof value === 'string' && /^[1-9]\d*$/.test(value);
