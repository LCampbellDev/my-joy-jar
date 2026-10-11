import { Router } from 'express';
import { HTTP_STATUS } from '../constants/http-status';

/**
 * Creates a router for checking whether the server is responding.
 * Mounted at /health. Does not check database connectivity.
 *
 * @returns {Function} The configured Express router.
 */
export const createHealthRouter = () => {
  const router = Router();

  router.get('/', (req, res) => {
    return res.status(HTTP_STATUS.OK).json({
      status: 'ok',
    });
  });

  return router;
};
