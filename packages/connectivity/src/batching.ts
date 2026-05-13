import type { ConnectivityProfile } from './types.js';

export interface BatchRequest {
  id: string;
  payload: unknown;
}

export interface BatchResponse {
  id: string;
  result: unknown;
}

export type BatchFlushFn = (requests: BatchRequest[]) => Promise<BatchResponse[]>;

export interface RequestBatcherOptions {
  flushFn: BatchFlushFn;
  getProfile: () => ConnectivityProfile;
  maxBatchSize?: number;
  flushIntervalMs?: number;
  activeProfiles?: ConnectivityProfile[];
}

interface PendingRequest {
  resolve: (value: BatchResponse) => void;
  reject: (reason?: unknown) => void;
}

/**
 * RequestBatcher queues requests and flushes them as a batch.
 *
 * For active low-bandwidth profiles (edge, ussd-only, satellite) requests
 * are queued and sent together. For standard and degraded profiles,
 * requests pass through immediately.
 */
export class RequestBatcher {
  private queue: BatchRequest[] = [];
  private pending = new Map<string, PendingRequest>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private readonly maxBatchSize: number;
  private readonly flushIntervalMs: number;
  private readonly activeProfiles: Set<ConnectivityProfile>;
  private readonly flushFn: BatchFlushFn;
  private readonly getProfile: () => ConnectivityProfile;

  constructor(options: RequestBatcherOptions) {
    this.flushFn = options.flushFn;
    this.getProfile = options.getProfile;
    this.maxBatchSize = options.maxBatchSize ?? 10;
    this.flushIntervalMs = options.flushIntervalMs ?? 5_000;
    this.activeProfiles = new Set(options.activeProfiles ?? ['edge', 'ussd-only', 'satellite']);
    this.startTimer();
  }

  private startTimer(): void {
    if (this.timer !== null) return;
    this.timer = setInterval(() => {
      void this.flush();
    }, this.flushIntervalMs);
  }

  /**
   * Add a request to the batcher.
   *
   * If the current profile is not active, the request is sent
   * immediately. Otherwise it is queued for the next flush.
   */
  add(request: Omit<BatchRequest, 'id'> & { id?: string }): Promise<BatchResponse> {
    const profile = this.getProfile();
    const id = request.id ?? this.generateId();
    const batchRequest: BatchRequest = { id, payload: request.payload };

    if (!this.activeProfiles.has(profile)) {
      // Pass through immediately for non-active profiles
      return this.flushFn([batchRequest]).then((responses) => {
        const response = responses.find((r) => r.id === id);
        if (!response) {
          throw new Error(`No response for request ${id}`);
        }
        return response;
      });
    }

    return new Promise<BatchResponse>((resolve, reject) => {
      this.queue.push(batchRequest);
      this.pending.set(id, { resolve, reject });

      if (this.queue.length >= this.maxBatchSize) {
        void this.flush();
      }
    });
  }

  /** Flush all queued requests now. */
  async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.queue.length);
    const pendingIds = new Set(batch.map((r) => r.id));

    try {
      const responses = await this.flushFn(batch);
      for (const response of responses) {
        const deferred = this.pending.get(response.id);
        if (deferred) {
          deferred.resolve(response);
          this.pending.delete(response.id);
        }
      }
    } catch (error) {
      for (const id of pendingIds) {
        const deferred = this.pending.get(id);
        if (deferred) {
          deferred.reject(error);
          this.pending.delete(id);
        }
      }
    }

    // Reject any pending requests that were not resolved by the flush
    for (const id of pendingIds) {
      if (this.pending.has(id)) {
        const deferred = this.pending.get(id)!;
        deferred.reject(new Error(`Request ${id} was not resolved by flush`));
        this.pending.delete(id);
      }
    }
  }

  /** Stop the auto-flush timer and reject all pending requests. */
  destroy(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    for (const [, deferred] of this.pending) {
      deferred.reject(new Error('Batcher destroyed'));
    }
    this.pending.clear();
    this.queue = [];
  }

  private generateId(): string {
    return `req-${Date.now()}-${crypto.randomUUID()}`;
  }
}
