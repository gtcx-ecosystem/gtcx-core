/**
 * Shared tsup base configuration for GTCX monorepo packages.
 *
 * Usage in tsup.config.ts:
 *   import { baseConfig } from '@gtcx/tsup-config';
 *   export default defineConfig({ ...baseConfig, entry: { ... } });
 *
 * @type {import('tsup').Options}
 */
export const baseConfig = {
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
};

/**
 * Release configuration — optimized for size.
 * Use for production builds where debugging is secondary to bundle size.
 *
 * @type {import('tsup').Options}
 */
export const releaseConfig = {
  ...baseConfig,
  minify: true,
  sourcemap: true,
};
