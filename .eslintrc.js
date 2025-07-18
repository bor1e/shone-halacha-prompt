module.exports = {
  root: true,
  ignorePatterns: ['projects/**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true
      },
      extends: [
        '@typescript-eslint/recommended',
        '@angular-eslint/recommended',
        '@angular-eslint/template/process-inline-templates'
      ],
      rules: {
        "quotes": ["error", "double"],
        "import/no-unresolved": 0,
        "indent": ["error", 4],
      },
    },
    {
      files: ['*.html'],
      extends: ['@angular-eslint/template/recommended']
    }
  ]
};