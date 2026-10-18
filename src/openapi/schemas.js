/**
 * Reusable OpenAPI schemas for request and response bodies.
 */
export const schemas = {
  Entry: {
    type: 'object',
    required: ['id', 'category', 'content', 'createdAt'],
    properties: {
      id: {
        type: 'integer',
        minimum: 1,
        example: 16,
      },
      category: {
        type: 'string',
        enum: ['gratitude', 'compliment', 'joyful-moment'],
        example: 'joyful-moment',
      },
      content: {
        type: 'string',
        example: 'I enjoyed sitting outside in the sunshine.',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2026-10-12T13:00:00.000Z',
      },
    },
  },
  EntryPage: {
    type: 'object',
    required: ['entries', 'pagination'],
    properties: {
      entries: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Entry',
        },
      },
      pagination: {
        type: 'object',
        required: ['page', 'limit', 'total', 'totalPages'],
        properties: {
          page: {
            type: 'integer',
            minimum: 1,
            example: 1,
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            example: 10,
          },
          total: {
            type: 'integer',
            minimum: 0,
            example: 25,
          },
          totalPages: {
            type: 'integer',
            minimum: 0,
            example: 3,
          },
        },
      },
    },
  },
  ErrorResponse: {
    type: 'object',
    required: ['message'],
    properties: {
      message: {
        type: 'string',
      },
    },
  },
  ValidationError: {
    type: 'object',
    required: ['message', 'errors'],
    properties: {
      message: {
        type: 'string',
      },
      errors: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  },
  CreateEntryInput: {
    type: 'object',
    required: ['category', 'content'],
    properties: {
      category: {
        type: 'string',
        enum: ['gratitude', 'compliment', 'joyful-moment'],
        example: 'gratitude',
      },
      content: {
        type: 'string',
        description:
          'Non-whitespace text. Trimmed before storage, with a maximum of 2,000 UTF-16 code units after trimming.',
        example: 'I am grateful for a peaceful morning.',
      },
    },
  },
  EntryResult: {
    type: 'object',
    required: ['message', 'entry'],
    properties: {
      message: {
        type: 'string',
      },
      entry: {
        $ref: '#/components/schemas/Entry',
      },
    },
  },
  HealthResult: {
    type: 'object',
    required: ['status'],
    properties: {
      status: {
        type: 'string',
        enum: ['ok', 'ready', 'not ready'],
      },
    },
  },
};
