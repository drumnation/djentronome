/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    'vitest/env': true
  },
  plugins: ['vitest'],
  rules: {
    'vitest/expect-expect': 'error',
    'vitest/no-disabled-tests': 'warn',
    'vitest/no-focused-tests': 'error',
    'vitest/no-identical-title': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: {
        'vitest/env': true,
      },
    },
  ],
}; 