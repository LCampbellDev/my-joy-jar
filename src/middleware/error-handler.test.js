import { jest } from '@jest/globals';
import { createMockResponse } from '../../tests/test-helpers';
import { errorHandler } from './error-handler';

// Check error responses and delegation when headers were already sent.
describe('errorHandler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns status 400 when the JSON is malformed', () => {
    // Arrange
    const error = new SyntaxError('Unexpected end of JSON input');
    error.type = 'entity.parse.failed';
    error.status = 400;
    error.expose = true;

    const req = {};
    const res = createMockResponse();
    res.headersSent = false;
    const next = jest.fn();
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Request body must contain valid JSON.',
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('returns status 413 without logging an oversized body', () => {
    // Arrange
    const error = new Error('request entity too large');
    error.status = 413;
    error.expose = true;
    error.type = 'entity.too.large';

    const req = {};
    const res = createMockResponse();
    res.headersSent = false;
    const next = jest.fn();
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(413);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The request could not be processed.',
    });
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates the error when response headers were already sent', () => {
    // Arrange
    const error = new Error('Database unavailable');
    const req = {};
    const res = createMockResponse();
    res.headersSent = true;
    const next = jest.fn();
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it.each([
    ['an error without expose', { status: 400 }],
    ['an error explicitly marked as private', { status: 400, expose: false }],
    ['a status below 400', { status: 399, expose: true }],
    ['a server error status', { status: 500, expose: true }],
    ['a non-integer status', { status: 400.5, expose: true }],
    ['a string status', { status: '400', expose: true }],
  ])('returns a generic 500 and logs for %s', (description, properties) => {
    // Arrange
    const error = Object.assign(new Error('Internal detail'), properties);
    const req = {};
    const res = createMockResponse();
    res.headersSent = false;
    const next = jest.fn();
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong. Please try again later.',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Request failed', error);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns a generic error message with status 500', () => {
    // Arrange
    const error = new Error('Database unavailable');
    const req = {};
    const res = createMockResponse();
    res.headersSent = false;
    const next = jest.fn();
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Act
    errorHandler(error, req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong. Please try again later.',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Request failed', error);
    expect(next).not.toHaveBeenCalled();
  });
});
