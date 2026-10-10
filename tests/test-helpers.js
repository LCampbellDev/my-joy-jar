import { jest } from '@jest/globals';

export const createMockResponse = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

export const createMockEntryRepo = () => ({
  getAll: jest.fn(),
  getRandom: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});
