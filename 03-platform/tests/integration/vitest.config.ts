import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@gtcx/crypto': path.resolve(
        __dirname,
        '../../03-platform/packages/crypto/src/index.ts'
      ),
      '@gtcx/domain': path.resolve(
        __dirname,
        '../../03-platform/packages/domain/src/index.ts'
      ),
      '@gtcx/events': path.resolve(
        __dirname,
        '../../03-platform/packages/events/src/index.ts'
      ),
      '@gtcx/identity': path.resolve(
        __dirname,
        '../../03-platform/packages/identity/src/index.ts'
      ),
      '@gtcx/schemas': path.resolve(
        __dirname,
        '../../03-platform/packages/schemas/src/index.ts'
      ),
      '@gtcx/security': path.resolve(
        __dirname,
        '../../03-platform/packages/security/src/index.ts'
      ),
      '@gtcx/sync': path.resolve(
        __dirname,
        '../../03-platform/packages/sync/src/index.ts'
      ),
      '@gtcx/types': path.resolve(
        __dirname,
        '../../03-platform/packages/types/src/index.ts'
      ),
      '@gtcx/verification': path.resolve(
        __dirname,
        '../../03-platform/packages/verification/src/index.ts'
      ),
      '@gtcx/workproof/circuit-profiles': path.resolve(
        __dirname,
        '../../03-platform/packages/workproof/src/circuit-profiles/index.ts'
      ),
      '@gtcx/workproof': path.resolve(
        __dirname,
        '../../03-platform/packages/workproof/src/index.ts'
      ),
      '@gtcx/runtime': path.resolve(
        __dirname,
        '../../03-platform/packages/runtime/src/index.ts'
      ),
      '@gtcx/api-client': path.resolve(
        __dirname,
        '../../03-platform/packages/api-client/src/index.ts'
      ),
      '@gtcx/connectivity': path.resolve(
        __dirname,
        '../../03-platform/packages/connectivity/src/index.ts'
      ),
      '@gtcx/resilience': path.resolve(
        __dirname,
        '../../03-platform/packages/resilience/src/index.ts'
      ),
      '@gtcx/telemetry': path.resolve(
        __dirname,
        '../../03-platform/packages/telemetry/src/index.ts'
      ),
      '@gtcx/logging': path.resolve(
        __dirname,
        '../../03-platform/packages/logging/src/index.ts'
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
