import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...baseConfig,
  entry: {
    index: 'src/index.ts',
    'core12/index': 'src/core12/index.ts',
  },
  external: ['@gtcx/types', 'zod'],
});
