/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  extends: ['./base.js'],
  overrides: [
    {
      files: ['**/*.md'],
      parser: 'markdown-eslint-parser',
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-empty-interface': 'off',
      },
    },
  ],
};
