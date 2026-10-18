import { entryPaths } from './entry-paths';
import { healthPaths } from './health-paths';
import { schemas } from './schemas';
import { responses } from './responses';

/**
 * OpenAPI description used by Swagger UI.
 * Assembles endpoint descriptions, schemas and reusable responses.
 */
export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'MyJoyJar API',
    version: '1.0.0',
    description:
      'An API for saving and rediscovering gratitude, compliments and joyful moments.',
  },
  // Send interactive requests to the server serving the documentation.
  servers: [{ url: '/', description: 'Current server' }],
  tags: [
    {
      name: 'Entries',
      description: 'Retrieve, create and delete joy jar entries.',
    },
    {
      name: 'Health',
      description: 'Server liveness and database readiness checks.',
    },
  ],
  paths: {
    ...entryPaths,
    ...healthPaths,
  },
  components: {
    schemas,
    responses,
  },
};
