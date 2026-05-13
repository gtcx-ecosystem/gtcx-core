/**
 * @gtcx/security
 *
 * Security utilities for the GTCX Protocol ecosystem.
 *
 * This package provides non-cryptographic security utilities that complement @gtcx/crypto:
 * - validation/ - Input sanitization, Zod schemas (P2, P9)
 * - auth/ - Authentication tokens, sessions, permissions (P9)
 * - offline/ - Secure storage, credential caching, tamper detection (P8)
 * - audit/ - Security event logging, audit trails (P12)
 *
 * @see /SOP/2-docs/3-engineering/security/security-framework.md for full security architecture
 */

// ─── Validation ───
export {
  // Schemas
  ApiErrorSchema,
  BoundingBoxSchema,
  CoordinatesSchema,
  CommodityTypeSchema,
  CommonSchemas,
  ComplianceScoreSchema,
  DateTimeSchema,
  DidSchema,
  DurationSchema,
  EmailSchema,
  GeoTagIdSchema,
  Hash256Schema,
  HexStringSchema,
  PhoneSchema,
  PriceDataSchema,
  PublicKeySchema,
  PuritySchema,
  SignatureSchema,
  TimestampSchema,
  TradePassIdSchema,
  UrlSchema,
  UuidSchema,
  WeightSchema,
  createApiResponseSchema,
  createPaginatedSchema,
  // Sanitization
  BoundaryValidationError,
  ObjectSanitizeOptions,
  SanitizationError,
  StringSanitizeOptions,
  ValidationError,
  ValidationOutcome,
  ValidationResult,
  createBoundaryValidator,
  createStrictValidator,
  sanitizeFilename,
  sanitizeForLog,
  sanitizeForSql,
  sanitizeForUrlPath,
  sanitizeObject,
  sanitizeSecrets,
  sanitizeString,
} from './validation';
export type {
  Coordinates,
  CommodityType,
  Did,
  Email,
  GeoTagId,
  Hash256,
  Phone,
  PriceData,
  PublicKey,
  Signature,
  TradePassId,
  Uuid,
  Weight,
} from './validation';

// ─── Auth ───
export {
  // Permissions
  Permissions,
  Roles,
  expandPermissions,
  hasPermission,
  validatePermission,
  // Sessions
  DEFAULT_SESSION_CONFIG,
  isSessionValid,
  isSessionValidOffline,
  prepareSessionForOffline,
  recordFailedAttempt,
  resetFailedAttempts,
  sessionNeedsRotation,
  syncSessionOnline,
  SessionSchema,
  SessionStateSchema,
  // Tokens
  assembleToken,
  createTokenPayload,
  decodeToken,
  isTokenTemporallyValid,
  isTokenValidOffline,
  verifyTokenSignature,
  GTCXTokenClaimsSchema,
  JWTClaimsSchema,
  JWTHeaderSchema,
} from './auth';
export type {
  // Permissions
  Permission,
  PermissionContext,
  RoleName,
  // Sessions
  Session,
  SessionConfig,
  SessionState,
  SessionValidationResult,
  // Tokens
  GTCXTokenClaims,
  JWTClaims,
  JWTHeader,
  Token,
  TokenOptions,
  TokenValidationResult,
} from './auth';

// ─── Offline ───
export {
  // Types
  CacheInvalidReason,
  CachedCredentialSchema,
  DEFAULT_OFFLINE_CONFIG,
  IntegrityFailureReason,
  IntegrityResult,
  OfflineOperationType,
  OfflineSecurityConfigSchema,
  StorageStatus,
  // Secure storage
  SecureStorageBase,
  SecureStorageOfflineSecurityConfigSchema,
  // Credential cache
  CredentialCache,
  DEFAULT_CREDENTIAL_CACHE_CONFIG,
  CredentialCacheEntrySchema,
  // Tamper detection
  TamperCheckResult,
  checkProofStructure,
  createIntegrityProofStructure,
  createTamperDetectionEvent,
  hashesMatch,
  isProofStructureValid,
  secureCompare,
  IntegrityProofSchema,
} from './offline';
export type {
  // Types
  CachedCredential,
  CacheStatus,
  EncryptedItem,
  OfflineOperation,
  OfflineSecurityConfig,
  StoredItemMeta,
  // Secure storage
  SecureStorageOfflineSecurityConfig,
  SecureStorageState,
  StorageBackend,
  UnlockResult,
  // Credential cache
  CredentialCacheConfig,
  CredentialCacheEntry,
  CredentialValidation,
  // Tamper detection
  IntegrityProof,
  TamperDetectionEvent,
} from './offline';

// ─── Audit ───
export {
  AuditTrail,
  DEFAULT_LOGGER_CONFIG,
  SecurityBatchLogHandler,
  SecurityEventHandler,
  SecurityLogger,
  SecurityLoggerConfig,
  SecurityLoggerError,
  SecurityLogHandler,
  clearSecurityHandlers,
  consoleLogHandler,
  createAuditTrail,
  createSecurityEvent,
  jsonLogHandler,
  logSecurityEvent,
  registerSecurityHandler,
  removeSecurityHandler,
} from './audit';
export type { SecurityEvent, SecurityEventType, SecurityOutcome, SecuritySeverity } from './audit';
