import {
  validEntryInput,
  whitespaceEntryInput,
  missingCategoryInput,
  nonStringCategoryInput,
  unsupportedCategoryInput,
  missingContentInput,
  nonStringContentInput,
  emptyContentInput,
  whitespaceOnlyContentInput,
  missingFieldsInput,
} from '../../tests/mock-entry-inputs';

import { validateEntryInput } from './validate-entry-input';

describe('validateEntryInput', () => {
  // Valid inputs
  it('returns no errors when category and content are valid', () => {
    // Arrange
    const input = validEntryInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual([]);
  });

  it('accepts content with surrounding whitespace', () => {
    // Arrange
    const input = whitespaceEntryInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual([]);
  });

  // Category validation
  it('returns an error when category is missing', () => {
    // Arrange
    const input = missingCategoryInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual(['Category is required.']);
  });

  it('returns an error when category is not a string', () => {
    // Arrange
    const input = nonStringCategoryInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual(['Category must be a string.']);
  });

  it('returns an error when category is not supported', () => {
    // Arrange
    const input = unsupportedCategoryInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual([
      'Category must be one of: gratitude, compliment, joyful-moment.',
    ]);
  });

  // Content validation
  it('returns an error when content is missing', () => {
    // Arrange
    const input = missingContentInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual(['Content is required.']);
  });

  it('returns an error when content is not a string', () => {
    // Arrange
    const input = nonStringContentInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual(['Content must be a string.']);
  });

  it('returns a required error when content is an empty string', () => {
    // Arrange
    const input = emptyContentInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual(['Content is required.']);
  });

  it('returns an empty-content error when content contains only whitespace', () => {
    // Arrange
    const input = whitespaceOnlyContentInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual(['Content cannot be empty.']);
  });

  // Combined Content and category errors and missing fields
  it('returns both required errors when both fields are missing', () => {
    // Arrange
    const input = missingFieldsInput;

    // Act
    const validationErrors = validateEntryInput(input);

    // Assert
    expect(validationErrors).toEqual([
      'Category is required.',
      'Content is required.',
    ]);
  });

  it('returns both required errors when called without an argument', () => {
    // Act
    const validationErrors = validateEntryInput();

    // Assert
    expect(validationErrors).toEqual([
      'Category is required.',
      'Content is required.',
    ]);
  });
});
