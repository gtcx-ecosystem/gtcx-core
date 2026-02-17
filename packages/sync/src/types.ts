export type ConflictStrategy =
  | 'last-write-wins'
  | 'server-wins'
  | 'highest-version'
  | 'append-only'
  | 'chain-validated';

export interface SyncOptions {
  strategy: ConflictStrategy;
  batchSize?: number; // default 50
  retryAttempts?: number; // default 3
  retryDelayMs?: number; // default 1000
}

export interface SyncResult {
  uploaded: number;
  downloaded: number;
  conflicts: number;
  resolved: number;
  errors: string[];
  durationMs: number;
}

export interface SyncItem<T = unknown> {
  id: string;
  data: T;
  version: number;
  updatedAt: number;
  syncedAt?: number;
}

export interface ISyncEngine {
  sync(items: SyncItem[], options: SyncOptions): Promise<SyncResult>;
  getStatus(): SyncStatus;
  cancel(): void;
}

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'cancelled';
