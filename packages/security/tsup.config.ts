import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'validation/index': 'src/validation/index.ts',
    'auth/index': 'src/auth/index.ts',
    'offline/index': 'src/offline/index.ts',
    'audit/index': 'src/audit/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['@gtcx/crypto', '@gtcx/types'],
});
