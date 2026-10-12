import { PAGINATION } from '../constants/pagination';
import { PAGINATION_VALIDATION_MESSAGES } from '../constants/validation-messages';
import { isPositiveIntegerString } from './helpers/is-positive-integer-string';

/**
 * Parses a positive integer query value, using a default when omitted.
 *
 * @private
 * @param {*} value - The raw query value.
 * @param {number} defaultValue - The value used when undefined.
 * @returns {number|null} A safe positive integer, or null if invalid.
 */
const parsePositiveInteger = (value, defaultValue) => {
  if (value === undefined) {
    return defaultValue;
  }

  if (!isPositiveIntegerString(value)) {
    return null;
  }

  const number = Number(value);

  return Number.isSafeInteger(number) ? number : null;
};

/**
 * Validates pagination query values and calculates the database offset.
 * Applies defaults only when parameters are omitted.
 *
 * @param {Object} [query={}] - The request query parameters.
 * @param {*} [query.page] - The requested page, starting at 1.
 * @param {*} [query.limit] - The requested number of entries per page.
 * @returns {{
 *   page: number|null,
 *   limit: number|null,
 *   offset: number|null,
 *   validationErrors: string[]
 * }} Parsed values and errors. Offset is null when validation fails.
 */
export const validatePagination = ({ page, limit } = {}) => {
  const validationErrors = [];

  const parsedPage = parsePositiveInteger(page, PAGINATION.DEFAULT_PAGE);
  const parsedLimit = parsePositiveInteger(limit, PAGINATION.DEFAULT_LIMIT);

  if (parsedPage === null) {
    validationErrors.push(PAGINATION_VALIDATION_MESSAGES.PAGE_INVALID);
  }

  if (parsedLimit === null) {
    validationErrors.push(PAGINATION_VALIDATION_MESSAGES.LIMIT_INVALID);
  } else if (parsedLimit > PAGINATION.MAX_LIMIT) {
    validationErrors.push(
      PAGINATION_VALIDATION_MESSAGES.LIMIT_TOO_LARGE(PAGINATION.MAX_LIMIT),
    );
  }

  if (validationErrors.length) {
    return {
      page: parsedPage,
      limit: parsedLimit,
      offset: null,
      validationErrors,
    };
  }

  const offset = (parsedPage - 1) * parsedLimit;

  if (!Number.isSafeInteger(offset)) {
    validationErrors.push(PAGINATION_VALIDATION_MESSAGES.OFFSET_TOO_LARGE);

    return {
      page: parsedPage,
      limit: parsedLimit,
      offset: null,
      validationErrors,
    };
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset,
    validationErrors,
  };
};