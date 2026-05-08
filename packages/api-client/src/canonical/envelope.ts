/**
 * Signature envelope format: serialization and parsing.
 *
 * Wire format (single header value):
 *   v1;ed25519;{keyId};{timestamp};{nonce};{signatureHex}
 *
 * All fields are required. Semicolons inside field values are forbidden.
 */

import type { CanonicalVersion, SignatureAlgorithm, SignatureEnvelope } from './types';

const ENVELOPE_VERSION: CanonicalVersion = 'v1';
const ENVELOPE_ALGORITHM: SignatureAlgorithm = 'ed25519';
const FIELD_COUNT = 6;

/** Build the canonical envelope string for the wire. */
export function serializeEnvelope(envelope: SignatureEnvelope): string {
  return [
    envelope.version,
    envelope.algorithm,
    envelope.keyId,
    envelope.timestamp,
    envelope.nonce,
    envelope.signature,
  ].join(';');
}

/** Parse a wire-format envelope string. */
export function parseEnvelope(value: string): SignatureEnvelope {
  const parts = value.split(';');
  if (parts.length !== FIELD_COUNT) {
    throw new Error(
      `Invalid signature envelope: expected ${FIELD_COUNT} fields, got ${parts.length}`
    );
  }

  const [version, algorithm, keyId, timestamp, nonce, signature] = parts;

  if (version !== ENVELOPE_VERSION) {
    throw new Error(`Unsupported envelope version: ${version}`);
  }
  if (algorithm !== ENVELOPE_ALGORITHM) {
    throw new Error(`Unsupported signature algorithm: ${algorithm}`);
  }
  if (!keyId || !timestamp || !nonce || !signature) {
    throw new Error('Invalid signature envelope: missing required fields');
  }

  return { version, algorithm, keyId, timestamp, nonce, signature };
}

// ============================================================================
// Header names used in the canonical signing contract
// ============================================================================

/** Authorization header with bearer token. */
export const AUTHORIZATION_HEADER_NAME = 'authorization';

/** Authentication scheme header. */
export const AUTH_SCHEME_HEADER_NAME = 'x-gtcx-auth-scheme';

/** DID header. */
export const DID_HEADER_NAME = 'x-gtcx-did';

/** Key ID header. */
export const KEY_ID_HEADER_NAME = 'x-gtcx-key-id';

/** Timestamp header. */
export const TIMESTAMP_HEADER_NAME = 'x-gtcx-timestamp';

/** Nonce header. */
export const NONCE_HEADER_NAME = 'x-gtcx-nonce';

/** Audience header. */
export const AUDIENCE_HEADER_NAME = 'x-gtcx-audience';

/** Body SHA-256 hash header. */
export const BODY_HASH_HEADER_NAME = 'x-gtcx-body-sha256';

/** Signature envelope header. */
export const SIGNATURE_HEADER_NAME = 'x-gtcx-signature';
