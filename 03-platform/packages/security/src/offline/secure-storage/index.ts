/**
 * Secure storage submodule exports.
 */

export { SecureStorageError } from './errors';
export {
  OfflineSecurityConfigSchema,
  DEFAULT_OFFLINE_CONFIG,
  type OfflineSecurityConfig,
} from './config';
export {
  EncryptedItemSchema,
  type EncryptedItem,
  type SecureStorageState,
  type UnlockResult,
  type StorageBackend,
} from './types';
