/**
 * Creates pagination metadata for an entry collection.
 *
 * @param {Object} options - Validated pagination values and total count.
 * @param {number} options.page - The requested page.
 * @param {number} options.limit - The page size.
 * @param {number} options.total - The total number of entries.
 * @returns {{page: number, limit: number, total: number, totalPages: number}}
 * Pagination metadata.
 */
export const createPagination = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

