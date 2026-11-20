import { defineConfig } from "vitest/config";

// Unit tests cover the helper functions in src/utils/.
export default defineConfig({
    test: {
        include: ["src/utils/**/*.test.ts"],
    },
});
