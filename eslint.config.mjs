import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Apply these rules to JS/TS files
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Disable `no-explicit-any` rule
    },
  },
];

export default eslintConfig;
