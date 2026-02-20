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

export interface SyncEngineConfig<T = unknown> {
  fetchRemote?: (ids: string[]) => Promise<SyncItem<T>[]>;
  pushLocal?: (items: SyncItem<T>[]) => Promise<void>;
  onResolved?: (items: SyncItem<T>[]) => Promise<void> | void;
  onConflict?: (conflict: SyncConflict<T>) => Promise<void> | void;
  resolveConflict?: (conflict: SyncConflict<T>) => Promise<SyncItem<T> | null>;
}

export interface SyncConflict<T = unknown> {
  id: string;
  local: SyncItem<T>[];
  remote?: SyncItem<T>;
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
