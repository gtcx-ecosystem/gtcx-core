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
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
};
