import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // This maps @/ to the root directory (core/)
  },
  modulePaths: ['<rootDir>'], // This helps Jest find modules
  roots: ['<rootDir>'], // Set root directory
  moduleDirectories: [
    'node_modules',
    '<rootDir>' // Add root to module directories
  ],
  // Add this if you're using TypeScript paths
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json' // Point to your tsconfig
    }
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth)/)',
  ],
};

export default createJestConfig(config);