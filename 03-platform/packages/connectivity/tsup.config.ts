import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
});
