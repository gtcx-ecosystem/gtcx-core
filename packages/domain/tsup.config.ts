import { defineConfig } from 'tsup';

export default defineConfig({
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
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
  minify: false,
  external: ['@gtcx/types', '@gtcx/crypto'],
});
