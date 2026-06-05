/**
 * Bulkhead (Concurrency Limiter) — restricts the number of concurrent
 * operations to prevent resource exhaustion and cascade overload.
 *
 * When maxConcurrent is reached, additional calls are queued up to maxQueue.
 * If the queue is also full, calls are rejected immediately.
 */

export interface BulkheadConfig {
  /** Maximum number of concurrent executions (default: 10) */
  maxConcurrent?: number;
  /** Maximum number of queued executions (default: 100) */
  maxQueue?: number;
}

export interface Bulkhead {
  readonly maxConcurrent: number;
  readonly maxQueue: number;
  readonly activeCount: number;
  readonly queueCount: number;
  execute<T>(fn: () => Promise<T>): Promise<T>;
}

export class BulkheadRejectedError extends Error {
  readonly maxConcurrent: number;
  readonly maxQueue: number;
  readonly activeCount: number;
  readonly queueCount: number;

  constructor(
    message: string,
    maxConcurrent: number,
    maxQueue: number,
    activeCount: number,
    queueCount: number
  ) {
    super(message);
    this.name = 'BulkheadRejectedError';
    this.maxConcurrent = maxConcurrent;
    this.maxQueue = maxQueue;
    this.activeCount = activeCount;
    this.queueCount = queueCount;
  }
}

interface QueuedTask<T> {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

export function createBulkhead(config: BulkheadConfig = {}): Bulkhead {
  const maxConcurrent = config.maxConcurrent ?? 10;
  const maxQueue = config.maxQueue ?? 100;

  let activeCount = 0;
  const queue: Array<QueuedTask<unknown>> = [];

  function dequeue(): void {
    if (activeCount >= maxConcurrent) return;
    const next = queue.shift();
    if (!next) return;

    activeCount++;
    next
      .fn()
      .then(next.resolve, next.reject)
      .finally(() => {
        activeCount--;
        dequeue();
      });
  }

  async function execute<T>(fn: () => Promise<T>): Promise<T> {
    if (activeCount < maxConcurrent) {
      activeCount++;
      try {
        return await fn();
      } finally {
        activeCount--;
        dequeue();
      }
    }

    if (queue.length >= maxQueue) {
      throw new BulkheadRejectedError(
        `Bulkhead capacity exceeded (${maxConcurrent} active, ${maxQueue} queue)`,
        maxConcurrent,
        maxQueue,
        activeCount,
        queue.length
      );
    }

    return new Promise<T>((resolve, reject) => {
      queue.push({ fn, resolve, reject } as QueuedTask<unknown>);
      // Try to dequeue in case a slot just freed
      dequeue();
    });
  }

  return {
    maxConcurrent,
    maxQueue,
    get activeCount() {
      return activeCount;
    },
    get queueCount() {
      return queue.length;
    },
    execute,
  };
}
