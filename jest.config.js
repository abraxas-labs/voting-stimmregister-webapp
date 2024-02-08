/* eslint-env es6 */
/* eslint-disable no-console */
const { pathsToModuleNameMapper } = require('ts-jest');
const { paths } = require('./tsconfig.spec.json').compilerOptions;

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-preset-angular',
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>' }),
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testResultsProcessor: 'jest-sonar-reporter',
};
