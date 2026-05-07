/**
 * Canonical request canonicalization contract types.
 *
 * This contract is shared between mobile clients and backend servers.
 * Both sides MUST use identical canonicalization logic to prevent signature drift.
 *
 * @packageDocumentation
 */

/** Algorithm used for request signing. */
export type SignatureAlgorithm = 'ed25519';

/** Canonicalization protocol version. */
export type CanonicalVersion = 'v1';

/** Parsed signature envelope components. */
export interface SignatureEnvelope {
  /** Protocol version (e.g. 'v1'). */
  version: CanonicalVersion;
  /** Signing algorithm (e.g. 'ed25519'). */
  algorithm: SignatureAlgorithm;
  /** DID-formatted key identifier. */
  keyId: string;
  /** ISO 8601 timestamp used when signing. */
  timestamp: string;
  /** Base64url-encoded nonce. */
  nonce: string;
  /** Hex-encoded signature. */
  signature: string;
}

/** Context for building a canonical request string. */
export interface CanonicalRequestContext {
  /** HTTP method in uppercase. */
  method: string;
  /** Full request URL. */
  url: string;
  /** Headers already set on the request (case-insensitive keys). */
  headers: Record<string, string>;
  /** Request body (string, Uint8Array, or null). */
  body: string | Uint8Array | null;
}

/** Options that control canonicalization behavior. */
export interface CanonicalizationOptions {
  /** Protocol version. */
  version?: CanonicalVersion;
  /** Signing algorithm. */
  algorithm?: SignatureAlgorithm;
  /** Clock skew tolerance in milliseconds (default: 5 minutes). */
  clockSkewMs?: number;
  /** Additional header names to include in the signature (lowercase). */
  extraSignedHeaders?: string[];
}

/** Key material required for canonical request signing. */
export interface SigningKeyMaterial {
  /** Private key in hex format. */
  privateKeyHex: string;
  /** Public key in hex format (used to derive the keyId). */
  publicKeyHex: string;
}

/** Result of canonical request verification. */
export interface VerificationResult {
  /** Whether the signature is cryptographically valid. */
  valid: boolean;
  /** Parsed envelope (only present when parsing succeeds). */
  envelope?: SignatureEnvelope;
  /** Human-readable error message when invalid. */
  error?: string;
  /** Key ID extracted from the envelope. */
  keyId?: string;
}

/** String-serialized canonical request for hashing. */
export interface CanonicalRequestString {
  /** The canonical string itself. */
  canonical: string;
  /** The SHA-256 hex digest of the canonical string. */
  canonicalHash: string;
}
