// ============================================================================
// GTCX CRYPTOGRAPHIC PRIMITIVES
// Core cryptographic operations for the protocol
// ============================================================================

// Base operations (no tracing)
export {
  generateKeyPair,
  derivePublicKey,
  isValidPublicKey,
  isValidPrivateKey,
  generateKeyId,
  keyFormats,
  getPublicKeyLength,
  compressPublicKey,
  type KeyAlgorithm,
  type KeyPairResult,
  type DerivedKey,
} from './keys';

export {
  sign,
  signHash,
  verify,
  verifyHash,
  createSignedMessage,
  verifySignedMessage,
  batchVerify,
  secureWipe,
  type SignatureResult,
  type VerificationResult,
} from './signing';

export {
  hash256,
  hash512,
  hash,
  hashObject,
  doubleHash256,
  verifyHash as verifyHashValue,
  createCommitment,
  verifyCommitment,
  generateSalt,
  combineHashes,
  constantTimeEqual,
  type HashAlgorithm,
} from './hashing';

export * from './proofs';
export * from './zkp';

// ============================================================================
// TRACED OPERATIONS (AI-Native)
// Import from '@gtcx/crypto/traced' for operation logging
// ============================================================================

export {
  tracedSign,
  tracedSignHash,
  tracedVerify,
  tracedVerifyHash,
  tracedCreateSignedMessage,
  tracedVerifySignedMessage,
  tracedBatchVerify,
  logSigningOperation,
} from './traced';

export {
  tracedHash256,
  tracedHash512,
  tracedHash,
  tracedHashObject,
  tracedDoubleHash256,
  tracedVerifyHashValue,
  tracedCreateCommitment,
  tracedVerifyCommitment,
  tracedGenerateSalt,
  tracedCombineHashes,
} from './traced-hashing';

export {
  tracedGenerateKeyPair,
  tracedDerivePublicKey,
  tracedIsValidPublicKey,
  tracedIsValidPrivateKey,
  tracedGenerateKeyId,
  tracedCompressPublicKey,
  logKeyEvent,
} from './traced-keys';

// ============================================================================
// FIPS MODE
// ============================================================================

export { isFipsMode } from './fips';

// ============================================================================
// BACKEND SELECTION
// ============================================================================

export { getBackend, type Backend } from './native-loader';
