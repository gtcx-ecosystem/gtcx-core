/**
 * Canonical Request Canonicalization Contract
 *
 * Shared between mobile clients and backend servers.
 * Import from `@gtcx/api-client/canonical` on both sides.
 *
 * Guarantees:
 * - Body hashing: SHA-256
 * - Path/query normalization: deterministic URI encoding
 * - Timestamp format: ISO 8601 UTC milliseconds
 * - Nonce format: base64url-encoded 16-byte random
 * - Signature envelope: `v1;ed25519;{keyId};{timestamp};{nonce};{signatureHex}`
 * - Key ID / DID binding: `did:gtcx:{fingerprint}` where fingerprint = SHA-256(publicKeyHex)[0:16]
 */

export type {
  SignatureAlgorithm,
  CanonicalVersion,
  SignatureEnvelope,
  CanonicalRequestContext,
  CanonicalizationOptions,
  SigningKeyMaterial,
  VerificationResult,
  CanonicalRequestString,
} from './types';

export {
  canonicalizePath,
  canonicalizeQueryString,
  canonicalizeHeaders,
  canonicalizeBody,
  buildSignedHeaderNames,
  DEFAULT_SIGNED_HEADERS,
} from './normalize';

export {
  serializeEnvelope,
  parseEnvelope,
  SIGNATURE_HEADER_NAME,
  TIMESTAMP_HEADER_NAME,
  NONCE_HEADER_NAME,
  KEY_ID_HEADER_NAME,
} from './envelope';

export { generateNonce } from './nonce';

export { formatKeyId, parseKeyId, isValidKeyId } from './did';

export { buildCanonicalRequest } from './hash';

export { createCanonicalSigner } from './signer';

export { verifyCanonicalSignature } from './verify';
