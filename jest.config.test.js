module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: "coverage/apps/technical-challenge-swapi-nasa",
  coverageProvider: "v8",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  coveragePathIgnorePatterns: [
    "<rootDir>/framework/",
    "<rootDir>/node_modules/",
  ],
  moduleFileExtensions: ["ts", "tsx", "js"],
};
