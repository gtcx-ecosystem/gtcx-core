// ============================================================================
// GTCX IDENTITY PACKAGE
// Identity management, DIDs, and credentials
// ============================================================================

// Identity lifecycle
export {
  createIdentity,
  createEnhancedIdentity,
  deriveIdentity,
  validateIdentity,
  isIdentityExpired,
  generateIdentityId,
  type CreateIdentityOptions,
  type IdentityCreationResult,
  type EnhancedIdentityCreationResult,
} from './identity';

// DID operations
export {
  DID_METHOD,
  createDID,
  parseDID,
  isValidDID,
  createDIDDocument,
  resolveDID,
  resolveDIDWithMetadata,
  extractPublicKey,
  type DIDDocument,
  type VerificationMethod,
} from './did';

// DID resolver infrastructure
export {
  createDIDResolver,
  createHttpDIDResolverAdapter,
  createInMemoryDIDCache,
  createStaticDIDResolverAdapter,
  DIDResolverError,
  type DIDResolver,
  type DIDResolverAdapter,
  type DIDResolverCache,
  type DIDResolverCacheEntry,
  type DIDResolverConfig,
  type DIDResolverOptions,
  type DIDResolutionMetadata,
  type DIDResolutionResult,
  type DIDRevocationChecker,
  type DIDRevocationStatus,
  type HttpDIDResolverConfig,
} from './resolver';
