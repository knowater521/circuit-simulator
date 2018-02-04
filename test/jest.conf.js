const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../'),
    moduleFileExtensions: [
        'ts',
        'js',
        'vue',
    ],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest',
        '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    },
    testRegex: '(\\.|/)(test|spec)\\.tsx?$',
    snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
    setupFiles: ['<rootDir>/test/setup.ts'],
    mapCoverage: true,
    coverageDirectory: '<rootDir>/test/coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,vue}',
        '!src/main.ts',
        '!src/css/*.styl',
        '!src/components/*/index.ts',
        '!**/node_modules/**',
    ],
};
