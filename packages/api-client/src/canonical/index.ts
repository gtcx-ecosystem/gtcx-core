/**
 * Canonical Request Canonicalization Contract
 *
 * Shared between mobile clients and backend servers.
 * Import from `@gtcx/api-client/canonical` on both sides.
 *
 * Mobile contract reference: gtcx-mobile/apps/mobile/gtcx/lib/auth-token.ts
 *
 * Guarantees:
 * - Body hashing: SHA-256 hex
 * - Path normalization: collapse repeated slashes
 * - Query normalization: sort by key then value, URLSearchParams encoding
 * - Timestamp format: ISO 8601 UTC milliseconds
 * - Nonce format: 16-byte hex (32 characters)
 * - DID format: did:gtcx:tp_<32-hex-chars>
 * - Key ID: SHA-256(`${did}:${keyRef}`).slice(0, 32)
 * - Canonical request: 9-line string
 * - Signature: Ed25519 sign of SHA-256(canonical request)
 * - Auth token: Bearer base64url(JSON({did, iat, exp})).<signature>
 */

export type {
  AuthScheme,
  CanonicalVersion,
  SignatureAlgorithm,
  SignatureEnvelope,
  CanonicalRequestContext,
  CanonicalizationOptions,
  CanonicalSignerOptions,
  SigningKeyMaterial,
  VerificationResult,
  CanonicalRequestString,
} from './types';

export {
  canonicalizePath,
  canonicalizeQueryString,
  canonicalizeBody,
  normalizeBodyForHash,
} from './normalize';

export {
  serializeEnvelope,
  parseEnvelope,
  AUTHORIZATION_HEADER_NAME,
  AUTH_SCHEME_HEADER_NAME,
  DID_HEADER_NAME,
  KEY_ID_HEADER_NAME,
  TIMESTAMP_HEADER_NAME,
  NONCE_HEADER_NAME,
  AUDIENCE_HEADER_NAME,
  BODY_HASH_HEADER_NAME,
  SIGNATURE_HEADER_NAME,
} from './envelope';

export { generateNonce } from './nonce';

export { formatDID, formatKeyId, parseDID, isValidDID, isValidKeyId } from './did';

export { buildCanonicalRequest } from './hash';

export { createCanonicalSigner } from './signer';

export { verifyCanonicalSignature } from './verify';
