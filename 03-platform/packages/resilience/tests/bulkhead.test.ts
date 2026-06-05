import { describe, it, expect } from 'vitest';

import { createBulkhead, BulkheadRejectedError } from '../src/bulkhead';

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('createBulkhead', () => {
  it('starts empty', () => {
    const bh = createBulkhead();
    expect(bh.activeCount).toBe(0);
    expect(bh.queueCount).toBe(0);
  });

  it('executes calls concurrently up to maxConcurrent', async () => {
    const bh = createBulkhead({ maxConcurrent: 2 });
    let active = 0;
    let maxActive = 0;

    const task = async () => {
      active++;
      maxActive = Math.max(maxActive, active);
      await wait(50);
      active--;
      return 'done';
    };

    const results = await Promise.all([bh.execute(task), bh.execute(task), bh.execute(task)]);
    expect(results).toEqual(['done', 'done', 'done']);
    expect(maxActive).toBe(2);
  });

  it('queues calls when maxConcurrent is reached', async () => {
    const bh = createBulkhead({ maxConcurrent: 1, maxQueue: 10 });
    const order: number[] = [];

    const p1 = bh.execute(async () => {
      order.push(1);
      await wait(30);
      order.push(4);
      return 'a';
    });
    const p2 = bh.execute(async () => {
      order.push(2);
      await wait(10);
      order.push(5);
      return 'b';
    });
    const p3 = bh.execute(async () => {
      order.push(3);
      await wait(5);
      order.push(6);
      return 'c';
    });

    const results = await Promise.all([p1, p2, p3]);
    expect(results).toEqual(['a', 'b', 'c']);
    // First task starts immediately, others queue
    expect(order[0]).toBe(1);
    // Queued tasks run after first completes
    expect(order.indexOf(2)).toBeGreaterThan(order.indexOf(4));
  });

  it('rejects when queue is full', async () => {
    const bh = createBulkhead({ maxConcurrent: 1, maxQueue: 1 });

    // One active, one queued
    const p1 = bh.execute(() => wait(100));
    const p2 = bh.execute(() => wait(100));

    // Third should be rejected
    await expect(bh.execute(() => wait(100))).rejects.toBeInstanceOf(BulkheadRejectedError);

    // Clean up
    await Promise.all([p1, p2]);
  });

  it('reports correct counts during execution', async () => {
    const bh = createBulkhead({ maxConcurrent: 1, maxQueue: 2 });

    expect(bh.activeCount).toBe(0);
    expect(bh.queueCount).toBe(0);

    const p1 = bh.execute(() => wait(50));
    expect(bh.activeCount).toBe(1);

    const p2 = bh.execute(() => wait(50));
    expect(bh.activeCount).toBe(1);
    expect(bh.queueCount).toBe(1);

    const p3 = bh.execute(() => wait(50));
    expect(bh.queueCount).toBe(2);

    await Promise.all([p1, p2, p3]);
    expect(bh.activeCount).toBe(0);
    expect(bh.queueCount).toBe(0);
  });

  it('recovers after rejection', async () => {
    const bh = createBulkhead({ maxConcurrent: 1, maxQueue: 0 });

    // Block the single slot
    const p1 = bh.execute(() => wait(50));

    // Rejected
    await expect(bh.execute(() => wait(10))).rejects.toBeInstanceOf(BulkheadRejectedError);

    // After first completes, should succeed
    await p1;
    const result = await bh.execute(() => Promise.resolve('ok'));
    expect(result).toBe('ok');
  });

  it('propagates task errors without breaking bulkhead', async () => {
    const bh = createBulkhead({ maxConcurrent: 1 });

    await expect(bh.execute(() => Promise.reject(new Error('task fail')))).rejects.toThrow(
      'task fail'
    );

    // Bulkhead should still accept new tasks
    const result = await bh.execute(() => Promise.resolve('ok'));
    expect(result).toBe('ok');
  });

  it('uses default config values', async () => {
    const bh = createBulkhead();
    expect(bh.maxConcurrent).toBe(10);
    expect(bh.maxQueue).toBe(100);
  });
});
