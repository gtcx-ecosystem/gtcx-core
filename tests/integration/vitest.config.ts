import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@gtcx/crypto': path.resolve(__dirname, '../../packages/crypto/src/index.ts'),
      '@gtcx/domain': path.resolve(__dirname, '../../packages/domain/src/index.ts'),
      '@gtcx/events': path.resolve(__dirname, '../../packages/events/src/index.ts'),
      '@gtcx/identity': path.resolve(__dirname, '../../packages/identity/src/index.ts'),
      '@gtcx/schemas': path.resolve(__dirname, '../../packages/schemas/src/index.ts'),
      '@gtcx/security': path.resolve(__dirname, '../../packages/security/src/index.ts'),
      '@gtcx/sync': path.resolve(__dirname, '../../packages/sync/src/index.ts'),
      '@gtcx/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@gtcx/verification': path.resolve(__dirname, '../../packages/verification/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    testTimeout: 30_000,
  },
});
