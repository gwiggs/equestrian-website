module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',  // If using React
      'plugin:@typescript-eslint/recommended',  // If using TypeScript
      'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',  // For TypeScript
    parserOptions: {
      ecmaFeatures: {
        jsx: true,  // If using React
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: [
      'react',  // If using React
      '@typescript-eslint',  // If using TypeScript
    ],
    rules: {
      // Equestrian marketplace specific rules
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'camelcase': ['error', { properties: 'never' }],
      'jsx-a11y/alt-text': 'error',  // Important for horse images
      'no-eval': 'error',
      'react/no-danger': 'error',
    },
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        }
      }
    }
  };