import { jest } from '@jest/globals';
import request from 'supertest';
import { mockEntries } from '../../tests/mock-entries';
import { createMockEntryRepo } from '../../tests/test-helpers';

const entryRepo = createMockEntryRepo();

jest.unstable_mockModule('../repositories/mysql-entry.repo', () => ({
  entryRepo,
}));

const { default: app } = await import('../app');

describe('GET /api/entries', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns the default page with status 200 when pagination is omitted', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue({
      entries: mockEntries,
      total: 25,
    });

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      entries: mockEntries,
      pagination: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    });

    expect(entryRepo.getAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
    });
  });

  it('returns the requested page and page size with status 200', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue({
      entries: mockEntries,
      total: 12,
    });

    const query = {
      page: '2',
      limit: '5',
    };

    // Act
    const response = await request(app).get('/api/entries').query(query);

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      entries: mockEntries,
      pagination: {
        page: 2,
        limit: 5,
        total: 12,
        totalPages: 3,
      },
    });

    expect(entryRepo.getAll).toHaveBeenCalledWith({
      limit: 5,
      offset: 5,
    });
  });

  it('returns an empty page with status 200 when no entries exist', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue({
      entries: [],
      total: 0,
    });

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      entries: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });
  });

  it('returns an empty page with status 200 when the requested page exceeds the total pages', async () => {
    // Arrange
    entryRepo.getAll.mockResolvedValue({
      entries: [],
      total: 25,
    });

    const query = {
      page: '4',
      limit: '10',
    };

    // Act
    const response = await request(app).get('/api/entries').query(query);

    // Assert
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      entries: [],
      pagination: {
        page: 4,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    });

    expect(entryRepo.getAll).toHaveBeenCalledWith({
      limit: 10,
      offset: 30,
    });
  });

  it('returns status 400 when pagination is invalid', async () => {
    // Arrange
    const query = {
      page: '0',
      limit: '101',
    };

    // Act
    const response = await request(app).get('/api/entries').query(query);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: 'Validation errors.',
      errors: [
        'Page must be a positive integer.',
        'Limit must be no greater than 100.',
      ],
    });

    expect(entryRepo.getAll).not.toHaveBeenCalled();
  });

  it('returns status 400 when a pagination parameter is repeated', async () => {
    // Act
    const response = await request(app).get('/api/entries?page=1&page=2');

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: 'Validation errors.',
      errors: ['Page must be a positive integer.'],
    });

    expect(entryRepo.getAll).not.toHaveBeenCalled();
  });

  it('returns status 500 when retrieving entries fails', async () => {
    // Arrange
    entryRepo.getAll.mockRejectedValue(new Error('Database unavailable'));

    // Act
    const response = await request(app).get('/api/entries');

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({
      message: 'Something went wrong. Please try again later.',
    });
  });
});
