import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...baseConfig,
  entry: {
    index: 'src/index.ts',
    'certificates/index': 'src/certificates/index.ts',
    'qr/index': 'src/qr/index.ts',
    'proofs/index': 'src/proofs/index.ts',
  },
  external: ['@gtcx/ai', '@gtcx/crypto', '@gtcx/types', 'zod'],
});
