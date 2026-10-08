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
  });
