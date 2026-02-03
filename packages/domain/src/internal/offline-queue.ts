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

// ============================================================================
// TYPES
// ============================================================================

export type QueuedOperationType = 
  | 'registration'
  | 'trade'
  | 'compliance_check'
  | 'sync';

export type QueuedOperationStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'conflict';

export interface QueuedOperation<T = unknown> {
  /** Unique operation ID */
  id: string;
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
  lastAttemptAt?: number;
  /** Completed timestamp */
  completedAt?: number;
  /** Error from last attempt */
  lastError?: string;
  /** Priority (higher = more urgent) */
  priority: number;
  /** Dependencies (other operation IDs that must complete first) */
  dependsOn?: string[];
  /** Conflict resolution strategy */
  conflictStrategy: ConflictStrategy;
  /** Metadata for conflict resolution */
  metadata?: {
    entityId?: string;
    entityType?: string;
    version?: number;
    checksum?: string;
  };
}

export type ConflictStrategy = 
  | 'client_wins'    // Local changes override server
  | 'server_wins'    // Server changes override local
  | 'manual'         // Require user intervention
  | 'merge'          // Attempt automatic merge
  | 'last_write';    // Most recent timestamp wins

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
  private storage?: IOfflineQueueStorage;
  private processing = false;
  private onConflict?: (conflict: ConflictResolution) => Promise<unknown>;
  
  constructor(options?: {
    storage?: IOfflineQueueStorage;
    onConflict?: (conflict: ConflictResolution) => Promise<unknown>;
  }) {
    this.storage = options?.storage;
    this.onConflict = options?.onConflict;
  }
  
  /**
   * Initialize queue from storage
   */
  async initialize(): Promise<void> {
    if (!this.storage) return;
    
    const operations = await this.storage.load();
    for (const op of operations) {
      this.queue.set(op.id, op);
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
    const id = this.generateId();
    
    const operation: QueuedOperation<T> = {
      id,
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
      .filter(op => op.status === 'pending')
      .filter(op => this.areDependenciesMet(op))
      .sort((a, b) => {
        // Sort by priority (desc), then by created time (asc)
        if (b.priority !== a.priority) return b.priority - a.priority;
        return a.createdAt - b.createdAt;
      });
    
    return pending[0];
  }
  
  /**
   * Mark operation as processing
   */
  markProcessing(id: string): void {
    const op = this.queue.get(id);
    if (op) {
      op.status = 'processing';
      op.attempts++;
      op.lastAttemptAt = Date.now();
    }
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
  async markConflict<T>(
    id: string,
    serverData: T
  ): Promise<ConflictResolution<T> | undefined> {
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
          conflict.resolvedData = await this.onConflict(conflict) as T;
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
    return Array.from(this.queue.values())
      .filter(op => op.status === 'pending');
  }
  
  /**
   * Get all failed operations
   */
  getFailed(): QueuedOperation[] {
    return Array.from(this.queue.values())
      .filter(op => op.status === 'failed');
  }
  
  /**
   * Get all conflicts
   */
  getConflicts(): QueuedOperation[] {
    return Array.from(this.queue.values())
      .filter(op => op.status === 'conflict');
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
      pending: ops.filter(o => o.status === 'pending').length,
      processing: ops.filter(o => o.status === 'processing').length,
      completed: ops.filter(o => o.status === 'completed').length,
      failed: ops.filter(o => o.status === 'failed').length,
      conflicts: ops.filter(o => o.status === 'conflict').length,
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
    return `queue_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  private areDependenciesMet(op: QueuedOperation): boolean {
    if (!op.dependsOn || op.dependsOn.length === 0) return true;
    
    return op.dependsOn.every(depId => {
      const dep = this.queue.get(depId);
      return dep?.status === 'completed';
    });
  }
  
  private async persist(): Promise<void> {
    if (!this.storage) return;
    await this.storage.save(Array.from(this.queue.values()));
  }
  
  private resolveByTimestamp<T>(local: T, server: T): T {
    // If both have timestamps, use most recent
    const localTime = (local as any)?.updatedAt || (local as any)?.createdAt || 0;
    const serverTime = (server as any)?.updatedAt || (server as any)?.createdAt || 0;
    return localTime > serverTime ? local : server;
  }
  
  private attemptMerge<T>(local: T, server: T): T {
    // Simple shallow merge - override with local non-null values
    if (typeof local !== 'object' || typeof server !== 'object') {
      return local;
    }
    
    return {
      ...server,
      ...Object.fromEntries(
        Object.entries(local as object).filter(([_, v]) => v != null)
      ),
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
