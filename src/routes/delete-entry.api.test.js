import { jest } from '@jest/globals';
import request from 'supertest';
import { mockEntries } from '../controllers/mock-entries';
import { createMockEntryRepo } from '../controllers/controller-test-helpers';

const entryRepo = createMockEntryRepo();

jest.unstable_mockModule('../repositories/mysql-entry.repo', () => ({
  entryRepo,
}));

const { default: app } = await import('../app');

describe('DELETE /api/entries/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes an entry and returns status 200', async () => {
    // Arrange
    const mockEntry = mockEntries[0];
    entryRepo.delete.mockResolvedValue(mockEntry);

    // Act
    const response = await request(app).delete(`/api/entries/${mockEntry.id}`);

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      message: 'Entry deleted successfully.',
      entry: mockEntry,
    });
  });

  it('returns status 400 when the entry ID is invalid', async () => {
    // Act
    const response = await request(app).delete('/api/entries/abc');

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
    const response = await request(app).delete(
      `/api/entries/${mockEntries[0].id}`,
    );

    // Assert
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      message: 'Entry not found.',
    });
  });

  it('returns status 500 when deleting an entry fails', async () => {
    // Arrange
    entryRepo.delete.mockRejectedValue(new Error('Database unavailable'));

    // Act
    const response = await request(app).delete(
      `/api/entries/${mockEntries[0].id}`,
    );

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({
      message: 'Something went wrong. Please try again later.',
    });
  });
});
