/**
 * Nonce generation for canonical request signatures.
 *
 * Nonces are 16-byte random values, base64url-encoded (no padding).
 * This format is URL-safe and works in all JS environments.
 */

const NONCE_BYTES = 16;

/** Generate a fresh nonce. */
export function generateNonce(): string {
  const bytes = new Uint8Array(NONCE_BYTES);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Node.js fallback
    const { randomBytes } = require('node:crypto');
    randomBytes(NONCE_BYTES).copy(bytes);
  }
  return base64urlEncode(bytes);
}

/** Base64url-encode a Uint8Array (no padding). */
function base64urlEncode(bytes: Uint8Array): string {
  // Use built-in btoa / Buffer depending on environment
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64url');
  }
  // Browser fallback
  const bin = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  const base64 = btoa(bin);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
