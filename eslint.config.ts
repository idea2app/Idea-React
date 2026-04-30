import cspellPlugin from '@cspell/eslint-plugin';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

/**
 * When using the ESLint extension, remember to check the "ESLint: Use Flat config" setting for instant code rule hints.
 */
const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

export default tsEslint.config(
    // register all of the plugins up-front
    {
        plugins: {
            '@typescript-eslint': tsEslint.plugin,
            // - https://github.com/jsx-eslint/eslint-plugin-react/issues/3838#issuecomment-2395472758
            react: /** @type {import('eslint').ESLint.Plugin} */ react,
            'simple-import-sort': simpleImportSortPlugin,
            '@cspell': cspellPlugin
        }
    },
    {
        // config with just ignores is the replacement for `.eslintignore`
        ignores: ['**/node_modules/**', '**/dist/**', '**/.parcel-cache/**', '.github/**']
    },

    // extends ...
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,

    // base config
    {
        languageOptions: {
            globals: { ...globals.es2020, ...globals.browser, ...globals.node },
            parserOptions: {
                projectService: true,
                tsconfigRootDir,
                warnOnUnsupportedTypeScriptVersion: false
            }
        },
        rules: {
            'arrow-body-style': ['error', 'as-needed'],
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // Keep the rest close to simple-import-sort defaults.
                        ['^\\u0000'],
                        ['^node:'],

                        // External packages except Prism.
                        ['^(?!prismjs$)@?\\w'],

                        // Prism imports between external and internal packages.
                        ['^prismjs$', '^\\u0000prismjs/components/'],

                        // Internal absolute imports, then relative imports.
                        ['^'],
                        ['^\\.']
                    ]
                }
            ],
            'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
            'react/jsx-no-target-blank': 'warn',
            'react/jsx-sort-props': [
                'error',
                {
                    reservedFirst: true,
                    shorthandLast: true,
                    callbacksLast: true,
                    noSortAlphabetically: true
                }
            ],
            'react/self-closing-comp': ['error', { component: true, html: true }],
            '@typescript-eslint/no-unused-vars': [
                'error',
                { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }
            ],
            '@typescript-eslint/no-empty-object-type': 'off',
            '@cspell/spellchecker': [
                'warn',
                {
                    cspell: {
                        language: 'en',
                        dictionaries: ['typescript', 'node', 'html', 'css', 'bash', 'npm']
                    }
                }
            ]
        }
    },
    {
        files: ['**/*.js'],
        extends: [tsEslint.configs.disableTypeChecked],
        rules: {
            // turn off other type-aware rules
            '@typescript-eslint/internal/no-poorly-typed-ts-props': 'off',

            // turn off rules that don't apply to JS code
            '@typescript-eslint/explicit-function-return-type': 'off'
        }
    },
    eslintConfigPrettier
);
