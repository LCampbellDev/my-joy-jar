import { jest } from '@jest/globals';

import { createEntryRouter } from './entry-routes.js';

// Testing the router connects GET / to getAllEntriesController
describe('createEntryRouter', () => {
  it('connects GET / to getAllEntriesController', () => {
    const getAllEntriesController = jest.fn();

    const entryRouter = createEntryRouter({
      getAllEntriesController,
      getRandomEntryController: jest.fn(),
      createEntryController: jest.fn(),
      deleteEntryController: jest.fn(),
    });

    const getAllEntriesRoute = entryRouter.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.get,
    );

    expect(getAllEntriesRoute).toBeDefined();
    expect(getAllEntriesRoute.route.stack[0].handle).toBe(
      getAllEntriesController,
    );
  });
});