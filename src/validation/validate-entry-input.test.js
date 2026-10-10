import { validateEntryInput } from './validate-entry-input';

describe('validateEntryInput', () => {
  // Valid cases

  it('returns no errors when category and content are valid', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      category: 'gratitude',
      content: 'I am grateful for a peaceful morning.',
    });

    // Assert
    expect(validationErrors).toEqual([]);
  });

  it('accepts content with surrounding whitespace', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      category: 'compliment',
      content: '  Someone said I explained my project clearly.  ',
    });

    // Assert
    expect(validationErrors).toEqual([]);
  });

  // Invalid category cases

  it('returns an error when category is missing', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      content: 'I enjoyed learning about Jest.',
    });

    // Assert
    expect(validationErrors).toContain('Category is required.');
  });

  it('returns an error when category is not a string', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      category: 123,
      content: 'I enjoyed learning about Jest.',
    });

    // Assert
    expect(validationErrors).toContain('Category must be a string.');
  });

  it('returns an error when category is not supported', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      category: 'achievement',
      content: 'I completed my repository refactor.',
    });

    // Assert
    expect(validationErrors).toContain(
      'Category must be one of: gratitude, compliment, joyful-moment.',
    );
  });

  // Invalid content cases

  it('returns an error when content is missing', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      category: 'gratitude',
    });

    // Assert
    expect(validationErrors).toContain('Content is required.');
  });

  it('returns an error when content is not a string', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      category: 'gratitude',
      content: 123,
    });

    // Assert
    expect(validationErrors).toContain('Content must be a string.');
  });

  // Edge cases

  it('returns a required error when content is an empty string', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      category: 'gratitude',
      content: '',
    });

    // Assert
    expect(validationErrors).toContain('Content is required.');
  });

  it('returns an empty-content error when content contains only whitespace', () => {
    // Arrange
    const validationErrors = validateEntryInput({
      category: 'gratitude',
      content: '   ',
    });

    // Assert
    expect(validationErrors).toContain('Content cannot be empty.');
  });

  it('returns both required errors when both fields are missing', () => {
    // Arrange
    const validationErrors = validateEntryInput({});

    // Assert
    expect(validationErrors).toEqual([
      'Category is required.',
      'Content is required.',
    ]);
  });

  it('returns both required errors when called without an argument', () => {
    // Arrange
    const validationErrors = validateEntryInput();

    // Assert
    expect(validationErrors).toEqual([
      'Category is required.',
      'Content is required.',
    ]);
  });
});
