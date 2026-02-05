import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'certificates/index': 'src/certificates/index.ts',
    'qr/index': 'src/qr/index.ts',
    'proofs/index': 'src/proofs/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['@gtcx/ai', '@gtcx/crypto', '@gtcx/types', 'zod'],
});
