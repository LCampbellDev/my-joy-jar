/**
 * Reusable OpenAPI error response definitions referenced by endpoint descriptions.
 */
export const responses = {
  BadRequest: {
    description:
      'Invalid input or malformed JSON. Validation responses include an errors array.',
    content: {
      'application/json': {
        schema: {
          anyOf: [
            {
              $ref: '#/components/schemas/ErrorResponse',
            },
            {
              $ref: '#/components/schemas/ValidationError',
            },
          ],
        },
      },
    },
  },
  NotFound: {
    description: 'The requested entry does not exist or the jar is empty.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
  PayloadTooLarge: {
    description: 'The request body exceeds the configured JSON parser limit.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          message: 'The request could not be processed.',
        },
      },
    },
  },
  UnsupportedMediaType: {
    description: 'The request uses an unsupported content encoding.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          message: 'The request could not be processed.',
        },
      },
    },
  },
  TooManyRequests: {
    description: 'The entry API request limit was exceeded.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          message: 'Too many requests. Please try again later.',
        },
      },
    },
  },
  InternalError: {
    description: 'An unexpected server failure.',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          message: 'Something went wrong. Please try again later.',
        },
      },
    },
  },
};
