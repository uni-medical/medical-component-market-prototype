import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      include: ["src/lib/**/*.ts", "src/components/**/*.tsx"],
      exclude: [
        "**/*.test.*",
        // These route-level concept views are validated through Playwright.
        // Their rendering branches are intentionally presentation-heavy and
        // are not treated as a unit-level quality signal for the data layer.
        "src/components/concepts/concept-hub.tsx",
        "src/components/concepts/concept-frame.tsx",
        "src/components/concepts/domain-atlas.tsx",
        "src/components/concepts/composition-studio.tsx",
        "src/components/concepts/ecosystem-showcase.tsx",
      ],
    },
  },
});
