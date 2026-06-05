/**
 * Offline Queue
 *
 * Queue for operations that can be executed when offline
 * and synced when connectivity is restored.
 *
 * Implements P8 (Offline-First) principle.
 *
 * @internal
 */

import crypto from 'crypto';

// ============================================================================
// ERRORS
// ============================================================================

export class DomainError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'DomainError';
  }
}

// ============================================================================
// TYPES
// ============================================================================

export type QueuedOperationType = 'registration' | 'trade' | 'compliance_check' | 'sync';

export type QueuedOperationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'conflict';

export interface QueuedOperation<T = unknown> {
  /** Unique operation ID */
  id: string;
  /** Monotonic logical sequence for replay ordering */
  sequence: number;
  /** Operation type */
  type: QueuedOperationType;
  /** Current status */
  status: QueuedOperationStatus;
  /** Operation payload */
  payload: T;
  /** Number of retry attempts */
  attempts: number;
  /** Maximum retry attempts */
  maxAttempts: number;
  /** Created timestamp */
  createdAt: number;
  /** Last attempt timestamp */
  lastAttemptAt?: number | undefined;
  /** Completed timestamp */
  completedAt?: number | undefined;
  /** Error from last attempt */
  lastError?: string | undefined;
  /** Priority (higher = more urgent) */
  priority: number;
  /** Dependencies (other operation IDs that must complete first) */
  dependsOn?: string[] | undefined;
  /** Conflict resolution strategy */
  conflictStrategy: ConflictStrategy;
  /** Metadata for conflict resolution */
  metadata?:
    | {
        entityId?: string | undefined;
        entityType?: string | undefined;
        version?: number | undefined;
        checksum?: string | undefined;
      }
    | undefined;
}

export type ConflictStrategy =
  | 'client_wins' // Local changes override server
  | 'server_wins' // Server changes override local
  | 'manual' // Require user intervention
  | 'merge' // Attempt automatic merge
  | 'last_write'; // Most recent timestamp wins

export interface ConflictResolution<T = unknown> {
  operationId: string;
  strategy: ConflictStrategy;
  localData: T;
  serverData: T;
  resolvedData?: T;
  resolvedBy: 'auto' | 'user';
  resolvedAt: number;
}

// ============================================================================
// OFFLINE QUEUE
// ============================================================================

export interface IOfflineQueueStorage {
  save(operations: QueuedOperation[]): Promise<void>;
  load(): Promise<QueuedOperation[]>;
  clear(): Promise<void>;
}

export class OfflineQueue {
  private queue: Map<string, QueuedOperation> = new Map();
  private storage?: IOfflineQueueStorage | undefined;
  private processing = false;
  private onConflict?: ((conflict: ConflictResolution) => Promise<unknown>) | undefined;
  private maxQueueSize: number;
  private nextSequence = 1;

  constructor(options?: {
    storage?: IOfflineQueueStorage;
    onConflict?: (conflict: ConflictResolution) => Promise<unknown>;
    maxQueueSize?: number;
  }) {
    this.storage = options?.storage;
    this.onConflict = options?.onConflict;
    this.maxQueueSize = options?.maxQueueSize ?? 10000;
  }

  /**
   * Initialize queue from storage
   */
  async initialize(): Promise<void> {
    if (!this.storage) return;

    const loadedOperations = await this.storage.load();
    const needsSequenceBackfill = loadedOperations.some(
      (operation) =>
        typeof operation.sequence !== 'number' ||
        !Number.isFinite(operation.sequence) ||
        operation.sequence <= 0
    );
    const operations = this.normalizeLoadedOperations(loadedOperations);
    for (const op of operations) {
      this.queue.set(op.id, op);
    }
    this.nextSequence =
      operations.reduce((max, operation) => Math.max(max, operation.sequence), 0) + 1;

    if (needsSequenceBackfill) {
      await this.persist();
    }
  }

  /**
   * Add operation to queue
   */
  async enqueue<T>(
    type: QueuedOperationType,
    payload: T,
    options?: {
      priority?: number;
      maxAttempts?: number;
      dependsOn?: string[];
      conflictStrategy?: ConflictStrategy;
      metadata?: QueuedOperation['metadata'];
    }
  ): Promise<string> {
    // Validate queue size
    if (this.queue.size >= this.maxQueueSize) {
      throw new DomainError(
        `Queue is full (max ${this.maxQueueSize} operations). Cannot enqueue new operation.`
      );
    }

    // Validate payload
    if (payload === null || payload === undefined) {
      throw new DomainError('Payload must not be null or undefined.');
    }
    try {
      JSON.stringify(payload);
    } catch {
      throw new DomainError('Payload must be JSON-serializable.');
    }

    const id = this.generateId();

    const operation: QueuedOperation<T> = {
      id,
      sequence: this.nextSequence++,
      type,
      status: 'pending',
      payload,
      attempts: 0,
      maxAttempts: options?.maxAttempts ?? 3,
      createdAt: Date.now(),
      priority: options?.priority ?? 0,
      dependsOn: options?.dependsOn,
      conflictStrategy: options?.conflictStrategy ?? 'last_write',
      metadata: options?.metadata,
    };

    this.queue.set(id, operation);
    await this.persist();

    return id;
  }

  /**
   * Get next operation to process
   */
  getNext(): QueuedOperation | undefined {
    const pending = Array.from(this.queue.values())
      .filter((op) => op.status === 'pending')
      .filter((op) => this.areDependenciesMet(op))
      .sort((a, b) => {
        // Sort by priority (desc), then by logical sequence (asc).
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.sequence - b.sequence;
      });

    return pending[0];
  }

  /**
   * Mark operation as processing.
   * Serialized via persistLock to prevent race conditions with concurrent callers.
   */
  async markProcessing(id: string): Promise<void> {
    this.persistLock = this.persistLock.then(() => {
      const op = this.queue.get(id);
      if (op) {
        op.status = 'processing';
        op.attempts++;
        op.lastAttemptAt = Date.now();
      }
    });
    await this.persistLock;
  }

  /**
   * Mark operation as completed
   */
  async markCompleted(id: string): Promise<void> {
    const op = this.queue.get(id);
    if (op) {
      op.status = 'completed';
      op.completedAt = Date.now();
      await this.persist();
    }
  }

  /**
   * Mark operation as failed
   */
  async markFailed(id: string, error: string): Promise<void> {
    const op = this.queue.get(id);
    if (!op) return;

    op.lastError = error;

    if (op.attempts >= op.maxAttempts) {
      op.status = 'failed';
    } else {
      op.status = 'pending'; // Will retry
    }

    await this.persist();
  }

  /**
   * Mark operation as having a conflict
   */
  async markConflict<T>(id: string, serverData: T): Promise<ConflictResolution<T> | undefined> {
    const op = this.queue.get(id) as QueuedOperation<T> | undefined;
    if (!op) return;

    op.status = 'conflict';

    const conflict: ConflictResolution<T> = {
      operationId: id,
      strategy: op.conflictStrategy,
      localData: op.payload,
      serverData,
      resolvedBy: 'auto',
      resolvedAt: Date.now(),
    };

    // Auto-resolve based on strategy
    switch (op.conflictStrategy) {
      case 'client_wins':
        conflict.resolvedData = op.payload;
        break;
      case 'server_wins':
        conflict.resolvedData = serverData;
        break;
      case 'last_write':
        conflict.resolvedData = this.resolveByTimestamp(op.payload, serverData);
        break;
      case 'merge':
        conflict.resolvedData = this.attemptMerge(op.payload, serverData);
        break;
      case 'manual':
        conflict.resolvedBy = 'user';
        if (this.onConflict) {
          conflict.resolvedData = (await this.onConflict(conflict)) as T;
        }
        break;
    }

    if (conflict.resolvedData) {
      op.payload = conflict.resolvedData;
      op.status = 'pending'; // Retry with resolved data
    }

    await this.persist();
    return conflict;
  }

  /**
   * Get all pending operations
   */
  getPending(): QueuedOperation[] {
    return Array.from(this.queue.values()).filter((op) => op.status === 'pending');
  }

  /**
   * Get all failed operations
   */
  getFailed(): QueuedOperation[] {
    return Array.from(this.queue.values()).filter((op) => op.status === 'failed');
  }

  /**
   * Get all conflicts
   */
  getConflicts(): QueuedOperation[] {
    return Array.from(this.queue.values()).filter((op) => op.status === 'conflict');
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    conflicts: number;
  } {
    const ops = Array.from(this.queue.values());
    return {
      total: ops.length,
      pending: ops.filter((o) => o.status === 'pending').length,
      processing: ops.filter((o) => o.status === 'processing').length,
      completed: ops.filter((o) => o.status === 'completed').length,
      failed: ops.filter((o) => o.status === 'failed').length,
      conflicts: ops.filter((o) => o.status === 'conflict').length,
    };
  }

  /**
   * Remove completed operations older than specified age
   */
  async pruneCompleted(maxAgeMs = 24 * 60 * 60 * 1000): Promise<number> {
    const cutoff = Date.now() - maxAgeMs;
    let pruned = 0;

    for (const [id, op] of this.queue.entries()) {
      if (op.status === 'completed' && op.completedAt && op.completedAt < cutoff) {
        this.queue.delete(id);
        pruned++;
      }
    }

    if (pruned > 0) {
      await this.persist();
    }

    return pruned;
  }

  /**
   * Clear all operations
   */
  async clear(): Promise<void> {
    this.queue.clear();
    if (this.storage) {
      await this.storage.clear();
    }
  }

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  private generateId(): string {
    return `queue_${crypto.randomUUID()}`;
  }

  private normalizeLoadedOperations(operations: QueuedOperation[]): QueuedOperation[] {
    let assignedSequence = 0;

    return operations.map((operation) => {
      const normalizedSequence =
        typeof operation.sequence === 'number' && Number.isFinite(operation.sequence)
          ? operation.sequence
          : ++assignedSequence;

      assignedSequence = Math.max(assignedSequence, normalizedSequence);

      return {
        ...operation,
        sequence: normalizedSequence,
      };
    });
  }

  private areDependenciesMet(op: QueuedOperation): boolean {
    if (!op.dependsOn || op.dependsOn.length === 0) return true;

    return op.dependsOn.every((depId) => {
      const dep = this.queue.get(depId);
      return dep?.status === 'completed';
    });
  }

  private persistLock: Promise<void> = Promise.resolve();

  private async persist(): Promise<void> {
    if (!this.storage) return;
    // Serialize persist calls to prevent race conditions
    this.persistLock = this.persistLock.then(() =>
      this.storage!.save(Array.from(this.queue.values()))
    );
    await this.persistLock;
  }

  private resolveByTimestamp<T>(local: T, server: T): T {
    // If both have timestamps, use most recent
    const localObj = local as Record<string, unknown>;
    const serverObj = server as Record<string, unknown>;
    const localTime = localObj?.['updatedAt'] || localObj?.['createdAt'] || 0;
    const serverTime = serverObj?.['updatedAt'] || serverObj?.['createdAt'] || 0;
    return localTime > serverTime ? local : server;
  }

  private attemptMerge<T>(local: T, server: T): T {
    // Simple shallow merge - override with local non-null values
    if (
      typeof local !== 'object' ||
      typeof server !== 'object' ||
      local === null ||
      server === null
    ) {
      return local;
    }

    const localEntries = Object.entries(local as object);
    const serverEntries = Object.entries(server as object);

    // Guard against merging excessively large objects
    const MAX_MERGE_KEYS = 1000;
    if (localEntries.length > MAX_MERGE_KEYS || serverEntries.length > MAX_MERGE_KEYS) {
      throw new DomainError(`Merge aborted: object has more than ${MAX_MERGE_KEYS} keys.`);
    }

    return {
      ...server,
      ...Object.fromEntries(localEntries.filter(([_, v]) => v != null)),
    } as T;
  }
}

// ============================================================================
// IN-MEMORY STORAGE (for testing)
// ============================================================================

export class InMemoryQueueStorage implements IOfflineQueueStorage {
  private data: QueuedOperation[] = [];

  async save(operations: QueuedOperation[]): Promise<void> {
    this.data = [...operations];
  }

  async load(): Promise<QueuedOperation[]> {
    return [...this.data];
  }

  async clear(): Promise<void> {
    this.data = [];
  }
}
