import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';

import { createGetAllEntriesController } from '../controllers/get-all-entries-controller.js';
import { createEntryRouter } from './entry-routes.js';

describe('GET /api/entries', () => {
  it('returns all entries with status 200', async () => {
    const entries = [
      {
        id: 1,
        category: 'gratitude',
        content: 'I am grateful for learning API testing.',
        createdAt: '2026-10-03T12:00:00.000Z',
      },
    ];

    const entryRepository = {
      getAllEntries: jest.fn().mockResolvedValue(entries),
    };

    const getAllEntriesController =
      createGetAllEntriesController(entryRepository);

    const entryRouter = createEntryRouter({
      getAllEntriesController,
      getRandomEntryController: jest.fn(),
      createEntryController: jest.fn(),
      deleteEntryController: jest.fn(),
    });

    const app = express();

    app.use(express.json());
    app.use('/api/entries', entryRouter);

    const response = await request(app).get('/api/entries');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(entries);
    expect(entryRepository.getAllEntries).toHaveBeenCalledTimes(1);
  });
});