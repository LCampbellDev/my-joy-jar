import { jest } from "@jest/globals";
import { getAllEntriesController } from "../controllers/get-all-entries-controller";
import { entryRoutes } from './entries';

describe("entryRoutes", () => {
  it("connects GET / to getAllEntriesController", () => {
    // Arrange
    const router = entryRoutes();

    // Act
    const getAllEntriesRoute = router.stack.find(
      (layer) => layer.route?.path === "/" && layer.route.methods.get,
    );

    // Assert
    expect(getAllEntriesRoute).toBeDefined();
    expect(getAllEntriesRoute.route.stack[0].handle).toEqual(
      getAllEntriesController,
    );
  });
});
