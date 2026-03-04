module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort'],

  rules: {
    // Disable default unused vars rule (handled below)
    '@typescript-eslint/no-unused-vars': 'off',

    // Remove unused imports
    'unused-imports/no-unused-imports': 'error',

    // Remove unused variables (ignore ones prefixed with _)
    'unused-imports/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // Keep imports clean and sorted
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
