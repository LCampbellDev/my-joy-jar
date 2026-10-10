/**
 * Checks whether an ID is a string of digits representing a positive integer,
 * without leading zeros.
 *
 * @param {*} id - The value to validate, usually from a URL parameter.
 * @returns {boolean} True if the value matches the required ID format.
 */
export const isValidId = (id) => {
  if (typeof id !== 'string') {
    return false;
  }

  return /^[1-9]\d*$/.test(id);
};
