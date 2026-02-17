import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    registration: 'src/registration.ts',
    trading: 'src/trading.ts',
    compliance: 'src/compliance.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  minify: false,
  external: ['@gtcx/domain'],
});
