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
  extractPublicKey,
  type DIDDocument,
  type VerificationMethod,
} from './did';
