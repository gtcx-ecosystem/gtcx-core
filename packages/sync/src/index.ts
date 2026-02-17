export * from './types';

import type { ISyncEngine } from './types';

export function createSyncEngine(): ISyncEngine {
  return {
    sync: async () => ({
      uploaded: 0,
      downloaded: 0,
      conflicts: 0,
      resolved: 0,
      errors: ['Sync engine not implemented'],
      durationMs: 0,
    }),
    getStatus: () => 'idle' as const,
    cancel: () => {},
  };
}
