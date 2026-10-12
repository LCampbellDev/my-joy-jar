import { createPagination } from './create-pagination';

describe('createPagination', () => {
  it('returns pagination metadata for complete pages', () => {
    // Arrange
    const options = {
      page: 2,
      limit: 10,
      total: 30,
    };

    // Act
    const pagination = createPagination(options);

    // Assert
    expect(pagination).toEqual({
      page: 2,
      limit: 10,
      total: 30,
      totalPages: 3,
    });
  });

  it('rounds up the page count when the last page is incomplete', () => {
    // Arrange
    const options = {
      page: 1,
      limit: 10,
      total: 25,
    };

    // Act
    const pagination = createPagination(options);

    // Assert
    expect(pagination).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it('returns zero total pages when no entries exist', () => {
    // Arrange
    const options = {
      page: 1,
      limit: 10,
      total: 0,
    };

    // Act
    const pagination = createPagination(options);

    // Assert
    expect(pagination).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
  });

  it('keeps the requested page number, even when it exceeds the total pages', () => {
    // Arrange
    const options = {
      page: 4,
      limit: 10,
      total: 25,
    };

    // Act
    const pagination = createPagination(options);

    // Assert
    expect(pagination).toEqual({
      page: 4,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });
});
