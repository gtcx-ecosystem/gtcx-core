/**
 * Canonical request string construction and hashing.
 *
 * The mobile canonical request format is a 9-line string:
 *
 *   {METHOD}\n
 *   {normalizedPath}\n
 *   {normalizedQueryString}\n
 *   {bodyHash}\n
 *   {timestamp}\n
 *   {nonce}\n
 *   {did}\n
 *   {keyId}\n
 *   {audience}
 *
 * Both client and server MUST produce byte-for-byte identical strings
 * for the same request to prevent signature drift.
 */

import { hash256 } from '@gtcx/crypto';

import { canonicalizeBody, canonicalizePath, canonicalizeQueryString } from './normalize';
import type { CanonicalRequestContext, CanonicalRequestString } from './types';

/** Build the canonical request string and its hash. */
export function buildCanonicalRequest(
  context: CanonicalRequestContext,
  did: string,
  keyId: string,
  timestamp: string,
  nonce: string,
  audience: string
): CanonicalRequestString {
  const url = new URL(context.url);
  const method = context.method.toUpperCase();
  const path = canonicalizePath(url.pathname);
  const query = canonicalizeQueryString(url.searchParams);
  const bodyHash = canonicalizeBody(context.body);

  const canonical = [method, path, query, bodyHash, timestamp, nonce, did, keyId, audience].join(
    '\n'
  );

  return {
    canonical,
    canonicalHash: hash256(canonical),
  };
}
