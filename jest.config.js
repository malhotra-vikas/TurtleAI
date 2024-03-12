module.exports = {
  testTimeout: 100000,
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  setupFiles: ['./jest.setup.ts'], // Specify the path to your setup file

};
