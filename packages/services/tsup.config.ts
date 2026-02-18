import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...baseConfig,
  entry: {
    index: 'src/index.ts',
    registration: 'src/registration.ts',
    trading: 'src/trading.ts',
    compliance: 'src/compliance.ts',
  },
  external: ['@gtcx/domain'],
});
