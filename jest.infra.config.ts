import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  // 🔥 Only run infra tests
  testMatch: ["**/tests/user/rate-limit.test.ts"],

  // 🔥 Tell Jest how to compile TS
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },

  setupFiles: ["<rootDir>/tests/setup.infra.ts"],

  testTimeout: 15000,
};

export default config;
