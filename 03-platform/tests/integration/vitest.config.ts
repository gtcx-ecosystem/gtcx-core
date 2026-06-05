import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@gtcx/crypto': path.resolve(
        __dirname,
        '../../03-platform/packages/crypto/03-platform/src/index.ts'
      ),
      '@gtcx/domain': path.resolve(
        __dirname,
        '../../03-platform/packages/domain/03-platform/src/index.ts'
      ),
      '@gtcx/events': path.resolve(
        __dirname,
        '../../03-platform/packages/events/03-platform/src/index.ts'
      ),
      '@gtcx/identity': path.resolve(
        __dirname,
        '../../03-platform/packages/identity/03-platform/src/index.ts'
      ),
      '@gtcx/schemas': path.resolve(
        __dirname,
        '../../03-platform/packages/schemas/03-platform/src/index.ts'
      ),
      '@gtcx/security': path.resolve(
        __dirname,
        '../../03-platform/packages/security/03-platform/src/index.ts'
      ),
      '@gtcx/sync': path.resolve(
        __dirname,
        '../../03-platform/packages/sync/03-platform/src/index.ts'
      ),
      '@gtcx/types': path.resolve(
        __dirname,
        '../../03-platform/packages/types/03-platform/src/index.ts'
      ),
      '@gtcx/verification': path.resolve(
        __dirname,
        '../../03-platform/packages/verification/03-platform/src/index.ts'
      ),
      '@gtcx/workproof/circuit-profiles': path.resolve(
        __dirname,
        '../../03-platform/packages/workproof/03-platform/src/circuit-profiles/index.ts'
      ),
      '@gtcx/workproof': path.resolve(
        __dirname,
        '../../03-platform/packages/workproof/03-platform/src/index.ts'
      ),
      '@gtcx/runtime': path.resolve(
        __dirname,
        '../../03-platform/packages/runtime/03-platform/src/index.ts'
      ),
      '@gtcx/api-client': path.resolve(
        __dirname,
        '../../03-platform/packages/api-client/03-platform/src/index.ts'
      ),
      '@gtcx/connectivity': path.resolve(
        __dirname,
        '../../03-platform/packages/connectivity/03-platform/src/index.ts'
      ),
      '@gtcx/resilience': path.resolve(
        __dirname,
        '../../03-platform/packages/resilience/03-platform/src/index.ts'
      ),
      '@gtcx/telemetry': path.resolve(
        __dirname,
        '../../03-platform/packages/telemetry/03-platform/src/index.ts'
      ),
      '@gtcx/logging': path.resolve(
        __dirname,
        '../../03-platform/packages/logging/03-platform/src/index.ts'
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
