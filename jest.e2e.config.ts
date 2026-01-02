import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  testMatch: ["**/tests/e2e/**/*.test.ts"],

  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },

  setupFiles: ["<rootDir>/tests/setup.e2e.ts"],

  testTimeout: 30000,
};

export default config;
