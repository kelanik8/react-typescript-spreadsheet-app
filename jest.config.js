module.exports = {
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  testEnvironment: "jsdom",
  transform: { "^.+\\.tsx?$": "ts-jest" },
  verbose: true,
};
