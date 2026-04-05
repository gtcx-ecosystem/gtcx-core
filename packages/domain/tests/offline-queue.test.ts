import { describe, it, expect, vi, beforeEach } from 'vitest';

import { OfflineQueue, InMemoryQueueStorage } from '../src/internal/offline-queue';
import type { QueuedOperation } from '../src/internal/offline-queue';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createQueue(opts?: ConstructorParameters<typeof OfflineQueue>[0]) {
  return new OfflineQueue(opts);
}

// ---------------------------------------------------------------------------
// OfflineQueue
// ---------------------------------------------------------------------------

describe('OfflineQueue', () => {
  let queue: OfflineQueue;

  beforeEach(() => {
    queue = createQueue();
  });

  // -- enqueue --
  describe('enqueue', () => {
    it('adds an operation and returns an id', async () => {
      const id = await queue.enqueue('registration', { data: 'test' });
      expect(id).toMatch(/^queue_/);
    });

    it('creates operation with correct defaults', async () => {
      await queue.enqueue('trade', { amount: 100 });
      const stats = queue.getStats();
      expect(stats.total).toBe(1);
      expect(stats.pending).toBe(1);
    });

    it('respects custom options', async () => {
      await queue.enqueue(
        'registration',
        { x: 1 },
        {
          priority: 10,
          maxAttempts: 5,
          conflictStrategy: 'client_wins',
          metadata: { entityId: 'e1', entityType: 'asset_lot' },
        }
      );
      const next = queue.getNext();
      expect(next).toBeDefined();
      expect(next!.priority).toBe(10);
      expect(next!.maxAttempts).toBe(5);
      expect(next!.conflictStrategy).toBe('client_wins');
      expect(next!.metadata!.entityId).toBe('e1');
    });

    it('throws when queue is full', async () => {
      const small = createQueue({ maxQueueSize: 2 });
      await small.enqueue('registration', { a: 1 });
      await small.enqueue('registration', { b: 2 });
      await expect(small.enqueue('registration', { c: 3 })).rejects.toThrow('Queue is full');
    });

    it('throws when payload is null', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(queue.enqueue('registration', null as any)).rejects.toThrow(
        'Payload must not be null or undefined'
      );
    });

    it('throws when payload is undefined', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(queue.enqueue('registration', undefined as any)).rejects.toThrow(
        'Payload must not be null or undefined'
      );
    });

    it('throws when payload is not JSON-serializable', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const circular: any = {};
      circular.self = circular;
      await expect(queue.enqueue('registration', circular)).rejects.toThrow(
        'Payload must be JSON-serializable'
      );
    });
  });

  // -- getNext --
  describe('getNext', () => {
    it('returns undefined when queue is empty', () => {
      expect(queue.getNext()).toBeUndefined();
    });

    it('returns highest priority operation first', async () => {
      await queue.enqueue('registration', { a: 1 }, { priority: 1 });
      await queue.enqueue('trade', { b: 2 }, { priority: 10 });
      await queue.enqueue('sync', { c: 3 }, { priority: 5 });

      const next = queue.getNext();
      expect(next!.type).toBe('trade');
      expect(next!.priority).toBe(10);
    });

    it('returns oldest operation when priorities are equal', async () => {
      const id1 = await queue.enqueue('registration', { a: 1 }, { priority: 0 });
      await queue.enqueue('trade', { b: 2 }, { priority: 0 });

      const next = queue.getNext();
      expect(next!.id).toBe(id1);
    });

    it('skips operations with unmet dependencies', async () => {
      const depId = await queue.enqueue('registration', { a: 1 });
      const id2 = await queue.enqueue('trade', { b: 2 }, { dependsOn: [depId], priority: 100 });
      await queue.enqueue('sync', { c: 3 }, { priority: 0 });

      // depId is pending, so id2's dependency is not met
      const next = queue.getNext();
      // Should get either depId or id3, not id2
      expect(next!.id).not.toBe(id2);
    });

    it('returns dependent operation after dependency completes', async () => {
      const depId = await queue.enqueue('registration', { a: 1 });
      const id2 = await queue.enqueue('trade', { b: 2 }, { dependsOn: [depId], priority: 100 });

      // Complete the dependency
      await queue.markProcessing(depId);
      await queue.markCompleted(depId);

      const next = queue.getNext();
      expect(next!.id).toBe(id2);
    });
  });

  // -- markProcessing --
  describe('markProcessing', () => {
    it('updates status and increments attempts', async () => {
      const id = await queue.enqueue('registration', { x: 1 });
      await queue.markProcessing(id);

      const pending = queue.getPending();
      expect(pending).toHaveLength(0);

      const stats = queue.getStats();
      expect(stats.processing).toBe(1);
    });

    it('does nothing for unknown id', async () => {
      await queue.markProcessing('nonexistent');
      expect(queue.getStats().processing).toBe(0);
    });
  });

  // -- markCompleted --
  describe('markCompleted', () => {
    it('marks operation as completed', async () => {
      const id = await queue.enqueue('registration', { x: 1 });
      await queue.markProcessing(id);
      await queue.markCompleted(id);

      const stats = queue.getStats();
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(0);
    });

    it('does nothing for unknown id', async () => {
      await queue.markCompleted('nonexistent');
    });
  });

  // -- markFailed --
  describe('markFailed', () => {
    it('retries when attempts < maxAttempts', async () => {
      const id = await queue.enqueue('registration', { x: 1 }, { maxAttempts: 3 });
      await queue.markProcessing(id);
      await queue.markFailed(id, 'network error');

      // Should be back to pending for retry
      expect(queue.getPending()).toHaveLength(1);
      const stats = queue.getStats();
      expect(stats.failed).toBe(0);
    });

    it('marks as failed when maxAttempts exceeded', async () => {
      const id = await queue.enqueue('registration', { x: 1 }, { maxAttempts: 1 });
      await queue.markProcessing(id); // attempts becomes 1
      await queue.markFailed(id, 'error');

      expect(queue.getFailed()).toHaveLength(1);
      expect(queue.getPending()).toHaveLength(0);
    });

    it('records last error', async () => {
      const id = await queue.enqueue('registration', { x: 1 }, { maxAttempts: 2 });
      await queue.markProcessing(id);
      await queue.markFailed(id, 'first error');

      const pending = queue.getPending();
      expect(pending[0]!.lastError).toBe('first error');
    });

    it('does nothing for unknown id', async () => {
      await queue.markFailed('nonexistent', 'err');
    });
  });

  // -- markConflict --
  describe('markConflict', () => {
    it('resolves with client_wins strategy', async () => {
      const id = await queue.enqueue(
        'registration',
        { name: 'local' },
        {
          conflictStrategy: 'client_wins',
        }
      );
      await queue.markProcessing(id);

      const resolution = await queue.markConflict(id, { name: 'server' });

      expect(resolution).toBeDefined();
      expect(resolution!.resolvedData).toEqual({ name: 'local' });
      expect(resolution!.resolvedBy).toBe('auto');
      // operation should be back to pending
      expect(queue.getPending()).toHaveLength(1);
    });

    it('resolves with server_wins strategy', async () => {
      const id = await queue.enqueue(
        'registration',
        { name: 'local' },
        {
          conflictStrategy: 'server_wins',
        }
      );
      await queue.markProcessing(id);

      const resolution = await queue.markConflict(id, { name: 'server' });
      expect(resolution!.resolvedData).toEqual({ name: 'server' });
    });

    it('resolves with last_write strategy using updatedAt', async () => {
      const id = await queue.enqueue(
        'registration',
        { name: 'local', updatedAt: 2000 },
        { conflictStrategy: 'last_write' }
      );
      await queue.markProcessing(id);

      const resolution = await queue.markConflict(id, {
        name: 'server',
        updatedAt: 1000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((resolution!.resolvedData as any).name).toBe('local');
    });

    it('last_write prefers server when server is newer', async () => {
      const id = await queue.enqueue(
        'registration',
        { name: 'local', updatedAt: 1000 },
        { conflictStrategy: 'last_write' }
      );
      await queue.markProcessing(id);

      const resolution = await queue.markConflict(id, {
        name: 'server',
        updatedAt: 2000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((resolution!.resolvedData as any).name).toBe('server');
    });

    it('resolves with merge strategy (shallow)', async () => {
      const id = await queue.enqueue(
        'registration',
        { name: 'local', extra: 'local_extra' },
        { conflictStrategy: 'merge' }
      );
      await queue.markProcessing(id);

      const resolution = await queue.markConflict(id, {
        name: 'server',
        serverField: 'server_val',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resolved = resolution!.resolvedData as any;
      expect(resolved.name).toBe('local');
      expect(resolved.extra).toBe('local_extra');
      expect(resolved.serverField).toBe('server_val');
    });

    it('merge returns local for non-object types', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const id = await queue.enqueue('registration', 'local_string' as any, {
        conflictStrategy: 'merge',
      });
      await queue.markProcessing(id);

      const resolution = await queue.markConflict(id, 'server_string');
      expect(resolution!.resolvedData).toBe('local_string');
    });

    it('resolves with manual strategy using onConflict callback', async () => {
      const onConflict = vi.fn().mockResolvedValue({ name: 'user_choice' });
      const q = createQueue({ onConflict });

      const id = await q.enqueue(
        'registration',
        { name: 'local' },
        {
          conflictStrategy: 'manual',
        }
      );
      await q.markProcessing(id);

      const resolution = await q.markConflict(id, { name: 'server' });
      expect(resolution!.resolvedBy).toBe('user');
      expect(resolution!.resolvedData).toEqual({ name: 'user_choice' });
      expect(onConflict).toHaveBeenCalledTimes(1);
    });

    it('manual strategy without onConflict leaves conflict unresolved', async () => {
      const q = createQueue(); // no onConflict

      const id = await q.enqueue(
        'registration',
        { name: 'local' },
        {
          conflictStrategy: 'manual',
        }
      );
      await q.markProcessing(id);

      const resolution = await q.markConflict(id, { name: 'server' });
      expect(resolution!.resolvedData).toBeUndefined();
      // operation stays in conflict since no resolved data
      expect(q.getConflicts()).toHaveLength(1);
    });

    it('returns undefined for unknown id', async () => {
      const result = await queue.markConflict('nonexistent', {});
      expect(result).toBeUndefined();
    });
  });

  // -- getPending, getFailed, getConflicts --
  describe('status queries', () => {
    it('getPending returns pending operations', async () => {
      await queue.enqueue('registration', { a: 1 });
      await queue.enqueue('trade', { b: 2 });
      expect(queue.getPending()).toHaveLength(2);
    });

    it('getFailed returns failed operations', async () => {
      const id = await queue.enqueue('registration', { a: 1 }, { maxAttempts: 1 });
      await queue.markProcessing(id);
      await queue.markFailed(id, 'err');
      expect(queue.getFailed()).toHaveLength(1);
    });

    it('getConflicts returns operations in conflict', async () => {
      const id = await queue.enqueue('registration', { a: 1 }, { conflictStrategy: 'manual' });
      await queue.markProcessing(id);
      await queue.markConflict(id, { a: 2 });
      expect(queue.getConflicts()).toHaveLength(1);
    });
  });

  // -- getStats --
  describe('getStats', () => {
    it('returns accurate counts', async () => {
      const id1 = await queue.enqueue('registration', { a: 1 });
      await queue.enqueue('trade', { b: 2 });
      const id3 = await queue.enqueue('sync', { c: 3 }, { maxAttempts: 1 });

      await queue.markProcessing(id1);
      await queue.markCompleted(id1);

      await queue.markProcessing(id3);
      await queue.markFailed(id3, 'err');

      const stats = queue.getStats();
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(1);
      expect(stats.failed).toBe(1);
    });
  });

  // -- pruneCompleted --
  describe('pruneCompleted', () => {
    it('removes completed operations older than maxAge', async () => {
      vi.useFakeTimers();
      const q = createQueue();
      const id = await q.enqueue('registration', { a: 1 });
      await q.markProcessing(id);
      await q.markCompleted(id);

      // Advance time so the completed operation is older than maxAge
      vi.advanceTimersByTime(100);

      const pruned = await q.pruneCompleted(50);
      expect(pruned).toBe(1);
      expect(q.getStats().total).toBe(0);
      vi.useRealTimers();
    });

    it('does not remove recent completed operations', async () => {
      const id = await queue.enqueue('registration', { a: 1 });
      await queue.markProcessing(id);
      await queue.markCompleted(id);

      // Prune with 1 hour age - should not remove
      const pruned = await queue.pruneCompleted(60 * 60 * 1000);
      expect(pruned).toBe(0);
      expect(queue.getStats().total).toBe(1);
    });

    it('does not remove pending operations', async () => {
      await queue.enqueue('registration', { a: 1 });
      const pruned = await queue.pruneCompleted(0);
      expect(pruned).toBe(0);
    });
  });

  // -- clear --
  describe('clear', () => {
    it('removes all operations', async () => {
      await queue.enqueue('registration', { a: 1 });
      await queue.enqueue('trade', { b: 2 });
      await queue.clear();
      expect(queue.getStats().total).toBe(0);
    });

    it('clears storage if provided', async () => {
      const storage = new InMemoryQueueStorage();
      const q = createQueue({ storage });
      await q.enqueue('registration', { a: 1 });
      await q.clear();

      const loaded = await storage.load();
      expect(loaded).toHaveLength(0);
    });
  });

  // -- initialize --
  describe('initialize', () => {
    it('loads operations from storage', async () => {
      const storage = new InMemoryQueueStorage();
      const q1 = createQueue({ storage });
      await q1.enqueue('registration', { a: 1 });
      await q1.enqueue('trade', { b: 2 });

      const q2 = createQueue({ storage });
      await q2.initialize();
      expect(q2.getStats().total).toBe(2);
    });

    it('does nothing without storage', async () => {
      const q = createQueue();
      await q.initialize(); // should not throw
    });
  });

  // -- storage persistence --
  describe('storage persistence', () => {
    it('persists on enqueue', async () => {
      const storage = new InMemoryQueueStorage();
      const q = createQueue({ storage });
      await q.enqueue('registration', { a: 1 });

      const loaded = await storage.load();
      expect(loaded).toHaveLength(1);
    });

    it('persists on markCompleted', async () => {
      const storage = new InMemoryQueueStorage();
      const q = createQueue({ storage });
      const id = await q.enqueue('registration', { a: 1 });
      await q.markProcessing(id);
      await q.markCompleted(id);

      const loaded = await storage.load();
      expect(loaded[0]!.status).toBe('completed');
    });
  });
});

// ---------------------------------------------------------------------------
// InMemoryQueueStorage
// ---------------------------------------------------------------------------

describe('InMemoryQueueStorage', () => {
  it('save and load round-trip', async () => {
    const storage = new InMemoryQueueStorage();
    const ops: QueuedOperation[] = [
      {
        id: 'q1',
        type: 'registration',
        status: 'pending',
        payload: { x: 1 },
        attempts: 0,
        maxAttempts: 3,
        createdAt: Date.now(),
        priority: 0,
        conflictStrategy: 'last_write',
      },
    ];

    await storage.save(ops);
    const loaded = await storage.load();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]!.id).toBe('q1');
  });

  it('clear empties storage', async () => {
    const storage = new InMemoryQueueStorage();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await storage.save([{ id: 'q1' } as any]);
    await storage.clear();
    const loaded = await storage.load();
    expect(loaded).toHaveLength(0);
  });

  it('load returns copy, not reference', async () => {
    const storage = new InMemoryQueueStorage();
    const ops: QueuedOperation[] = [
      {
        id: 'q1',
        type: 'registration',
        status: 'pending',
        payload: {},
        attempts: 0,
        maxAttempts: 3,
        createdAt: Date.now(),
        priority: 0,
        conflictStrategy: 'last_write',
      },
    ];
    await storage.save(ops);
    const loaded1 = await storage.load();
    const loaded2 = await storage.load();
    expect(loaded1).not.toBe(loaded2);
  });
});
