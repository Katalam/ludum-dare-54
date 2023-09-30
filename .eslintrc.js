module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: ".",
        project: ['./tsconfig.json'],
    },
    plugins: [
        '@typescript-eslint',
        'import',
        'eslint-comments'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:eslint-comments/recommended'
    ],
    rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "no-empty": "warn"
    }
};