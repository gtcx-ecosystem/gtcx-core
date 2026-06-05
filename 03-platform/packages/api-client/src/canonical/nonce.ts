/**
 * Nonce generation for canonical request signatures.
 *
 * Nonces are 16-byte random values, hex-encoded (32 characters).
 * This matches the mobile contract exactly.
 */

import { randomBytes } from 'node:crypto';

const NONCE_BYTES = 16;

/** Generate a fresh nonce. */
export function generateNonce(): string {
  return randomBytes(NONCE_BYTES).toString('hex');
}
