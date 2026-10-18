/**
 * OpenAPI descriptions of server liveness and database readiness endpoints.
 */
export const healthPaths = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Check server liveness',
      description:
        'Checks that the server responds. Does not check database connectivity.',
      operationId: 'getHealth',
      responses: {
        200: {
          description: 'The server is responding.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthResult',
              },
              example: {
                status: 'ok',
              },
            },
          },
        },
      },
    },
  },
  '/ready': {
    get: {
      tags: ['Health'],
      summary: 'Check database readiness',
      description:
        'Checks whether the application can execute a simple database query.',
      operationId: 'getReadiness',
      responses: {
        200: {
          description: 'The database is available.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthResult',
              },
              example: {
                status: 'ready',
              },
            },
          },
        },
        503: {
          description: 'The database readiness check failed.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/HealthResult',
              },
              example: {
                status: 'not ready',
              },
            },
          },
        },
      },
    },
  },
};
