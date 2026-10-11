/** @type {import('jest').Config} */
export default {
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'json'],
};
