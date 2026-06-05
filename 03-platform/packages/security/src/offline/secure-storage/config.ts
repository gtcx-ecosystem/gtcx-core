/**
 * Offline security configuration.
 */

import { z } from 'zod';

export const OfflineSecurityConfigSchema = z.object({
  maxOfflineHours: z.number().int().min(1).max(168).default(72),
  credentialRefreshBufferHours: z.number().int().min(1).default(24),
  storageEncryption: z.literal('AES-256-GCM').default('AES-256-GCM'),
  keyDerivation: z.literal('ARGON2ID').default('ARGON2ID'),
  argon2Memory: z.number().int().min(16384).default(131072),
  argon2Iterations: z.number().int().min(1).default(4),
  argon2Parallelism: z.number().int().min(1).default(1),
  integrityCheckIntervalMinutes: z.number().int().min(1).default(15),
  maxFailedAttempts: z.number().int().min(1).default(10),
  wipeOnExceed: z.boolean().default(true),
  lockoutDurationSeconds: z.number().int().min(60).default(900),
});

export type OfflineSecurityConfig = z.infer<typeof OfflineSecurityConfigSchema>;

export const DEFAULT_OFFLINE_CONFIG: OfflineSecurityConfig = {
  maxOfflineHours: 72,
  credentialRefreshBufferHours: 24,
  storageEncryption: 'AES-256-GCM',
  keyDerivation: 'ARGON2ID',
  argon2Memory: 131072,
  argon2Iterations: 4,
  argon2Parallelism: 1,
  integrityCheckIntervalMinutes: 15,
  maxFailedAttempts: 10,
  wipeOnExceed: true,
  lockoutDurationSeconds: 900,
};
