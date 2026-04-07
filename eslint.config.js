import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '.eslintrc.js',
        ]
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,ts}'],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            'sort-vars': 'error',
            "eol-last": ["error", "always"],
            "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
            "@typescript-eslint/no-this-alias": "warn"
        },
    },
    {
        files: ['vite.config.ts'],
        languageOptions: {
            globals: {process: 'readonly'},
        },
    },
);
