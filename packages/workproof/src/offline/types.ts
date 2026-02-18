// ============================================================================
// OFFLINE TYPES
// Offline-first WorkProof generation and sync (spec §5)
// ============================================================================

import type { WorkProof } from '../workproof/types';

/** Sync status for offline-generated WorkProofs */
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'conflict';

/** Metadata attached to WorkProofs generated offline */
export interface OfflineMetadata {
  generatedOffline: true;
  deviceId: string;
  localSequenceNumber: number;
  syncStatus: SyncStatus;
  syncAttempts: number;
  lastSyncAttempt?: number; // unix ms
  conflictResolutionStrategy?: 'server_wins' | 'client_wins' | 'manual';
}

/** WorkProof generated during offline operation */
export interface OfflineWorkProof extends WorkProof {
  offlineMetadata: OfflineMetadata;
}

/** Entry in the sync queue */
export interface SyncQueueEntry {
  queueId: string;
  workProof: OfflineWorkProof;
  enqueuedAt: number; // unix ms
  priority: 'high' | 'normal' | 'low';
}

/** Conflict detected during sync */
export interface SyncConflict {
  queueId: string;
  localWorkProof: OfflineWorkProof;
  serverWorkProofId?: string;
  conflictReason: string;
  detectedAt: number; // unix ms
}
