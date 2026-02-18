import type { Options } from 'tsup';

/**
 * Shared tsup base configuration for GTCX monorepo packages.
 *
 * Usage in tsup.config.ts:
 *   import { baseConfig } from '@gtcx/tsup-config';
 *   export default defineConfig({ ...baseConfig, entry: { ... } });
 */
export const baseConfig: Options = {
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
};
