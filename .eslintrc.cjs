/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
        project: ["./tsconfig.json"],
        extraFileExtensions: [".svelte"],
    },
    plugins: ["@typescript-eslint", "unused-imports"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:svelte/recommended",
        "plugin:svelte/prettier",
        "prettier",
    ],
    ignorePatterns: ["*.cjs"],
    env: {
        browser: true,
        es2017: true,
        node: true,
    },
    rules: {
        "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
        eqeqeq: "error",
        curly: ["error", "all"],
        "brace-style": ["error", "1tbs"],
        "arrow-body-style": ["error", "always"],
        "object-shorthand": ["error", "always"],
        "unused-imports/no-unused-imports": "error",
    },
    overrides: [
        {
            files: ["*.svelte"],
            parser: "svelte-eslint-parser",
            parserOptions: { parser: "@typescript-eslint/parser" },
            rules: {
                "svelte/no-at-html-tags": "off",
            },
        },
        {
            files: ["src/lib/**/*.{js,ts}"],
            rules: {
                "no-restricted-syntax": [
                    "error",
                    {
                        selector: "ExportDefaultDeclaration",
                        message: "Use named exports instead.",
                    },
                ],
            },
        },
    ],
};
