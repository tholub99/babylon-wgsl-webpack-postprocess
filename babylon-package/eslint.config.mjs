import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import eslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['**/node_modules', '**/.git', 'dist', 'package-lock.json']),
    {
        files: ['**/*.ts', '**/*,js'],

        extends: [
            js.configs.recommended,
            eslint.configs.recommended,
            importPlugin.flatConfigs.recommended,
            importPlugin.flatConfigs.typescript,
        ],

        settings: {
            'import/resolver': {
                node: {
                    extensions: ['.js', '.ts'],
                },
            },
        },

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 'latest',
            },
        },

        rules: {
            'sort-imports': [
                'error',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: true,
                },
            ],

            'import/order': [
                'error',
                {
                    'newlines-between': 'always',

                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],

            '@typescript-eslint/no-explicit-any': ['off'],
            '@typescript-eslint/no-unused-expressions': ['off'],
        },
    },
]);
