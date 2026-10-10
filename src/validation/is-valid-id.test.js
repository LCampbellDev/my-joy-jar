import { isValidId } from './is-valid-id';

describe('isValidId', () => {
  it('returns true for a positive integer string', () => {
    // Arrange
    const id = '1';

    // Act
    const result = isValidId(id);

    // Assert
    expect(result).toEqual(true);
  });

  it('returns true for a positive multi-digit integer string', () => {
    // Arrange
    const id = '42';

    // Act
    const result = isValidId(id);

    // Assert
    expect(result).toEqual(true);
  });

  it.each([
    ['zero', '0'],
    ['a negative integer', '-1'],
    ['a decimal', '1.5'],
    ['letters', 'abc'],
    ['an empty string', ''],
    ['whitespace', ' '],
    ['a value with leading whitespace', ' 1'],
    ['a value with trailing whitespace', '1 '],
    ['a value with a leading zero', '01'],
    ['undefined', undefined],
    ['null', null],
  ])('returns false for %s', (description, id) => {
    // Arrange is provided by the test case.

    // Act
    const result = isValidId(id);

    // Assert
    expect(result).toEqual(false);
  });
});
