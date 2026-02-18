// ============================================================================
// OFFLINE SCHEMAS
// Zod schemas for offline WorkProof types
// ============================================================================

import { z } from 'zod';

import { WorkProofSchema } from '../workproof/schemas';

export const SyncStatusSchema = z.enum(['pending', 'syncing', 'synced', 'conflict']);

export const ConflictResolutionStrategySchema = z.enum(['server_wins', 'client_wins', 'manual']);

export const OfflineMetadataSchema = z.object({
  generatedOffline: z.literal(true),
  deviceId: z.string().min(1),
  localSequenceNumber: z.number().int().nonnegative(),
  syncStatus: SyncStatusSchema,
  syncAttempts: z.number().int().nonnegative(),
  lastSyncAttempt: z.number().int().positive().optional(),
  conflictResolutionStrategy: ConflictResolutionStrategySchema.optional(),
});

export const OfflineWorkProofSchema = WorkProofSchema.extend({
  offlineMetadata: OfflineMetadataSchema,
});

export const SyncQueuePrioritySchema = z.enum(['high', 'normal', 'low']);

export const SyncQueueEntrySchema = z.object({
  queueId: z.string().min(1),
  workProof: OfflineWorkProofSchema,
  enqueuedAt: z.number().int().positive(),
  priority: SyncQueuePrioritySchema,
});

export const SyncConflictSchema = z.object({
  queueId: z.string().min(1),
  localWorkProof: OfflineWorkProofSchema,
  serverWorkProofId: z.string().optional(),
  conflictReason: z.string().min(1),
  detectedAt: z.number().int().positive(),
});
