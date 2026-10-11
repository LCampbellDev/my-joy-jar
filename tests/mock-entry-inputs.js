export const validEntryInput = {
  category: 'gratitude',
  content: 'I am grateful for a peaceful morning.',
};

export const whitespaceEntryInput = {
  category: 'compliment',
  content: '  Someone said I explained my project clearly.  ',
};

export const missingCategoryInput = {
  content: 'I enjoyed learning about Jest.',
};

export const nonStringCategoryInput = {
  category: 123,
  content: 'I enjoyed learning about Jest.',
};

export const unsupportedCategoryInput = {
  category: 'achievement',
  content: 'I completed my repository refactor.',
};

export const missingContentInput = {
  category: 'gratitude',
};

export const nonStringContentInput = {
  category: 'gratitude',
  content: 123,
};

export const emptyContentInput = {
  category: 'gratitude',
  content: '',
};

export const whitespaceOnlyContentInput = {
  category: 'gratitude',
  content: '   ',
};

export const missingFieldsInput = {};
