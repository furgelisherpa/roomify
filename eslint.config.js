import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // React (ESLint v10-compatible)
  {
    files: ["**/*.{tsx,jsx}"],
    ...eslintReact.configs["recommended-type-checked"],
    languageOptions: {
      ...eslintReact.configs["recommended-type-checked"].languageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Custom rule overrides
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Disable rules that conflict with Prettier (always last)
  prettierConfig,

  // Files / dirs to ignore
  {
    ignores: ["node_modules/**", "build/**", ".react-router/**", "dist/**"],
  },
);
