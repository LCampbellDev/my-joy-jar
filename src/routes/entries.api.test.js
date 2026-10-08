import { jest } from '@jest/globals';
import request from 'supertest';
import { mockEntries } from '../controllers/mock-entries';
import { createMockEntryRepo } from '../controllers/controller-test-helpers';

const entryRepo = createMockEntryRepo();

jest.unstable_mockModule(
  '../repositories/mysql-entry-repository',
  () => ({
    entryRepo,
  }),
);

const { default: app } = await import('../app');

describe('GET /api/entries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all entries with status 200', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue(mockEntries);

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual(mockEntries);
  });

  it('returns an empty array with status 200 when no entries exist', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue([]);

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual([]);
  });

  describe('GET /api/entries/random', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('returns a random entry with status 200', async () => {
      // Arrange
      const mockEntry = mockEntries[0];
      entryRepo.getRandom.mockResolvedValue(mockEntry);

      // Act
      const response = await request(app).get('/api/entries/random');

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(mockEntry);
    });

    it('returns status 404 when no entries exist', async () => {
      // Arrange
      entryRepo.getRandom.mockResolvedValue(null);

      // Act
      const response = await request(app).get('/api/entries/random');

      // Assert
      expect(response.status).toEqual(404);
    });
  });

  describe('POST /api/entries', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('creates an entry and returns status 201', async () => {
      // Arrange
      const mockEntry = mockEntries[0];
      entryRepo.create.mockResolvedValue(mockEntry);

      const input = {
        category: mockEntry.category,
        content: `  ${mockEntry.content}  `,
      };

      // Act
      const response = await request(app)
        .post('/api/entries')
        .send(input);

      // Assert
      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        message: 'Entry created successfully.',
        entry: mockEntry,
      });
    });

    it('returns status 400 when the input is invalid', async () => {
      // Arrange
      const input = {
        category: 'gratitude',
        content: '',
      };

      // Act
      const response = await request(app)
        .post('/api/entries')
        .send(input);

      // Assert
      expect(response.status).toEqual(400);
    });

    describe('DELETE /api/entries/:id', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('deletes an entry and returns status 200', async () => {
        // Arrange
        const mockEntry = mockEntries[0];
        entryRepo.delete.mockResolvedValue(mockEntry);

        // Act
        const response = await request(app)
          .delete(`/api/entries/${mockEntry.id}`);

        // Assert
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
          message: 'Entry deleted successfully.',
          entry: mockEntry,
        });
      });

      it('returns status 400 when the entry ID is invalid', async () => {
        // Act
        const response = await request(app)
          .delete('/api/entries/abc');

        // Assert
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({
          message: 'Entry ID must be a positive integer.',
        });
      });

      it('returns status 404 when the entry does not exist', async () => {
        // Arrange
        entryRepo.delete.mockResolvedValue(null);

        // Act
        const response = await request(app)
          .delete(`/api/entries/${mockEntries[0].id}`);

        // Assert
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
          message: 'Entry not found.',
        });
      });
    });
  });
});
