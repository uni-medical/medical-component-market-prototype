import tseslint from "typescript-eslint";
export default tseslint.config(
  {ignores:["dist/**","node_modules/**","vite.config.js","vite.config.d.ts"]},
  ...tseslint.configs.recommended
);
