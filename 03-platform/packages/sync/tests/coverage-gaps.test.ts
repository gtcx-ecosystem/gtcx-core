import { describe, it, expect, vi } from 'vitest';

import { createSyncEngine, resolveConflict } from '../src/index';
import type { SyncItem } from '../src/types';

describe('coverage gaps', () => {
  describe('resolveConflict edge cases', () => {
    it('returns resolved with no winner when candidates array is empty', () => {
      const result = resolveConflict('last-write-wins', []);
      expect(result).toEqual({ resolved: true });
    });

    it('server-wins tie-breaks on equal updatedAt (keeps best)', () => {
      const items: SyncItem[] = [
        { id: '1', data: 'a', version: 1, updatedAt: 5 },
        { id: '1', data: 'b', version: 2, updatedAt: 5 },
      ];
      const result = resolveConflict('server-wins', items);
      expect(result.resolved).toBe(true);
      expect(result.winner!.data).toBe('a');
    });

    it('append-only tie-breaks on equal updatedAt (keeps best)', () => {
      const items: SyncItem[] = [
        { id: '1', data: 'a', version: 1, updatedAt: 5 },
        { id: '1', data: 'b', version: 2, updatedAt: 5 },
      ];
      const result = resolveConflict('append-only', items);
      expect(result.resolved).toBe(true);
      expect(result.winner!.data).toBe('a');
    });

    it('chain-validated tie-breaks on equal version (keeps best)', () => {
      const items: SyncItem[] = [
        { id: '1', data: { previousHash: 'abc' }, version: 2, updatedAt: 1 },
        { id: '1', data: { previousHash: 'def' }, version: 2, updatedAt: 2 },
      ];
      const result = resolveConflict('chain-validated', items);
      expect(result.resolved).toBe(true);
      expect(result.winner!.data).toEqual({ previousHash: 'abc' });
    });

    it('chain-validated filters out null data', () => {
      const items: SyncItem[] = [
        { id: '1', data: null, version: 1, updatedAt: 1 },
        { id: '1', data: null, version: 2, updatedAt: 2 },
      ];
      const result = resolveConflict('chain-validated', items);
      expect(result).toEqual({ resolved: false });
    });

    it('chain-validated filters out non-object data', () => {
      const items: SyncItem[] = [
        { id: '1', data: 'string', version: 1, updatedAt: 1 },
        { id: '1', data: 42, version: 2, updatedAt: 2 },
      ];
      const result = resolveConflict('chain-validated', items);
      expect(result).toEqual({ resolved: false });
    });
  });

  describe('createSyncEngine edge cases', () => {
    it('cancel does not change status when not syncing', async () => {
      const engine = createSyncEngine();
      const syncPromise = engine.sync([{ id: '1', data: 'x', version: 1, updatedAt: 1 }], {
        strategy: 'last-write-wins',
      });
      engine.cancel(); // status -> 'cancelled'
      engine.cancel(); // status is already 'cancelled', not 'syncing'
      const result = await syncPromise;
      expect(result.errors.some((e) => e.includes('cancelled'))).toBe(true);
      expect(engine.getStatus()).toBe('cancelled');
    });

    it('falls back to default message when audit error has empty message', async () => {
      const engine = createSyncEngine({
        onAudit: () => {
          throw { message: '' };
        },
      });
      const result = await engine.sync([{ id: '1', data: 'x', version: 1, updatedAt: 1 }], {
        strategy: 'last-write-wins',
      });
      expect(result.errors.some((e) => e.includes('Audit hook failed'))).toBe(true);
    });

    it('falls back to default message when metrics error has empty message', async () => {
      const engine = createSyncEngine({
        onMetrics: () => {
          throw { message: '' };
        },
      });
      const result = await engine.sync([{ id: '1', data: 'x', version: 1, updatedAt: 1 }], {
        strategy: 'last-write-wins',
      });
      expect(result.errors.some((e) => e.includes('Metrics hook failed'))).toBe(true);
    });

    it('does not record error when unresolved strategy has no conflict', async () => {
      const engine = createSyncEngine();
      const result = await engine.sync([{ id: '1', data: 'a', version: 1, updatedAt: 1 }], {
        strategy: 'unknown-strategy' as unknown as Parameters<typeof engine.sync>[1]['strategy'],
      });
      expect(result.conflicts).toBe(0);
      expect(result.errors).toEqual([]);
      expect(result.uploaded).toBe(0);
      expect(result.downloaded).toBe(0);
    });

    it('does not call onResolved when there are no downloads', async () => {
      const onResolved = vi.fn();
      const engine = createSyncEngine({
        pushLocal: async () => {},
        onResolved,
      });
      const result = await engine.sync([{ id: '1', data: 'local', version: 2, updatedAt: 2 }], {
        strategy: 'last-write-wins',
      });
      expect(result.uploaded).toBe(1);
      expect(result.downloaded).toBe(0);
      expect(onResolved).not.toHaveBeenCalled();
    });

    it('does not call pushLocal when there are no uploads', async () => {
      const pushLocal = vi.fn(async () => {});
      const engine = createSyncEngine({
        fetchRemote: async () => [{ id: '1', data: 'remote', version: 2, updatedAt: 2 }],
        pushLocal,
      });
      const result = await engine.sync([{ id: '1', data: 'local', version: 1, updatedAt: 1 }], {
        strategy: 'server-wins',
      });
      expect(result.downloaded).toBe(1);
      expect(result.uploaded).toBe(0);
      expect(pushLocal).not.toHaveBeenCalled();
    });

    it('does not download when remote exists but local wins', async () => {
      const fetchRemote = vi.fn(async () => [
        { id: '1', data: 'remote', version: 1, updatedAt: 1 },
      ]);
      const pushLocal = vi.fn(async () => {});
      const engine = createSyncEngine({ fetchRemote, pushLocal });
      const result = await engine.sync([{ id: '1', data: 'local', version: 2, updatedAt: 2 }], {
        strategy: 'last-write-wins',
      });
      expect(result.uploaded).toBe(1);
      expect(result.downloaded).toBe(0);
    });

    it('falls back to default message when sync error has empty message', async () => {
      const engine = createSyncEngine({
        fetchRemote: async () => {
          throw { message: '' };
        },
      });
      const result = await engine.sync([{ id: '1', data: 'x', version: 1, updatedAt: 1 }], {
        strategy: 'last-write-wins',
        retryAttempts: 0,
      });
      expect(result.errors.some((e) => e.includes('Sync failed'))).toBe(true);
    });
  });
});
