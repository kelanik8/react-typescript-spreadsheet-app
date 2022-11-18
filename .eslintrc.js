module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "react-hooks"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "default", format: ["camelCase"] },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "parameter",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      { selector: "function", format: ["camelCase", "PascalCase"] },
      {
        selector: "memberLike",
        format: ["camelCase", "PascalCase", "snake_case"],
        leadingUnderscore: "allow",
      },
      { selector: "typeLike", format: ["PascalCase"] },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": ["error", { allow: ["methods"] }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-use-before-define": [
      "error",
      { classes: false, functions: false },
    ],
    "array-element-newline": ["error", "consistent"],
    "class-methods-use-this": "off",
    "function-call-argument-newline": ["error", "consistent"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-default-export": "error",
    "import/prefer-default-export": "off",
    "jsx-a11y/no-noninteractive-tabindex": "off",
    "lines-between-class-members": "off",
    "max-len": ["error", { code: 150 }],
    "max-classes-per-file": ["error", 4],
    "no-use-before-define": "off",
    "prettier/prettier": "error",
    "quotes": [
      "error",
      "double",
      { avoidEscape: true, allowTemplateLiterals: false },
    ],
    "quote-props": ["error", "consistent-as-needed"],
    "react/jsx-filename-extension": "off",
    "react/require-default-props": "off",
    "react-hooks/exhaustive-deps": "error",
  },
  settings: {
    "react": {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
