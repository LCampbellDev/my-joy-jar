import { createEntryController } from '../controllers/create-entry-controller';
import { deleteEntryController } from '../controllers/delete-entry-controller';
import { getAllEntriesController } from '../controllers/get-all-entries-controller';
import { getRandomEntryController } from '../controllers/get-random-entry-controller';
import { createEntryRouter } from './entries';

// Check that each route is wired to the intended controller.
// API tests separately check HTTP responses through the app.
describe('createEntryRouter', () => {
  it('connects GET / to getAllEntriesController', () => {
    // Arrange
    const router = createEntryRouter();

    // Act
    const route = router.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.get,
    );

    // Assert
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toEqual(getAllEntriesController);
  });

  it('connects GET /random to getRandomEntryController', () => {
    // Arrange
    const router = createEntryRouter();

    // Act
    const route = router.stack.find(
      (layer) =>
        layer.route?.path === '/random' && layer.route.methods.get,
    );

    // Assert
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toEqual(getRandomEntryController);
  });

  it('connects POST / to createEntryController', () => {
    // Arrange
    const router = createEntryRouter();

    // Act
    const route = router.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.post,
    );

    // Assert
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toEqual(createEntryController);
  });

  it('connects DELETE /:id to deleteEntryController', () => {
    // Arrange
    const router = createEntryRouter();

    // Act
    const route = router.stack.find(
      (layer) =>
        layer.route?.path === '/:id' && layer.route.methods.delete,
    );

    // Assert
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toEqual(deleteEntryController);
  });
});