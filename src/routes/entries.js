import { Router } from 'express';
import { createEntryController } from '../controllers/create-entry-controller';
import { deleteEntryController } from '../controllers/delete-entry-controller';
import { getAllEntriesController } from '../controllers/get-all-entries-controller';
import { getRandomEntryController } from '../controllers/get-random-entry-controller';

/**
 * Creates a router for retrieving, creating and deleting joy jar entries.
 * Mounted at /api/entries by the Express application.
 *
 * @returns {Function} The configured Express router.
 */
export const entryRoutes = () => {
  const router = Router();

  router.get('/', getAllEntriesController);
  router.get('/random', getRandomEntryController);
  router.post('/', createEntryController);
  router.delete('/:id', deleteEntryController);

  return router;
};
