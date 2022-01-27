module.exports = {
    preset: 'ts-jest',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/test/__mocks__/styleMock.js',
    },
    modulePathIgnorePatterns: ["<rootDir>/packages/suke-web", "dist"],
    runner: 'groups',
    watchPlugins: ['jest-watch-yarn-workspaces']
};