import { describe, it, expect } from 'vitest';

import { createSyncEngine } from '../src/index';
import type { ConflictStrategy, SyncOptions, SyncResult, SyncItem, SyncStatus } from '../src/types';

describe('@gtcx/sync', () => {
  describe('createSyncEngine', () => {
    it('should return a stub sync engine', () => {
      const engine = createSyncEngine();
      expect(engine).toBeDefined();
      expect(typeof engine.sync).toBe('function');
      expect(typeof engine.getStatus).toBe('function');
      expect(typeof engine.cancel).toBe('function');
    });

    it('should return idle status by default', () => {
      const engine = createSyncEngine();
      expect(engine.getStatus()).toBe('idle');
    });

    it('should return expected defaults from sync', async () => {
      const engine = createSyncEngine();
      const result = await engine.sync([], { strategy: 'last-write-wins' });
      expect(result.uploaded).toBe(0);
      expect(result.downloaded).toBe(0);
      expect(result.conflicts).toBe(0);
      expect(result.resolved).toBe(0);
      expect(result.errors).toEqual(['Sync engine not implemented']);
      expect(result.durationMs).toBe(0);
    });

    it('should not throw when cancel is called', () => {
      const engine = createSyncEngine();
      expect(() => engine.cancel()).not.toThrow();
    });
  });

  describe('types', () => {
    it('should export all type interfaces', () => {
      // Type-level checks — these verify the types compile correctly
      const strategy: ConflictStrategy = 'last-write-wins';
      const options: SyncOptions = { strategy: 'server-wins' };
      const result: SyncResult = {
        uploaded: 0,
        downloaded: 0,
        conflicts: 0,
        resolved: 0,
        errors: [],
        durationMs: 0,
      };
      const item: SyncItem<string> = { id: '1', data: 'test', version: 1, updatedAt: Date.now() };
      const status: SyncStatus = 'idle';

      expect(strategy).toBeDefined();
      expect(options).toBeDefined();
      expect(result).toBeDefined();
      expect(item).toBeDefined();
      expect(status).toBeDefined();
    });
  });
});
