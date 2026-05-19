import { describe, it, expect, vi } from 'vitest';

import { RequestBatcher } from '../src/batching.js';
import type { BatchResponse } from '../src/batching.js';

describe('RequestBatcher', () => {
  it('throws when flushFn returns response without matching id', async () => {
    const flushFn = vi.fn(async () => [{ id: 'wrong-id', result: 'ok' }] as BatchResponse[]);
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'standard',
      activeProfiles: [],
    });

    await expect(batcher.add({ payload: 'test' })).rejects.toThrow('No response for request');
    batcher.destroy();
  });

  it('passes through immediately for non-active profiles', async () => {
    const flushFn = vi.fn(async () => [{ id: 'req-1', result: 'ok' }] as BatchResponse[]);
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'standard',
      activeProfiles: ['edge'],
    });

    const response = await batcher.add({ id: 'req-1', payload: 'test' });
    expect(response.result).toBe('ok');
    expect(flushFn).toHaveBeenCalledWith([{ id: 'req-1', payload: 'test' }]);
    batcher.destroy();
  });

  it('queues requests for active profiles', async () => {
    const flushFn = vi.fn(async () => [{ id: 'req-1', result: 'ok' }] as BatchResponse[]);
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'edge',
      activeProfiles: ['edge'],
      maxBatchSize: 5,
    });

    const promise = batcher.add({ id: 'req-1', payload: 'test' });
    expect(flushFn).not.toHaveBeenCalled();

    await batcher.flush();
    const response = await promise;
    expect(response.result).toBe('ok');
    batcher.destroy();
  });

  it('auto-flushes when max batch size is reached', async () => {
    const flushFn = vi.fn(async (reqs) => reqs.map((r) => ({ id: r.id, result: 'ok' })));
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'edge',
      activeProfiles: ['edge'],
      maxBatchSize: 2,
    });

    const p1 = batcher.add({ payload: 'a' });
    const p2 = batcher.add({ payload: 'b' });

    // Should auto-flush when second request hits maxBatchSize
    const r1 = await p1;
    const r2 = await p2;
    expect(r1.result).toBe('ok');
    expect(r2.result).toBe('ok');
    batcher.destroy();
  });

  it('rejects pending requests when flushFn throws', async () => {
    const flushFn = vi.fn(async () => {
      throw new Error('network down');
    });
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'edge',
      activeProfiles: ['edge'],
    });

    const promise = batcher.add({ payload: 'test' });
    await batcher.flush();
    await expect(promise).rejects.toThrow('network down');
    batcher.destroy();
  });

  it('rejects unresolved requests after flush', async () => {
    const flushFn = vi.fn(async () => [] as BatchResponse[]);
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'edge',
      activeProfiles: ['edge'],
    });

    const promise = batcher.add({ id: 'req-1', payload: 'test' });
    await batcher.flush();
    await expect(promise).rejects.toThrow('Request req-1 was not resolved by flush');
    batcher.destroy();
  });

  it('destroys cleanly and rejects all pending', async () => {
    const flushFn = vi.fn(async () => [] as BatchResponse[]);
    const batcher = new RequestBatcher({
      flushFn,
      getProfile: () => 'edge',
      activeProfiles: ['edge'],
    });

    const p1 = batcher.add({ payload: 'a' });
    batcher.destroy();
    await expect(p1).rejects.toThrow('Batcher destroyed');
  });
});
