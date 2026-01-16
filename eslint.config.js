'use strict'

const globals = require('globals')
const eslintPluginPlugin = require('eslint-plugin-eslint-plugin')
const eslintPluginN = require('eslint-plugin-n')
const eslintPluginPrettier = require('eslint-plugin-prettier')
const eslintPluginJest = require('eslint-plugin-jest')
const eslintConfigPrettier = require('eslint-config-prettier')

module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'script',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      'eslint-plugin': eslintPluginPlugin,
      n: eslintPluginN,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginPlugin.configs.recommended.rules,
      ...eslintPluginN.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      strict: ['error', 'global'],
      'eslint-plugin/require-meta-docs-description': [
        'error',
        { pattern: '^(Enforce|Require|Disallow|Prefer).+\\.$' },
      ],
      'eslint-plugin/prefer-placeholders': 'error',
      'eslint-plugin/test-case-shorthand-strings': 'error',
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'script',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      strict: ['error', 'global'],
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['__tests__/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    plugins: {
      jest: eslintPluginJest,
    },
    rules: {
      ...eslintPluginJest.configs.recommended.rules,
    },
  },
]
