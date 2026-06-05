/**
 * Canonical path, query, and body normalization.
 *
 * Normalization rules match the mobile contract exactly:
 * @see gtcx-mobile/apps/mobile/gtcx/lib/auth-token.ts
 */

import { hash256 } from '@gtcx/crypto';

/** Normalize a URI path: collapse repeated slashes only. */
export function canonicalizePath(path: string): string {
  return path.replace(/\/{2,}/g, '/');
}

/** Build canonical query string: sorted by key then value, no '?' prefix. */
export function canonicalizeQueryString(searchParams: URLSearchParams | string): string {
  const params =
    typeof searchParams === 'string' ? new URLSearchParams(searchParams) : searchParams;

  const entries: Array<[string, string]> = [];
  for (const [key, value] of params.entries()) {
    entries.push([key, value]);
  }
  entries.sort(([aKey, aVal], [bKey, bVal]) => {
    if (aKey < bKey) return -1;
    if (aKey > bKey) return 1;
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });

  const reconstructed = new URLSearchParams();
  for (const [k, v] of entries) {
    reconstructed.append(k, v);
  }
  return reconstructed.toString();
}

/** Compute SHA-256 hex digest of a request body string. */
export function canonicalizeBody(body: string | Uint8Array | null): string {
  if (body === null || body === undefined) {
    return hash256('');
  }
  if (typeof body === 'string') {
    return hash256(body);
  }
  return hash256(body);
}

/** Normalize request body to a string for hashing. */
export function normalizeBodyForHash(body: unknown): string {
  if (typeof body === 'string') return body;
  if (body == null) return '';
  return JSON.stringify(body);
}
