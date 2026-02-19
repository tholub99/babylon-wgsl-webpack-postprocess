import { Config } from 'jest';

const config: Config = {
    testEnvironment: 'node',
    preset: 'ts-jest',
    setupFilesAfterEnv: ['jest-extended/all'],
};

export default config;