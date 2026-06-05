import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...baseConfig,
  entry: {
    index: 'src/index.ts',
    admin: 'src/admin.ts',
    server: 'src/server.ts',
  },
});
