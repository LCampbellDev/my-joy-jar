import { Router } from 'express';
import { readinessController } from '../controllers/readiness-controller';

/**
 * Creates a router for checking database readiness.
 * Mounted at /ready by the Express application.
 *
 * @returns {Function} The configured Express router.
 */
export const createReadinessRouter = () => {
  const router = Router();

  router.get('/', readinessController);

  return router;
};
