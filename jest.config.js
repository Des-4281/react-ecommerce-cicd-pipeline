export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^.*/firebaseConfig$": "<rootDir>/src/test/mocks/firebaseConfig.ts",
    "^firebase/auth$": "<rootDir>/src/test/mocks/firebaseAuth.ts",
    "\\.(css)$": "<rootDir>/src/test/mocks/styleMock.ts",
  },
};