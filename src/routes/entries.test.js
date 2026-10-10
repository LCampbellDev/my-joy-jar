import { getAllEntriesController } from '../controllers/get-all-entries-controller';
import { createEntryRouter } from './entries';

describe('createEntryRouter', () => {
  it('connects GET / to getAllEntriesController', () => {
    // Arrange
    const router = createEntryRouter();

    // Act
    const getAllEntriesRoute = router.stack.find(
      (layer) => layer.route?.path === '/' && layer.route.methods.get,
    );

    // Assert
    expect(getAllEntriesRoute).toBeDefined();
    expect(getAllEntriesRoute.route.stack[0].handle).toEqual(
      getAllEntriesController,
    );
  });
});
