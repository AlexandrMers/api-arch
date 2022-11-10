import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testRegex: "e2e-spec.ts$",
  moduleDirectories: ["src", "node_modules"],
};

export default config;
