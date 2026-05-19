import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['dist/**', 'node_modules/**'],
      thresholds: {
        lines: 95,
        functions: 90,
        branches: 95,
        statements: 95,
      },
    },
  },
});
