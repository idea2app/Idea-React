import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url));

export default tsEslint.config(
    // register all of the plugins up-front
    {
        plugins: {
            '@typescript-eslint': tsEslint.plugin,
            react: fixupPluginRules(reactPlugin),
            'simple-import-sort': simpleImportSortPlugin
        }
    },
    // config with just ignores is the replacement for `.eslintignore`
    { ignores: ['**/node_modules/**', '**/dist/**', '**/.parcel-cache/**'] },

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
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': 'error',
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
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unsafe-declaration-merging': 'warn'
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
