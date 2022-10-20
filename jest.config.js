/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  // [...]
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    "#(.*)": "<rootDir>/node_modules/$1",
  },
  snapshotFormat: {
    printBasicPrototype: true,
  },
  // runner: "jest-runner-tsc",
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  preset: "ts-jest/presets/default-esm",
  moduleFileExtensions: ['ts', 'tsx', 'js', 'cjs'],
  testRegex: '.*\\.test\\.(ts|tsx)$'
};

export default config;
