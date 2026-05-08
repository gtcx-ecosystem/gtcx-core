/**
 * Server-side canonical signature verification.
 *
 * Verifies that a request's signed headers were produced
 * by the canonicalization contract on the client side.
 *
 * Mobile contract reference: gtcx-mobile/apps/mobile/gtcx/lib/auth-token.ts
 */

import { verifyHash } from '@gtcx/crypto';

import {
  AUDIENCE_HEADER_NAME,
  DID_HEADER_NAME,
  KEY_ID_HEADER_NAME,
  NONCE_HEADER_NAME,
  SIGNATURE_HEADER_NAME,
  TIMESTAMP_HEADER_NAME,
} from './envelope';
import { buildCanonicalRequest } from './hash';
import type { CanonicalizationOptions, VerificationResult } from './types';

const DEFAULT_CLOCK_SKEW_MS = 5 * 60 * 1000;

/**
 * Verify a canonical request signature.
 *
 * @param method        HTTP method
 * @param url           Full request URL
 * @param headers       All request headers (case-insensitive keys OK)
 * @param body          Request body (or null)
 * @param publicKeyHex  Public key that signed the request
 * @param options       Canonicalization options
 */
export function verifyCanonicalSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string | Uint8Array | null,
  publicKeyHex: string,
  options?: CanonicalizationOptions
): VerificationResult {
  const signature =
    headers[SIGNATURE_HEADER_NAME] ?? headers[SIGNATURE_HEADER_NAME.toLowerCase()];
  if (!signature) {
    return { valid: false, error: 'Missing signature header' };
  }

  const did = headers[DID_HEADER_NAME] ?? headers[DID_HEADER_NAME.toLowerCase()];
  if (!did) {
    return { valid: false, error: 'Missing DID header' };
  }

  const keyId = headers[KEY_ID_HEADER_NAME] ?? headers[KEY_ID_HEADER_NAME.toLowerCase()];
  if (!keyId) {
    return { valid: false, error: 'Missing key ID header' };
  }

  const timestamp =
    headers[TIMESTAMP_HEADER_NAME] ?? headers[TIMESTAMP_HEADER_NAME.toLowerCase()];
  if (!timestamp) {
    return { valid: false, error: 'Missing timestamp header' };
  }

  const nonce = headers[NONCE_HEADER_NAME] ?? headers[NONCE_HEADER_NAME.toLowerCase()];
  if (!nonce) {
    return { valid: false, error: 'Missing nonce header' };
  }

  const audience =
    headers[AUDIENCE_HEADER_NAME] ?? headers[AUDIENCE_HEADER_NAME.toLowerCase()];
  if (!audience) {
    return { valid: false, error: 'Missing audience header' };
  }

  // Clock skew check
  const signedAt = new Date(timestamp).getTime();
  const now = Date.now();
  const skew = options?.clockSkewMs ?? DEFAULT_CLOCK_SKEW_MS;
  if (Number.isNaN(signedAt) || Math.abs(now - signedAt) > skew) {
    return {
      valid: false,
      keyId,
      did,
      error: 'Request timestamp outside allowed clock skew',
    };
  }

  // Rebuild canonical request using the same path the client used
  const { canonicalHash } = buildCanonicalRequest(
    { method, url, headers, body },
    did,
    keyId,
    timestamp,
    nonce,
    audience
  );

  const valid = verifyHash(canonicalHash, signature, publicKeyHex);

  if (valid) {
    return { valid: true, keyId, did };
  }
  return { valid: false, keyId, did, error: 'Signature verification failed' };
}
