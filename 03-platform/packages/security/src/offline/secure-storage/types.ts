/**
 * Secure storage types.
 */

import { z } from 'zod';

export const EncryptedItemSchema = z.object({
  ciphertext: z.string(),
  iv: z.string(),
  tag: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  version: z.number().int().min(1).default(1),
});

export type EncryptedItem = z.infer<typeof EncryptedItemSchema>;

export interface SecureStorageState {
  isLocked: boolean;
  failedAttempts: number;
  lastUnlockedAt?: Date;
  lastIntegrityCheckAt?: Date;
  lastFailedAt?: Date | undefined;
}

export interface UnlockResult {
  success: boolean;
  error?: 'INVALID_SECRET' | 'LOCKED_OUT' | 'CORRUPTED' | undefined;
  remainingAttempts?: number | undefined;
  lockoutExpiresAt?: Date | undefined;
}

export interface StorageBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  getAllKeys(): Promise<string[]>;
  clear(): Promise<void>;
}
