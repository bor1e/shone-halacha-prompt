const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.dev.json"],
        sourceType: "module",
      },
      globals: {
        node: true,
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "quotes": ["error", "double"],
      "indent": ["error", 2],
      "@typescript-eslint/no-unused-expressions": ["error", {
        "allowShortCircuit": true,
        "allowTernary": true,
      }],
      ...typescriptEslint.configs.recommended.rules,
    },
  },
  {
    ignores: ["lib/**/*", "generated/**/*"],
  },
];