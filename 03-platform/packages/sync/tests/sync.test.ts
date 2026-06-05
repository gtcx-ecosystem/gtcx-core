import { describe, it, expect, vi } from 'vitest';

import { createSyncEngine } from '../src/index';
import type {
  ConflictStrategy,
  SyncEngineConfig,
  SyncOptions,
  SyncResult,
  SyncItem,
  SyncStatus,
  SyncAuditEventType,
  SyncAuditEvent,
  SyncMetrics,
} from '../src/types';

describe('@gtcx/sync', () => {
  describe('createSyncEngine', () => {
    it('should return a sync engine', () => {
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

    it('should upload unique items with last-write-wins strategy', async () => {
      const engine = createSyncEngine();
      const items: SyncItem[] = [
        { id: '1', data: { value: 1 }, version: 1, updatedAt: 1 },
        { id: '2', data: { value: 2 }, version: 1, updatedAt: 2 },
      ];
      const result = await engine.sync(items, { strategy: 'last-write-wins' });
      expect(result.uploaded).toBe(2);
      expect(result.downloaded).toBe(0);
      expect(result.conflicts).toBe(0);
      expect(result.resolved).toBe(0);
      expect(result.errors).toEqual([]);
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('should resolve conflicts with last-write-wins', async () => {
      const engine = createSyncEngine();
      const items: SyncItem[] = [
        { id: '1', data: { value: 1 }, version: 1, updatedAt: 1 },
        { id: '1', data: { value: 2 }, version: 2, updatedAt: 2 },
      ];
      const result = await engine.sync(items, { strategy: 'last-write-wins' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(1);
      expect(result.uploaded).toBe(1);
      expect(result.errors).toEqual([]);
    });

    it('should resolve append-only by picking newest item', async () => {
      const engine = createSyncEngine();
      const items: SyncItem[] = [
        { id: '1', data: { value: 1 }, version: 1, updatedAt: 1 },
        { id: '1', data: { value: 2 }, version: 2, updatedAt: 2 },
      ];
      const result = await engine.sync(items, { strategy: 'append-only' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(1);
      expect(result.errors).toEqual([]);
    });

    it('should allow custom conflict resolution callbacks for unresolved strategies', async () => {
      const onConflict = vi.fn();
      const resolveConflict = vi.fn(async ({ local }: { local: SyncItem[] }) => local[1] ?? null);
      const engine = createSyncEngine({ onConflict, resolveConflict });
      const items: SyncItem[] = [
        { id: '1', data: { value: 1 }, version: 1, updatedAt: 1 },
        { id: '1', data: { value: 2 }, version: 2, updatedAt: 2 },
      ];

      const result = await engine.sync(items, { strategy: 'chain-validated' });
      expect(onConflict).toHaveBeenCalledTimes(1);
      expect(resolveConflict).toHaveBeenCalledTimes(1);
      expect(result.resolved).toBe(1);
      expect(result.errors).toEqual([]);
    });

    it('should respect server-wins when remote data exists', async () => {
      const remoteItem: SyncItem = { id: '1', data: { value: 99 }, version: 99, updatedAt: 99 };
      const config: SyncEngineConfig = {
        fetchRemote: vi.fn(async () => [remoteItem]),
      };
      const engine = createSyncEngine(config);
      const items: SyncItem[] = [{ id: '1', data: { value: 1 }, version: 1, updatedAt: 1 }];

      const result = await engine.sync(items, { strategy: 'server-wins' });
      expect(result.downloaded).toBe(1);
      expect(result.uploaded).toBe(0);
    });

    it('should resolve conflicts with highest-version — higher version wins', async () => {
      const engine = createSyncEngine();
      const items: SyncItem[] = [
        { id: '1', data: { value: 'old' }, version: 1, updatedAt: 100 },
        { id: '1', data: { value: 'new' }, version: 5, updatedAt: 50 },
      ];
      const result = await engine.sync(items, { strategy: 'highest-version' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(1);
      expect(result.uploaded).toBe(1);
      expect(result.errors).toEqual([]);
    });

    it('should resolve highest-version — equal versions fall back to timestamp', async () => {
      const pushed: SyncItem[] = [];
      const engine = createSyncEngine({
        pushLocal: async (batch) => {
          pushed.push(...batch);
        },
      });
      const items: SyncItem[] = [
        { id: '1', data: { value: 'earlier' }, version: 3, updatedAt: 10 },
        { id: '1', data: { value: 'later' }, version: 3, updatedAt: 20 },
      ];
      const result = await engine.sync(items, { strategy: 'highest-version' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(1);
      expect(pushed).toHaveLength(1);
      expect(pushed[0]!.data).toEqual({ value: 'later' });
    });

    it('should resolve highest-version — equal versions and timestamps deterministically', async () => {
      const pushed: SyncItem[] = [];
      const engine = createSyncEngine({
        pushLocal: async (batch) => {
          pushed.push(...batch);
        },
      });
      const items: SyncItem[] = [
        { id: '1', data: { value: 'first' }, version: 3, updatedAt: 10 },
        { id: '1', data: { value: 'second' }, version: 3, updatedAt: 10 },
      ];
      const result = await engine.sync(items, { strategy: 'highest-version' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(1);
      expect(pushed).toHaveLength(1);
      // reduce keeps `best` when equal — first item wins
      expect(pushed[0]!.data).toEqual({ value: 'first' });
    });

    it('should return unresolved for chain-validated strategy', async () => {
      const engine = createSyncEngine();
      const items: SyncItem[] = [
        { id: '1', data: { value: 1 }, version: 1, updatedAt: 1 },
        { id: '1', data: { value: 2 }, version: 2, updatedAt: 2 },
      ];
      const result = await engine.sync(items, { strategy: 'chain-validated' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(0);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('Unresolved conflict');
    });

    it('should handle conflicts with missing timestamps (updatedAt = 0)', async () => {
      const pushed: SyncItem[] = [];
      const engine = createSyncEngine({
        pushLocal: async (batch) => {
          pushed.push(...batch);
        },
      });
      const items: SyncItem[] = [
        { id: '1', data: { value: 'a' }, version: 1, updatedAt: 0 },
        { id: '1', data: { value: 'b' }, version: 2, updatedAt: 0 },
      ];
      const result = await engine.sync(items, { strategy: 'last-write-wins' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(1);
      expect(pushed).toHaveLength(1);
      // Equal timestamps — falls back to higher version
      expect(pushed[0]!.data).toEqual({ value: 'b' });
    });

    it('should handle conflict with identical records', async () => {
      const pushed: SyncItem[] = [];
      const engine = createSyncEngine({
        pushLocal: async (batch) => {
          pushed.push(...batch);
        },
      });
      const items: SyncItem[] = [
        { id: '1', data: { value: 'same' }, version: 1, updatedAt: 100 },
        { id: '1', data: { value: 'same' }, version: 1, updatedAt: 100 },
      ];
      const result = await engine.sync(items, { strategy: 'last-write-wins' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(1);
      expect(pushed).toHaveLength(1);
      expect(pushed[0]!.data).toEqual({ value: 'same' });
      expect(pushed[0]!.version).toBe(1);
    });

    it('should resolve chain-validated when items have previousHash', async () => {
      const pushed: SyncItem[] = [];
      const engine = createSyncEngine({
        pushLocal: async (batch) => {
          pushed.push(...batch);
        },
      });
      const items: SyncItem[] = [
        { id: '1', data: { value: 'v1', previousHash: 'abc' }, version: 1, updatedAt: 10 },
        { id: '1', data: { value: 'v3', previousHash: 'def' }, version: 3, updatedAt: 30 },
      ];
      const result = await engine.sync(items, { strategy: 'chain-validated' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(1);
      expect(pushed).toHaveLength(1);
      expect(pushed[0]!.version).toBe(3);
    });

    it('should emit audit and metrics callbacks', async () => {
      const onAudit = vi.fn();
      const onMetrics = vi.fn();
      const engine = createSyncEngine({ onAudit, onMetrics });
      const items: SyncItem[] = [{ id: '1', data: { value: 1 }, version: 1, updatedAt: 1 }];

      const result = await engine.sync(items, { strategy: 'last-write-wins' });
      expect(result.errors).toEqual([]);
      expect(onAudit).toHaveBeenCalled();
      const auditTypes = onAudit.mock.calls.map((call) => call[0].type);
      expect(auditTypes).toContain('sync.start');
      expect(auditTypes).toContain('sync.complete');
      expect(onMetrics).toHaveBeenCalledTimes(1);
      expect(onMetrics.mock.calls[0]![0].status).toBe('idle');
    });
  });

  describe('types', () => {
    it('should export all type interfaces', () => {
      // Type-level checks — these verify the types compile correctly
      const strategy: ConflictStrategy = 'last-write-wins';
      const options: SyncOptions = { strategy: 'server-wins' };
      const config: SyncEngineConfig = {};
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
      const auditType: SyncAuditEventType = 'sync.start';
      const auditEvent: SyncAuditEvent = {
        type: 'sync.complete',
        timestamp: new Date().toISOString(),
        strategy: 'last-write-wins',
      };
      const metrics: SyncMetrics = {
        strategy: 'last-write-wins',
        batchSize: 50,
        retryAttempts: 1,
        retryDelayMs: 1000,
        totalItems: 0,
        uniqueIds: 0,
        remoteFetched: 0,
        uploaded: 0,
        downloaded: 0,
        conflicts: 0,
        resolved: 0,
        errors: 0,
        durationMs: 0,
        startedAt: 0,
        finishedAt: 0,
        status: 'idle',
      };

      expect(strategy).toBeDefined();
      expect(options).toBeDefined();
      expect(config).toBeDefined();
      expect(result).toBeDefined();
      expect(item).toBeDefined();
      expect(status).toBeDefined();
      expect(auditType).toBeDefined();
      expect(auditEvent).toBeDefined();
      expect(metrics).toBeDefined();
    });

    it('handles metrics hook errors', async () => {
      const engine = createSyncEngine({
        onMetrics: () => {
          throw new Error('metrics boom');
        },
      });
      const result = await engine.sync([{ id: '1', data: 'x', version: 1, updatedAt: 1 }], {
        strategy: 'last-write-wins',
      });
      expect(result.errors.some((e) => e.includes('metrics boom'))).toBe(true);
    });

    it('cancels sync before remote fetch', async () => {
      const engine = createSyncEngine();
      const syncPromise = engine.sync([{ id: '1', data: 'x', version: 1, updatedAt: 1 }], {
        strategy: 'last-write-wins',
      });
      engine.cancel();
      const result = await syncPromise;
      expect(result.errors.some((e) => e.includes('cancelled'))).toBe(true);
    });

    it('calls onResolved when downloads exist', async () => {
      const onResolved = vi.fn();
      const engine = createSyncEngine({
        fetchRemote: async () => [{ id: '1', data: 'remote', version: 2, updatedAt: 2 }],
        onResolved,
      });
      const result = await engine.sync([{ id: '1', data: 'local', version: 1, updatedAt: 1 }], {
        strategy: 'server-wins',
      });
      expect(result.downloaded).toBe(1);
      expect(onResolved).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ data: 'remote' })])
      );
    });

    it('handles unexpected errors during sync', async () => {
      const engine = createSyncEngine({
        fetchRemote: async () => {
          throw new Error('network down');
        },
      });
      const result = await engine.sync([{ id: '1', data: 'x', version: 1, updatedAt: 1 }], {
        strategy: 'last-write-wins',
        retryAttempts: 0,
      });
      expect(result.errors.some((e) => e.includes('network down'))).toBe(true);
    }, 10000);

    it('resolves server-wins when no remote item exists', async () => {
      const engine = createSyncEngine();
      const result = await engine.sync(
        [
          { id: '1', data: 'a', version: 1, updatedAt: 2 },
          { id: '1', data: 'b', version: 1, updatedAt: 1 },
        ],
        { strategy: 'server-wins' }
      );
      expect(result.uploaded).toBe(1);
    });

    it('resolves append-only strategy', async () => {
      const engine = createSyncEngine();
      const result = await engine.sync(
        [
          { id: '1', data: 'a', version: 1, updatedAt: 1 },
          { id: '1', data: 'b', version: 1, updatedAt: 2 },
        ],
        { strategy: 'append-only' }
      );
      expect(result.uploaded).toBe(1);
    });

    it('handles chain-validated with no chain metadata', async () => {
      const engine = createSyncEngine();
      const result = await engine.sync(
        [
          { id: '1', data: { value: 1 }, version: 1, updatedAt: 1 },
          { id: '1', data: { value: 2 }, version: 2, updatedAt: 2 },
        ],
        { strategy: 'chain-validated' }
      );
      expect(result.conflicts).toBeGreaterThan(0);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('handles audit hook errors', async () => {
      const engine = createSyncEngine({
        onAudit: () => {
          throw new Error('audit boom');
        },
      });
      const result = await engine.sync([{ id: '1', data: 'x', version: 1, updatedAt: 1 }], {
        strategy: 'last-write-wins',
      });
      expect(result.errors.some((e) => e.includes('audit boom'))).toBe(true);
    });

    it('retries fetchRemote and succeeds on second attempt', async () => {
      let calls = 0;
      const engine = createSyncEngine({
        fetchRemote: async () => {
          calls += 1;
          if (calls === 1) {
            throw new Error('transient');
          }
          return [{ id: '1', data: 'remote', version: 2, updatedAt: 2 }];
        },
        retryAttempts: 1,
        retryDelayMs: 10,
      });
      const result = await engine.sync([{ id: '1', data: 'local', version: 1, updatedAt: 1 }], {
        strategy: 'server-wins',
      });
      expect(calls).toBe(2);
      expect(result.downloaded).toBe(1);
    }, 10000);

    it('returns unresolved for unknown strategy', async () => {
      const engine = createSyncEngine();
      const result = await engine.sync(
        [
          { id: '1', data: 'a', version: 1, updatedAt: 1 },
          { id: '1', data: 'b', version: 1, updatedAt: 2 },
        ],
        {
          strategy: 'unknown-strategy' as unknown as SyncOptions['strategy'],
        }
      );
      expect(result.conflicts).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('Unresolved'))).toBe(true);
    });
  });
});
