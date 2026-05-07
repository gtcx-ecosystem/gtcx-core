/**
 * Nonce generation for canonical request signatures.
 *
 * Nonces are 16-byte random values, base64url-encoded (no padding).
 * This format is URL-safe and works in all JS environments.
 */

import { randomBytes } from 'node:crypto';

const NONCE_BYTES = 16;

/** Generate a fresh nonce. */
export function generateNonce(): string {
  const bytes = randomBytes(NONCE_BYTES);
  return bytes.toString('base64url');
}
