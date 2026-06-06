import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@gtcx/crypto': path.resolve(
        __dirname,
        '../../packages/crypto/src/index.ts'
      ),
      '@gtcx/domain': path.resolve(
        __dirname,
        '../../packages/domain/src/index.ts'
      ),
      '@gtcx/events': path.resolve(
        __dirname,
        '../../packages/events/src/index.ts'
      ),
      '@gtcx/identity': path.resolve(
        __dirname,
        '../../packages/identity/src/index.ts'
      ),
      '@gtcx/schemas': path.resolve(
        __dirname,
        '../../packages/schemas/src/index.ts'
      ),
      '@gtcx/security': path.resolve(
        __dirname,
        '../../packages/security/src/index.ts'
      ),
      '@gtcx/sync': path.resolve(
        __dirname,
        '../../packages/sync/src/index.ts'
      ),
      '@gtcx/types': path.resolve(
        __dirname,
        '../../packages/types/src/index.ts'
      ),
      '@gtcx/verification': path.resolve(
        __dirname,
        '../../packages/verification/src/index.ts'
      ),
      '@gtcx/workproof/circuit-profiles': path.resolve(
        __dirname,
        '../../packages/workproof/src/circuit-profiles/index.ts'
      ),
      '@gtcx/workproof': path.resolve(
        __dirname,
        '../../packages/workproof/src/index.ts'
      ),
      '@gtcx/runtime': path.resolve(
        __dirname,
        '../../packages/runtime/src/index.ts'
      ),
      '@gtcx/api-client': path.resolve(
        __dirname,
        '../../packages/api-client/src/index.ts'
      ),
      '@gtcx/connectivity': path.resolve(
        __dirname,
        '../../packages/connectivity/src/index.ts'
      ),
      '@gtcx/resilience': path.resolve(
        __dirname,
        '../../packages/resilience/src/index.ts'
      ),
      '@gtcx/telemetry': path.resolve(
        __dirname,
        '../../packages/telemetry/src/index.ts'
      ),
      '@gtcx/logging': path.resolve(
        __dirname,
        '../../packages/logging/src/index.ts'
      ),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    testTimeout: 30_000,
  },
});
