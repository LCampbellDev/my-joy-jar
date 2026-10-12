/**
 * Request limits for the entry API.
 *
 * @type {Readonly<Record<string, number>>}
 */
export const RATE_LIMIT = Object.freeze({
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 100,
});
