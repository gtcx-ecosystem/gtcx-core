/**
 * DID / Key ID formatting and parsing for the canonicalization contract.
 *
 * Key ID format: did:gtcx:{fingerprint}
 * Fingerprint: first 16 hex characters of SHA-256(publicKeyHex)
 */

import { hash256 } from '@gtcx/crypto';

const DID_PREFIX = 'did:gtcx:';
const FINGERPRINT_LENGTH = 16;

/** Derive a DID-formatted key identifier from a public key. */
export function formatKeyId(publicKeyHex: string): string {
  const fullHash = hash256(publicKeyHex);
  const fingerprint = fullHash.slice(0, FINGERPRINT_LENGTH);
  return `${DID_PREFIX}${fingerprint}`;
}

/** Extract the raw fingerprint from a key ID. Returns undefined if invalid. */
export function parseKeyId(keyId: string): string | undefined {
  if (!keyId.startsWith(DID_PREFIX)) return undefined;
  const fingerprint = keyId.slice(DID_PREFIX.length);
  if (fingerprint.length !== FINGERPRINT_LENGTH) return undefined;
  if (!/^[0-9a-f]+$/i.test(fingerprint)) return undefined;
  return fingerprint;
}

/** Validate that a key ID conforms to the expected format. */
export function isValidKeyId(keyId: string): boolean {
  return parseKeyId(keyId) !== undefined;
}
