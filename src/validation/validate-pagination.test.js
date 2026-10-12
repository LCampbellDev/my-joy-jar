import { validatePagination } from './validate-pagination';

describe('validatePagination', () => {
  it('uses defaults when called without an argument', () => {
    // Act
    const result = validatePagination();

    // Assert
    expect(result).toEqual({
      page: 1,
      limit: 10,
      offset: 0,
      validationErrors: [],
    });
  });

  it('uses defaults when query parameters are omitted', () => {
    // Arrange
    const query = {};

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: 1,
      limit: 10,
      offset: 0,
      validationErrors: [],
    });
  });

  it('parses valid query values and calculates the offset', () => {
    // Arrange
    const query = {
      page: '3',
      limit: '5',
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: 3,
      limit: 5,
      offset: 10,
      validationErrors: [],
    });
  });

  it('uses the default limit when only page is supplied', () => {
    // Arrange
    const query = {
      page: '2',
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: 2,
      limit: 10,
      offset: 10,
      validationErrors: [],
    });
  });

  it('uses the default page when only limit is supplied', () => {
    // Arrange
    const query = {
      limit: '5',
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: 1,
      limit: 5,
      offset: 0,
      validationErrors: [],
    });
  });

  it('accepts the maximum page size', () => {
    // Arrange
    const query = {
      page: '2',
      limit: '100',
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: 2,
      limit: 100,
      offset: 100,
      validationErrors: [],
    });
  });

  it.each([
    ['zero', '0'],
    ['a negative number', '-1'],
    ['a decimal', '1.5'],
    ['letters', 'abc'],
    ['an empty string', ''],
    ['whitespace', ' '],
    ['leading zeros', '01'],
    ['a number instead of a string', 2],
    ['null', null],
    ['repeated values', ['1', '2']],
    ['an unsafe integer', '9007199254740992'],
  ])('rejects page when it is %s', (description, value) => {
    // Arrange
    const query = {
      page: value,
      limit: '10',
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: null,
      limit: 10,
      offset: null,
      validationErrors: ['Page must be a positive integer.'],
    });
  });

  it.each([
    ['zero', '0'],
    ['a negative number', '-1'],
    ['a decimal', '1.5'],
    ['letters', 'abc'],
    ['an empty string', ''],
    ['whitespace', ' '],
    ['leading zeros', '01'],
    ['a number instead of a string', 10],
    ['null', null],
    ['repeated values', ['5', '10']],
    ['an unsafe integer', '9007199254740992'],
  ])('rejects limit when it is %s', (description, value) => {
    // Arrange
    const query = {
      page: '1',
      limit: value,
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: 1,
      limit: null,
      offset: null,
      validationErrors: ['Limit must be a positive integer.'],
    });
  });

  it('rejects a page size greater than the maximum', () => {
    // Arrange
    const query = {
      limit: '101',
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: 1,
      limit: 101,
      offset: null,
      validationErrors: ['Limit must be no greater than 100.'],
    });
  });

  it('returns both errors when page and limit are invalid', () => {
    // Arrange
    const query = {
      page: '0',
      limit: '0',
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: null,
      limit: null,
      offset: null,
      validationErrors: [
        'Page must be a positive integer.',
        'Limit must be a positive integer.',
      ],
    });
  });

  it('rejects a page whose calculated offset exceeds the safe integer range', () => {
    // Arrange
    const query = {
      page: '9007199254740991',
      limit: '10',
    };

    // Act
    const result = validatePagination(query);

    // Assert
    expect(result).toEqual({
      page: 9007199254740991,
      limit: 10,
      offset: null,
      validationErrors: ['The requested page is too large.'],
    });
  });
});
