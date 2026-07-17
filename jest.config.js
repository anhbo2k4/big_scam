module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'controllers/**/*.js',
    'middleware/**/*.js',
    'utils/**/*.js',
    '!node_modules/**',
    '!tests/**'
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 90,
      lines: 85
    }
  },
  setupFiles: ['<rootDir>/tests/setup-db.js'],
  forceExit: true,
  detectOpenHandles: true,
  testTimeout: 10000,
  maxWorkers: 1,
  verbose: true
};
