module.exports = {
  extends: 'airbnb-base',
  globals: {
    spawn: 'readonly',
  },
  rules: {
    indent: ['error', 2, { MemberExpression: 0 }],
    'no-trailing-spaces': 'error',
    'arrow-parens': 'off',
    'class-methods-use-this': 'off',
    'no-await-in-loop': 'off',
    'no-plusplus': 'off',
    'no-bitwise': 'off',
    'no-mixed-operators': 'off',
    'object-curly-newline': ['error', {
      ObjectExpression: { minProperties: 6, multiline: true, consistent: true },
      ObjectPattern: { minProperties: 6, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 6, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 6, multiline: true, consistent: true },
    }],
  },
  env: {
    node: true,
    browser: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2023,
  },
  plugins: [
    'jest',
  ],
};
