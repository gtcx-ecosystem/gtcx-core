/**
 * @gtcx/eslint-config
 * Shared ESLint flat configuration for GTCX monorepo
 */

const prettierConfig = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');
const tseslint = require('typescript-eslint');

module.exports = [
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/.turbo/',
      '**/coverage/',
      '**/*.js.map',
      '**/*.d.ts',
      '**/*.d.ts.map',
      'packages/*/src/**/*.js',
      'packages/*/tests/**/*.js',
      'packages/*/vitest.config.js',
      'packages/*/tsup.config.js',
      'vitest.workspace.js',
    ],
  },
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    // Allow require() in CJS config files
    files: ['**/*.cjs', '**/eslint.config.js', 'packages/config/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Import
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error',

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    // Ban Math.random() in source files
    files: ['**/src/**/*.ts', '**/src/**/*.tsx', '**/src/**/*.js', '**/src/**/*.jsx'],
    ignores: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/__tests__/**'],
    rules: {
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message: 'Use crypto.randomUUID() or crypto.randomBytes() instead of Math.random().',
        },
      ],
    },
  },
];
