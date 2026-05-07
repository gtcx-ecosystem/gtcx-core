/**
 * Canonical path, query, header, and body normalization.
 *
 * Normalization rules are deterministic and MUST NOT change between
 * client and server implementations.
 */

import { hash256 } from '@gtcx/crypto';

/** Headers that are always included in the signature. */
export const DEFAULT_SIGNED_HEADERS = [
  'host',
  'content-type',
  'x-gtcx-timestamp',
  'x-gtcx-nonce',
  'x-gtcx-key-id',
];

/** Percent-encode a string for canonical form (RFC 3986 safe). */
function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** Normalize a URI path: collapse slashes, resolve '..' (safely), no trailing slash. */
export function canonicalizePath(path: string): string {
  // Remove repeated slashes and resolve relative segments
  const segments = path.split('/').filter((s) => s !== '' && s !== '.');
  const resolved: string[] = [];
  for (const seg of segments) {
    if (seg === '..') {
      resolved.pop();
    } else {
      resolved.push(seg);
    }
  }
  const normalized = '/' + resolved.map(percentEncode).join('/');
  // Root path stays as '/'
  return normalized || '/';
}

/** Build canonical query string: sorted keys, URI-encoded, no '?' prefix. */
export function canonicalizeQueryString(searchParams: URLSearchParams | string): string {
  const params =
    typeof searchParams === 'string'
      ? new URLSearchParams(searchParams)
      : searchParams;

  const entries: Array<[string, string]> = [];
  for (const [key, value] of params.entries()) {
    entries.push([percentEncode(key), percentEncode(value)]);
  }
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));

  return entries.map(([k, v]) => `${k}=${v}`).join('&');
}

/** Build canonical headers block: lowercase keys, trimmed values, sorted. */
export function canonicalizeHeaders(
  headers: Record<string, string>,
  signedHeaderNames: string[]
): string {
  const normalized = new Map<string, string>();
  for (const [key, value] of Object.entries(headers)) {
    normalized.set(key.toLowerCase().trim(), value.trim());
  }

  const lines = signedHeaderNames
    .slice()
    .sort()
    .map((name) => {
      const value = normalized.get(name) ?? '';
      return `${name}:${value}`;
    });

  return lines.join('\n');
}

/** Compute SHA-256 hex digest of a request body. */
export function canonicalizeBody(body: string | Uint8Array | null): string {
  if (body === null || body === undefined) {
    return hash256('');
  }
  if (typeof body === 'string') {
    return hash256(body);
  }
  return hash256(body);
}

/** Build the ordered list of signed header names. */
export function buildSignedHeaderNames(
  headers: Record<string, string>,
  extraSignedHeaders?: string[]
): string[] {
  const all = new Set([...DEFAULT_SIGNED_HEADERS, ...(extraSignedHeaders ?? [])]);
  // Only include headers that actually exist on the request
  const present = new Set(Object.keys(headers).map((k) => k.toLowerCase().trim()));
  return Array.from(all).filter((h) => present.has(h)).sort();
}
