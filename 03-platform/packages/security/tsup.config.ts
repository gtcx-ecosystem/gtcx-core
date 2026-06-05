import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...baseConfig,
  entry: {
    index: 'src/index.ts',
    'validation/index': 'src/validation/index.ts',
    'auth/index': 'src/auth/index.ts',
    'offline/index': 'src/offline/index.ts',
    'audit/index': 'src/audit/index.ts',
  },
  external: ['@gtcx/crypto', '@gtcx/types'],
});
