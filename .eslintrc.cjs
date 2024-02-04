/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'arrow-spacing': ['warn', { before: true, after: true }],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': 'error',
    'comma-style': 'error',
    curly: ['error', 'multi-line', 'consistent'],
    'dot-location': ['error', 'property'],
    'handle-callback-err': 'off',
    'keyword-spacing': 'error',
    'max-nested-callbacks': ['error', { max: 4 }],
    'max-statements-per-line': ['error', { max: 2 }],
    'no-console': 'off',
    'no-empty-function': 'off',
    'no-empty': 'off',
    'no-floating-decimal': 'error',
    'no-inline-comments': 'error',
    'no-lonely-if': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'no-trailing-spaces': ['error'],
    'no-var': 'error',
    'object-curly-spacing': ['error', 'always'],
    'prefer-const': 'error',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'space-before-blocks': 'error',
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    yoda: 'error',
  },
};
