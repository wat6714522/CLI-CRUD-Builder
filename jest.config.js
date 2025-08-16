export default {
  // Test environment
  testEnvironment: 'node',

  // Transform configuration for ES modules
  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  // Test file patterns
  testMatch: ['**/test/**/*.test.js'],

  // Files to ignore during testing
  testPathIgnorePatterns: ['/node_modules/', '/template/', '/bin/output/'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    'bin/**/*.js',
    '!**/node_modules/**',
    '!**/template/**',
    '!**/coverage/**',
    '!**/__tests__/**',
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html', 'json'],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Verbose output
  verbose: true,

  // Setup files (if needed)
  setupFilesAfterEnv: [],

  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'node'],

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Timeout for tests (in milliseconds)
  testTimeout: 10000,

  // Bail on first test failure (optional)
  bail: false,

  // Force exit after tests complete
  forceExit: true,

  // Detect open handles
  detectOpenHandles: true,
};
