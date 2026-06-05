/**
 * DID / Key ID formatting and parsing for the canonicalization contract.
 *
 * Mobile contract:
 * - DID:   did:gtcx:tp_<32-hex-chars>  (first 32 chars of SHA-256(publicKeyHex))
 * - KeyId: hash256(`${did}:${keyRef}`).slice(0, 32)
 */

import { hash256 } from '@gtcx/crypto';

const DID_PREFIX = 'did:gtcx:tp_';
const DID_HEX_LENGTH = 32;
const KEY_ID_LENGTH = 32;

/** Derive a DID from a public key. */
export function formatDID(publicKeyHex: string): string {
  const fullHash = hash256(publicKeyHex);
  const fingerprint = fullHash.slice(0, DID_HEX_LENGTH);
  return `${DID_PREFIX}${fingerprint}`;
}

/** Derive a key identifier from a DID and optional key reference. */
export function formatKeyId(did: string, keyRef?: string): string {
  const input = keyRef ? `${did}:${keyRef}` : did;
  return hash256(input).slice(0, KEY_ID_LENGTH);
}

/** Extract the raw fingerprint from a DID. Returns undefined if invalid. */
export function parseDID(did: string): string | undefined {
  if (!did.startsWith(DID_PREFIX)) return undefined;
  const fingerprint = did.slice(DID_PREFIX.length);
  if (fingerprint.length !== DID_HEX_LENGTH) return undefined;
  if (!/^[0-9a-f]+$/i.test(fingerprint)) return undefined;
  return fingerprint;
}

/** Validate that a DID conforms to the expected format. */
export function isValidDID(did: string): boolean {
  return parseDID(did) !== undefined;
}

/** Validate that a key ID is a 32-char hex string. */
export function isValidKeyId(keyId: string): boolean {
  return /^[0-9a-f]{32}$/i.test(keyId);
}
