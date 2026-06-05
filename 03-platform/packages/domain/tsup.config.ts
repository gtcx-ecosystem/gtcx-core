import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({
  ...baseConfig,
  entry: {
    index: 'src/index.ts',
    schemas: 'src/schemas.ts',
    events: 'src/events.ts',
    'ai-logging': 'src/ai-logging.ts',
    'ai-integration': 'src/ai-integration.ts',
    metrics: 'src/metrics.ts',
    migrations: 'src/migrations.ts',
    versioning: 'src/versioning.ts',
    'internal/offline-queue': 'src/internal/offline-queue.ts',
  },
  external: ['@gtcx/events', '@gtcx/types', '@gtcx/crypto'],
});
