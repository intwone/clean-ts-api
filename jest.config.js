module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
