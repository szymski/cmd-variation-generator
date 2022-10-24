/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  // [...]
  setupFiles: ["<rootDir>/jest.setup.mjs"],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    "^@test/(.*)$": "<rootDir>/test/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
    '^(\\.{1,2}/.*)\\.js$': '$1',
    "#(.*)": "<rootDir>/node_modules/$1",
  },
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
  testRegex: '.*\\.test\\.(ts|tsx)$',
  roots: [
    "<rootDir>/src/",
    "<rootDir>/test/",
  ],
};

export default config;
