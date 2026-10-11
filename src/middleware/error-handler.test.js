import { jest } from '@jest/globals';
import { createMockResponse } from '../../tests/test-helpers';
import { errorHandler } from './error-handler';

// Check error responses and delegation when headers were already sent.
describe('errorHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns a generic error message with status 500', () => {
    // Arrange
    const error = new Error('Database unavailable');
    const req = {};
    const res = createMockResponse();
    res.headersSent = false;
    const next = jest.fn();

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong. Please try again later.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates the error when response headers were already sent', () => {
    // Arrange
    const error = new Error('Database unavailable');
    const req = {};
    const res = createMockResponse();
    res.headersSent = true;
    const next = jest.fn();

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
