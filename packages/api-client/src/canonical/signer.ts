/**
 * Canonical request signer factory.
 *
 * Produces a `RequestSigner` compatible with `createApiClient`.
 * Both mobile and server use the same canonicalization path
 * imported from this module to guarantee zero drift.
 */

import { signHash } from '@gtcx/crypto';

import type { RequestSigner } from '../types';
import type { CanonicalizationOptions, SigningKeyMaterial } from './types';
import {
  KEY_ID_HEADER_NAME,
  NONCE_HEADER_NAME,
  SIGNATURE_HEADER_NAME,
  TIMESTAMP_HEADER_NAME,
  serializeEnvelope,
} from './envelope';
import { buildCanonicalRequest } from './hash';
import { generateNonce } from './nonce';
import { formatKeyId } from './did';

/**
 * Create a canonical request signer.
 *
 * Usage with `createApiClient`:
 * ```ts
 * const signer = createCanonicalSigner({
 *   privateKeyHex: 'a1b2...',
 *   publicKeyHex: 'c3d4...',
 * });
 *
 * const client = createApiClient({
 *   baseUrl: 'https://api.gtcx.io',
 *   signer,
 * });
 * ```
 */
export function createCanonicalSigner(
  keys: SigningKeyMaterial,
  options?: CanonicalizationOptions
): RequestSigner {
  const keyId = formatKeyId(keys.publicKeyHex);

  return async ({ method, url, headers, body }) => {
    const timestamp = new Date().toISOString();
    const nonce = generateNonce();

    const enrichedHeaders: Record<string, string> = {
      ...headers,
      [TIMESTAMP_HEADER_NAME]: timestamp,
      [NONCE_HEADER_NAME]: nonce,
      [KEY_ID_HEADER_NAME]: keyId,
    };

    const { canonicalHash } = buildCanonicalRequest(
      { method, url, headers: enrichedHeaders, body },
      options?.extraSignedHeaders
    );

    const signature = signHash(canonicalHash, keys.privateKeyHex);

    const envelope = serializeEnvelope({
      version: options?.version ?? 'v1',
      algorithm: options?.algorithm ?? 'ed25519',
      keyId,
      timestamp,
      nonce,
      signature,
    });

    return {
      [SIGNATURE_HEADER_NAME]: envelope,
      [TIMESTAMP_HEADER_NAME]: timestamp,
      [NONCE_HEADER_NAME]: nonce,
      [KEY_ID_HEADER_NAME]: keyId,
    };
  };
}
