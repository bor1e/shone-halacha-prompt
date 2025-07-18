module.exports = {
  extends: ['../.eslintrc.js'],
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module'
  },
  rules: {
    // Function-specific overrides if needed
    'import/no-unresolved': 'error'
  }
};