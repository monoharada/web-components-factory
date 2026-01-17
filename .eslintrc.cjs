/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2022: true,
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended'],
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'test-results/',
    'coverage/',
    '.context/',
    '.codex/',
    'tmp/',
  ],
  rules: {
    // このリポジトリは現状 ESLint の導入が目的（まずは実行可能にする）
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-undef': 'off',
    'no-redeclare': 'off',
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': 'error',
    'no-useless-escape': 'off',
  },
};
