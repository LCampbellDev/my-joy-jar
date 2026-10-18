/**
 * OpenAPI descriptions of entry retrieval, creation and deletion endpoints.
 */
export const entryPaths = {
  '/api/entries': {
    get: {
      tags: ['Entries'],
      summary: 'Retrieve a page of entries',
      description:
        'Returns entries ordered by creation date descending, then ID descending. Empty and out-of-range pages return an empty entries array.',
      operationId: 'getEntries',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'The page number, starting at 1.',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
          example: 1,
        },
        {
          name: 'limit',
          in: 'query',
          description: 'The maximum number of entries per page.',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          example: 10,
        },
      ],
      responses: {
        200: {
          description: 'A page of entries and pagination metadata.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EntryPage',
              },
            },
          },
        },
        400: {
          description: 'Invalid pagination parameters.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
              example: {
                message: 'Validation errors.',
                errors: ['Page must be a positive integer.'],
              },
            },
          },
        },
        429: {
          $ref: '#/components/responses/TooManyRequests',
        },
        500: {
          $ref: '#/components/responses/InternalError',
        },
      },
    },
    post: {
      tags: ['Entries'],
      summary: 'Create an entry',
      description:
        'Validates the category and content, trims the content and saves the entry.',
      operationId: 'createEntry',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateEntryInput',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'The entry was created.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EntryResult',
              },
              example: {
                message: 'Entry created successfully.',
                entry: {
                  id: 16,
                  category: 'gratitude',
                  content: 'I am grateful for a peaceful morning.',
                  createdAt: '2026-10-18T12:00:00.000Z',
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/BadRequest',
        },
        413: {
          $ref: '#/components/responses/PayloadTooLarge',
        },
        415: {
          $ref: '#/components/responses/UnsupportedMediaType',
        },
        429: {
          $ref: '#/components/responses/TooManyRequests',
        },
        500: {
          $ref: '#/components/responses/InternalError',
        },
      },
    },
  },
  '/api/entries/random': {
    get: {
      tags: ['Entries'],
      summary: 'Draw a random entry',
      operationId: 'getRandomEntry',
      responses: {
        200: {
          description: 'A randomly selected entry.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Entry',
              },
            },
          },
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
        429: {
          $ref: '#/components/responses/TooManyRequests',
        },
        500: {
          $ref: '#/components/responses/InternalError',
        },
      },
    },
  },
  '/api/entries/{id}': {
    delete: {
      tags: ['Entries'],
      summary: 'Delete an entry',
      operationId: 'deleteEntry',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description:
            'A positive integer ID without leading zeros, within JavaScript’s safe integer range.',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 9007199254740991,
          },
          example: 16,
        },
      ],
      responses: {
        200: {
          description: 'The entry was deleted.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EntryResult',
              },
              example: {
                message: 'Entry deleted successfully.',
                entry: {
                  id: 16,
                  category: 'gratitude',
                  content: 'I am grateful for a peaceful morning.',
                  createdAt: '2026-10-18T12:00:00.000Z',
                },
              },
            },
          },
        },
        400: {
          $ref: '#/components/responses/BadRequest',
        },
        404: {
          $ref: '#/components/responses/NotFound',
        },
        429: {
          $ref: '#/components/responses/TooManyRequests',
        },
        500: {
          $ref: '#/components/responses/InternalError',
        },
      },
    },
  },
};
