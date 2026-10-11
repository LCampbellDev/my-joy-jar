/** @type {import('jest').Config} */
export default {
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.test.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'json'],
  coverageThreshold: {
    './src/{controllers,middleware,repositories,routes,validation}/**/*.js': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
