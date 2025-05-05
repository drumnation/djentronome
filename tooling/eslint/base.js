/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: [
    // Build outputs
    'dist/',
    'out/',
    'storybook-static/',
    'playwright-report/',
    'coverage/',

    // Cache and temporary files
    '.turbo/',
    '.next/',
    'node_modules/',

    // IDE and test files
    '.vscode/',
    '.vscode-test/',
    '.vscode-test-web/',

    // Project specific directories
    '.frontend-logging/',
    '.cursorrules/',
    '.concepts/',
    '.brain/',

    // Test brain directories
    'apps/testing-e2e/var/*',
    'apps/testing-unit/.brain',
    'apps/testing-integration/.brain',
    'apps/testing-e2e/.brain',

    // Configuration files
    '**/playwright.config.ts',

    // Generated JavaScript files (when using TypeScript)
    '*.js',

    // Documentation files (from original config)
    '**/*.md',
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-assertions': 'error',
    'prettier/prettier': 'error',
  },
};
