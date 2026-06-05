/**
 * Canonical request signer factory.
 *
 * Produces a `RequestSigner` compatible with `createApiClient`.
 * Both mobile and server use the same canonicalization path
 * imported from this module to guarantee zero drift.
 *
 * Mobile contract reference: gtcx-mobile/apps/mobile/gtcx/lib/auth-token.ts
 */

import { signHash, hash256 } from '@gtcx/crypto';

import type { RequestSigner } from '../types';

import { formatDID, formatKeyId } from './did';
import {
  AUDIENCE_HEADER_NAME,
  AUTH_SCHEME_HEADER_NAME,
  BODY_HASH_HEADER_NAME,
  DID_HEADER_NAME,
  KEY_ID_HEADER_NAME,
  NONCE_HEADER_NAME,
  SIGNATURE_HEADER_NAME,
  TIMESTAMP_HEADER_NAME,
} from './envelope';
import { buildCanonicalRequest } from './hash';
import { generateNonce } from './nonce';
import { canonicalizeBody, normalizeBodyForHash } from './normalize';
import type { CanonicalSignerOptions, SigningKeyMaterial } from './types';

const DEFAULT_TOKEN_TTL_MS = 5 * 60 * 1000;
const DEFAULT_AUTH_SCHEME = 'gtcx-signed-bearer-v1';

function toBase64Url(value: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(value).toString('base64url');
  }
  const bin = Array.from(value, (c) => String.fromCharCode(c.charCodeAt(0))).join('');
  const base64 = btoa(bin);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

/** Generate a short-lived bearer token: base64url(payload).signature */
function generateAuthToken(did: string, privateKeyHex: string, ttlMs: number): string {
  const now = Date.now();
  const payload = JSON.stringify({
    did,
    iat: now,
    exp: now + ttlMs,
  });
  const payloadHash = hash256(payload);
  const signature = signHash(payloadHash, privateKeyHex);
  const encodedPayload = toBase64Url(payload);
  return `${encodedPayload}.${signature}`;
}

/**
 * Create a canonical request signer matching the mobile contract.
 *
 * Usage with `createApiClient`:
 * ```ts
 * const signer = createCanonicalSigner({
 *   privateKeyHex: 'a1b2...',
 *   publicKeyHex: 'c3d4...',
 *   keyRef: 'primary',
 * });
 *
 * const client = createApiClient({
 *   baseUrl: 'https://api.gtcx.trade',
 *   signer,
 * });
 * ```
 */
export function createCanonicalSigner(
  keys: SigningKeyMaterial,
  options?: CanonicalSignerOptions
): RequestSigner {
  const did = formatDID(keys.publicKeyHex);
  const keyId = formatKeyId(did, keys.keyRef);
  const authScheme = options?.authScheme ?? DEFAULT_AUTH_SCHEME;
  const tokenTtlMs = options?.tokenTtlMs ?? DEFAULT_TOKEN_TTL_MS;

  return async ({ method, url, headers, body }) => {
    const requestUrl = new URL(url);
    const audience = options?.audience ?? requestUrl.origin;
    const bodyString = normalizeBodyForHash(body);
    const bodyHash = canonicalizeBody(bodyString);
    const timestamp = new Date().toISOString();
    const nonce = generateNonce();
    const authorization = generateAuthToken(did, keys.privateKeyHex, tokenTtlMs);

    const { canonicalHash } = buildCanonicalRequest(
      { method, url, headers, body: bodyString },
      did,
      keyId,
      timestamp,
      nonce,
      audience
    );

    const signature = signHash(canonicalHash, keys.privateKeyHex);

    return {
      Authorization: `Bearer ${authorization}`,
      [AUTH_SCHEME_HEADER_NAME]: authScheme,
      [DID_HEADER_NAME]: did,
      [KEY_ID_HEADER_NAME]: keyId,
      [TIMESTAMP_HEADER_NAME]: timestamp,
      [NONCE_HEADER_NAME]: nonce,
      [AUDIENCE_HEADER_NAME]: audience,
      [BODY_HASH_HEADER_NAME]: bodyHash,
      [SIGNATURE_HEADER_NAME]: signature,
    };
  };
}
