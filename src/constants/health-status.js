/**
 * Status values returned by the health and readiness endpoints.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const HEALTH_STATUS = Object.freeze({
  // Liveness
  OK: 'ok',

  // Readiness
  READY: 'ready',
  NOT_READY: 'not ready',
});
