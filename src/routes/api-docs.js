import { Router } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { openApiDocument } from '../openapi';

/**
 * Creates a router serving interactive OpenAPI documentation.
 * Mounted at /api-docs by the Express application.
 *
 * @returns {Function} The configured Express router.
 */
export const createApiDocsRouter = () => {
  const router = Router();

  // Allow the documentation's assets to load over local HTTP.
  // Keep the remaining default CSP directives.
  router.use(
    helmet.contentSecurityPolicy({
      directives: {
        upgradeInsecureRequests: null,
      },
    }),
  );

  router.use(
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: 'MyJoyJar API documentation',
      swaggerOptions: {
        validatorUrl: null,
      },
    }),
  );

  return router;
};
