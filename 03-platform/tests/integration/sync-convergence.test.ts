import { createSyncEngine } from '@gtcx/sync';
import type { SyncItem } from '@gtcx/sync';
import { describe, it, expect } from 'vitest';

describe('sync convergence integration', () => {
  it('converges offline local changes with remote state', async () => {
    const runSync = async () => {
      const localStore = new Map<string, SyncItem>();
      const remoteStore = new Map<string, SyncItem>();

      localStore.set('A', { id: 'A', data: { v: 'local-new' }, version: 2, updatedAt: 5 });
      localStore.set('B', { id: 'B', data: { v: 'local-old' }, version: 1, updatedAt: 2 });
      localStore.set('C', { id: 'C', data: { v: 'local-v2' }, version: 2, updatedAt: 3 });

      remoteStore.set('A', { id: 'A', data: { v: 'remote-old' }, version: 1, updatedAt: 1 });
      remoteStore.set('B', { id: 'B', data: { v: 'remote-new' }, version: 2, updatedAt: 6 });

      const fetchRemote = async (ids: string[]) =>
        ids.map((id) => remoteStore.get(id)).filter(Boolean) as SyncItem[];

      const pushLocal = async (items: SyncItem[]) => {
        for (const item of items) {
          remoteStore.set(item.id, item);
        }
      };

      const onResolved = async (items: SyncItem[]) => {
        for (const item of items) {
          localStore.set(item.id, item);
        }
      };

      const engine = createSyncEngine({ fetchRemote, pushLocal, onResolved });
      const localItems: SyncItem[] = [
        { id: 'A', data: { v: 'local-new' }, version: 2, updatedAt: 5 },
        { id: 'B', data: { v: 'local-old' }, version: 1, updatedAt: 2 },
        { id: 'C', data: { v: 'local-v1' }, version: 1, updatedAt: 1 },
        { id: 'C', data: { v: 'local-v2' }, version: 2, updatedAt: 3 },
      ];

      const result = await engine.sync(localItems, { strategy: 'last-write-wins' });

      return { result, localStore, remoteStore };
    };

    const first = await runSync();
    const second = await runSync();

    expect(first.result.conflicts).toBeGreaterThanOrEqual(1);
    expect(first.result.errors).toEqual([]);

    const expectedA = { id: 'A', data: { v: 'local-new' }, version: 2, updatedAt: 5 };
    const expectedB = { id: 'B', data: { v: 'remote-new' }, version: 2, updatedAt: 6 };
    const expectedC = { id: 'C', data: { v: 'local-v2' }, version: 2, updatedAt: 3 };

    expect(first.remoteStore.get('A')).toEqual(expectedA);
    expect(first.remoteStore.get('B')).toEqual(expectedB);
    expect(first.remoteStore.get('C')).toEqual(expectedC);

    expect(first.localStore.get('A')).toEqual(expectedA);
    expect(first.localStore.get('B')).toEqual(expectedB);
    expect(first.localStore.get('C')).toEqual(expectedC);

    expect(second.remoteStore.get('A')).toEqual(expectedA);
    expect(second.remoteStore.get('B')).toEqual(expectedB);
    expect(second.remoteStore.get('C')).toEqual(expectedC);
  });
});
