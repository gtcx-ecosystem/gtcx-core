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

    it('should report unresolved conflicts for append-only', async () => {
      const engine = createSyncEngine();
      const items: SyncItem[] = [
        { id: '1', data: { value: 1 }, version: 1, updatedAt: 1 },
        { id: '1', data: { value: 2 }, version: 2, updatedAt: 2 },
      ];
      const result = await engine.sync(items, { strategy: 'append-only' });
      expect(result.conflicts).toBe(1);
      expect(result.resolved).toBe(0);
      expect(result.errors.length).toBe(1);
    });

    it('should allow custom conflict resolution callbacks', async () => {
      const onConflict = vi.fn();
      const resolveConflict = vi.fn(async ({ local }: { local: SyncItem[] }) => local[1] ?? null);
      const engine = createSyncEngine({ onConflict, resolveConflict });
      const items: SyncItem[] = [
        { id: '1', data: { value: 1 }, version: 1, updatedAt: 1 },
        { id: '1', data: { value: 2 }, version: 2, updatedAt: 2 },
      ];

      const result = await engine.sync(items, { strategy: 'append-only' });
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
  });
});
