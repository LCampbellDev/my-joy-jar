import { jest } from '@jest/globals';
import request from 'supertest';
import { mockEntry } from '../../tests/mock-entries';
import { createMockEntryRepo } from '../../tests/test-helpers';

const entryRepo = createMockEntryRepo();

// repo mock required for ESM
jest.unstable_mockModule('../repositories/mysql-entry.repo', () => ({
  entryRepo,
}));

const { default: app } = await import('../app');

describe('POST /api/entries', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('creates an entry and returns status 201', async () => {
    // Arrange
    entryRepo.create.mockResolvedValue(mockEntry);

    const input = {
      category: mockEntry.category,
      content: `  ${mockEntry.content}  `,
    };

    // Act
    const response = await request(app).post('/api/entries').send(input);

    // Assert
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      message: 'Entry created successfully.',
      entry: mockEntry,
    });
    expect(entryRepo.create).toHaveBeenCalledWith({
      category: mockEntry.category,
      content: mockEntry.content,
    });
  });

  it('returns status 400 when the input is invalid', async () => {
    // Arrange
    const input = {
      category: 'gratitude',
      content: '',
    };

    // Act
    const response = await request(app).post('/api/entries').send(input);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: 'Validation errors.',
      errors: ['Content is required.'],
    });
    expect(entryRepo.create).not.toHaveBeenCalled();
  });

  it('returns status 400 when the request body contains malformed JSON', async () => {
    // Arrange
    const invalidJson = '{"category":';

    // Act
    const response = await request(app)
      .post('/api/entries')
      .set('Content-Type', 'application/json')
      .send(invalidJson);

    // Assert
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: 'Request body must contain valid JSON.',
    });
    expect(entryRepo.create).not.toHaveBeenCalled();
  });

  it('returns status 413 when the request body is too large', async () => {
    // Arrange
    const input = {
      category: 'gratitude',
      content: 'a'.repeat(200 * 1024),
    };

    // Act
    const response = await request(app).post('/api/entries').send(input);

    // Assert
    expect(response.status).toEqual(413);
    expect(response.body).toEqual({
      message: 'The request could not be processed.',
    });
    expect(entryRepo.create).not.toHaveBeenCalled();
  });

  it('returns status 415 when the content encoding is unsupported', async () => {
    // Arrange
    const body = JSON.stringify({
      category: 'gratitude',
      content: 'A valid entry.',
    });

    // Act
    const response = await request(app)
      .post('/api/entries')
      .set('Content-Type', 'application/json')
      .set('Content-Encoding', 'unsupported')
      .send(body);

    // Assert
    expect(response.status).toEqual(415);
    expect(response.body).toEqual({
      message: 'The request could not be processed.',
    });
    expect(entryRepo.create).not.toHaveBeenCalled();
  });

  it('returns status 500 when creating an entry fails', async () => {
    // Arrange
    entryRepo.create.mockRejectedValue(new Error('Database unavailable'));

    const input = {
      category: mockEntry.category,
      content: mockEntry.content,
    };

    // Act
    const response = await request(app).post('/api/entries').send(input);

    // Assert
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({
      message: 'Something went wrong. Please try again later.',
    });
  });
});
