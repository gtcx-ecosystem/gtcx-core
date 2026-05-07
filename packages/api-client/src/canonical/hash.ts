/**
 * Canonical request string construction and hashing.
 *
 * The canonical request format is a multi-line string:
 *
 *   {METHOD}\n
 *   {canonicalPath}\n
 *   {canonicalQueryString}\n
 *   {canonicalHeaders}\n
 *   {signedHeaders}\n
 *   {bodyHash}
 *
 * Both client and server MUST produce byte-for-byte identical strings
 * for the same request to prevent signature drift.
 */

import { hash256 } from '@gtcx/crypto';
import type { CanonicalRequestContext, CanonicalRequestString } from './types';
import {
  canonicalizePath,
  canonicalizeQueryString,
  canonicalizeHeaders,
  canonicalizeBody,
  buildSignedHeaderNames,
} from './normalize';

/** Build the canonical request string and its hash. */
export function buildCanonicalRequest(
  context: CanonicalRequestContext,
  extraSignedHeaders?: string[]
): CanonicalRequestString {
  const url = new URL(context.url);
  const method = context.method.toUpperCase();
  const path = canonicalizePath(url.pathname);
  const query = canonicalizeQueryString(url.searchParams);
  const bodyHash = canonicalizeBody(context.body);
  const signedHeaders = buildSignedHeaderNames(context.headers, extraSignedHeaders);
  const headersBlock = canonicalizeHeaders(context.headers, signedHeaders);

  const canonical = [
    method,
    path,
    query,
    headersBlock,
    signedHeaders.join(';'),
    bodyHash,
  ].join('\n');

  return {
    canonical,
    canonicalHash: hash256(canonical),
  };
}
