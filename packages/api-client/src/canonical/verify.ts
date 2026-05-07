/**
 * Server-side canonical signature verification.
 *
 * Verifies that a request's `X-GTCX-Signature` header was produced
 * by the canonicalization contract on the client side.
 */

import { verifyHash } from '@gtcx/crypto';

import { SIGNATURE_HEADER_NAME, parseEnvelope } from './envelope';
import { buildCanonicalRequest } from './hash';
import type { CanonicalizationOptions, VerificationResult } from './types';

const DEFAULT_CLOCK_SKEW_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Verify a canonical request signature.
 *
 * @param method      HTTP method
 * @param url         Full request URL
 * @param headers     All request headers (case-insensitive keys OK)
 * @param body        Request body (or null)
 * @param publicKeyHex  Public key that signed the request
 * @param options     Canonicalization options
 */
export function verifyCanonicalSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string | Uint8Array | null,
  publicKeyHex: string,
  options?: CanonicalizationOptions
): VerificationResult {
  const signatureHeader = headers[SIGNATURE_HEADER_NAME] ?? headers[SIGNATURE_HEADER_NAME.toLowerCase()];
  if (!signatureHeader) {
    return { valid: false, error: 'Missing signature header' };
  }

  let envelope: ReturnType<typeof parseEnvelope>;
  try {
    envelope = parseEnvelope(signatureHeader);
  } catch (err) {
    return {
      valid: false,
      error: `Invalid signature envelope: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // Clock skew check
  const signedAt = new Date(envelope.timestamp).getTime();
  const now = Date.now();
  const skew = options?.clockSkewMs ?? DEFAULT_CLOCK_SKEW_MS;
  if (Number.isNaN(signedAt) || Math.abs(now - signedAt) > skew) {
    return { valid: false, envelope, keyId: envelope.keyId, error: 'Request timestamp outside allowed clock skew' };
  }

  // Rebuild canonical request using the same path the client used
  const { canonicalHash } = buildCanonicalRequest(
    { method, url, headers, body },
    options?.extraSignedHeaders
  );

  const valid = verifyHash(canonicalHash, envelope.signature, publicKeyHex);

  if (valid) {
    return { valid: true, envelope, keyId: envelope.keyId };
  }
  return { valid: false, envelope, keyId: envelope.keyId, error: 'Signature verification failed' };
}
