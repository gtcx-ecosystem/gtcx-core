/**
 * Canonical request canonicalization contract tests.
 *
 * These tests MUST pass identically on both client and server.
 * Mobile contract reference: gtcx-mobile/apps/mobile/gtcx/lib/auth-token.ts
 */

import { generateKeyPair, hash256 } from '@gtcx/crypto';
import { describe, it, expect, beforeAll } from 'vitest';

import {
  canonicalizePath,
  canonicalizeQueryString,
  canonicalizeBody,
  normalizeBodyForHash,
  serializeEnvelope,
  parseEnvelope,
  SIGNATURE_HEADER_NAME,
  TIMESTAMP_HEADER_NAME,
  NONCE_HEADER_NAME,
  DID_HEADER_NAME,
  KEY_ID_HEADER_NAME,
  AUDIENCE_HEADER_NAME,
  BODY_HASH_HEADER_NAME,
  AUTH_SCHEME_HEADER_NAME,
  generateNonce,
  formatDID,
  formatKeyId,
  parseDID,
  isValidDID,
  isValidKeyId,
  buildCanonicalRequest,
  createCanonicalSigner,
  verifyCanonicalSignature,
} from './index';

describe('canonicalizePath', () => {
  it('normalizes root path', () => {
    expect(canonicalizePath('/')).toBe('/');
  });

  it('collapses repeated slashes', () => {
    expect(canonicalizePath('//lots///123')).toBe('/lots/123');
  });

  it('preserves single slashes', () => {
    expect(canonicalizePath('/lots/123')).toBe('/lots/123');
  });

  it('preserves trailing slash', () => {
    expect(canonicalizePath('/lots/')).toBe('/lots/');
  });

  it('does not percent-encode', () => {
    expect(canonicalizePath('/lots/hello world')).toBe('/lots/hello world');
  });
});

describe('canonicalizeQueryString', () => {
  it('sorts keys alphabetically', () => {
    const qs = canonicalizeQueryString('z=1&a=2&m=3');
    expect(qs).toBe('a=2&m=3&z=1');
  });

  it('sorts by value when keys match', () => {
    const qs = canonicalizeQueryString('a=2&a=1&a=3');
    expect(qs).toBe('a=1&a=2&a=3');
  });

  it('returns empty string for no params', () => {
    expect(canonicalizeQueryString('')).toBe('');
  });
});

describe('canonicalizeBody', () => {
  it('hashes null body', () => {
    expect(canonicalizeBody(null)).toBe(hash256(''));
  });

  it('hashes string body', () => {
    expect(canonicalizeBody('hello')).toBe(hash256('hello'));
  });

  it('hashes Uint8Array body', () => {
    const bytes = new TextEncoder().encode('hello');
    expect(canonicalizeBody(bytes)).toBe(hash256(bytes));
  });
});

describe('normalizeBodyForHash', () => {
  it('passes through strings', () => {
    expect(normalizeBodyForHash('hello')).toBe('hello');
  });

  it('serializes objects', () => {
    expect(normalizeBodyForHash({ foo: 'bar' })).toBe('{"foo":"bar"}');
  });

  it('returns empty string for null', () => {
    expect(normalizeBodyForHash(null)).toBe('');
  });
});

describe('envelope serialization', () => {
  it('round-trips a valid envelope', () => {
    const envelope = {
      version: 'v1' as const,
      algorithm: 'ed25519' as const,
      keyId: 'a1b2c3d4e5f6789012345678abcdef01',
      timestamp: '2026-01-01T00:00:00.000Z',
      nonce: 'abcd1234efgh5678',
      signature: 'deadbeef',
    };
    const serialized = serializeEnvelope(envelope);
    expect(serialized).toBe('v1;ed25519;a1b2c3d4e5f6789012345678abcdef01;2026-01-01T00:00:00.000Z;abcd1234efgh5678;deadbeef');
    expect(parseEnvelope(serialized)).toEqual(envelope);
  });

  it('rejects wrong field count', () => {
    expect(() => parseEnvelope('v1;ed25519;key')).toThrow('expected 6 fields');
  });

  it('rejects unsupported version', () => {
    expect(() => parseEnvelope('v2;ed25519;key;t;n;sig')).toThrow('Unsupported envelope version');
  });
});

describe('nonce', () => {
  it('produces hex string of 32 chars', () => {
    const nonce = generateNonce();
    expect(nonce).toMatch(/^[0-9a-f]{32}$/i);
  });

  it('produces unique values', () => {
    const a = generateNonce();
    const b = generateNonce();
    expect(a).not.toBe(b);
  });
});

describe('DID / key ID', () => {
  let publicKeyHex: string;

  beforeAll(async () => {
    const kp = await generateKeyPair();
    publicKeyHex = kp.publicKey;
  });

  it('formats DID with correct prefix and length', () => {
    const did = formatDID(publicKeyHex);
    expect(did).toMatch(/^did:gtcx:tp_[0-9a-f]{32}$/i);
    expect(did.length).toBe(44); // 'did:gtcx:tp_' + 32 = 44
  });

  it('formats keyId as 32 hex chars', () => {
    const did = formatDID(publicKeyHex);
    const keyId = formatKeyId(did, 'primary');
    expect(keyId).toMatch(/^[0-9a-f]{32}$/i);
  });

  it('round-trips DID via parseDID', () => {
    const did = formatDID(publicKeyHex);
    expect(parseDID(did)).toBe(did.slice('did:gtcx:tp_'.length));
  });

  it('validates correct DIDs', () => {
    expect(isValidDID('did:gtcx:tp_1234567890abcdef1234567890abcdef')).toBe(true);
    expect(isValidDID('invalid')).toBe(false);
    expect(isValidDID('did:gtcx:tp_short')).toBe(false);
  });

  it('validates key IDs', () => {
    expect(isValidKeyId('1234567890abcdef1234567890abcdef')).toBe(true);
    expect(isValidKeyId('short')).toBe(false);
  });
});

describe('buildCanonicalRequest', () => {
  it('produces 9-line deterministic output', () => {
    const ctx = {
      method: 'POST',
      url: 'https://api.gtcx.io/lots?z=1&a=2',
      headers: {},
      body: '{"foo":"bar"}',
    };

    const result = buildCanonicalRequest(
      ctx,
      'did:gtcx:tp_abc123def4567890abc123def4567890',
      'key1234567890abcdef1234567890ab',
      '2026-01-01T00:00:00.000Z',
      'nonce1234567890abcdef1234567890',
      'https://api.gtcx.io'
    );

    const lines = result.canonical.split('\n');
    expect(lines).toHaveLength(9);
    expect(lines[0]).toBe('POST');
    expect(lines[1]).toBe('/lots');
    expect(lines[2]).toBe('a=2&z=1');
    expect(lines[3]).toBe(hash256('{"foo":"bar"}'));
    expect(lines[4]).toBe('2026-01-01T00:00:00.000Z');
    expect(lines[5]).toBe('nonce1234567890abcdef1234567890');
    expect(lines[6]).toBe('did:gtcx:tp_abc123def4567890abc123def4567890');
    expect(lines[7]).toBe('key1234567890abcdef1234567890ab');
    expect(lines[8]).toBe('https://api.gtcx.io');
    expect(result.canonicalHash).toBe(hash256(result.canonical));
  });
});

describe('end-to-end sign + verify', () => {
  let keys: { privateKey: string; publicKey: string };

  beforeAll(async () => {
    keys = await generateKeyPair();
  });

  it('signs and verifies a request', async () => {
    const signer = createCanonicalSigner({
      privateKeyHex: keys.privateKey,
      publicKeyHex: keys.publicKey,
      keyRef: 'primary',
    });

    const originalHeaders = { host: 'api.gtcx.io', 'content-type': 'application/json' };

    const signedHeaders = await signer({
      method: 'POST',
      url: 'https://api.gtcx.io/trades',
      headers: originalHeaders,
      body: '{"amount":100}',
      attempt: 1,
    });

    expect(signedHeaders[SIGNATURE_HEADER_NAME]).toBeDefined();
    expect(signedHeaders[TIMESTAMP_HEADER_NAME]).toBeDefined();
    expect(signedHeaders[NONCE_HEADER_NAME]).toMatch(/^[0-9a-f]{32}$/i);
    expect(signedHeaders[DID_HEADER_NAME]).toMatch(/^did:gtcx:tp_/);
    expect(signedHeaders[KEY_ID_HEADER_NAME]).toMatch(/^[0-9a-f]{32}$/i);
    expect(signedHeaders[AUDIENCE_HEADER_NAME]).toBe('https://api.gtcx.io');
    expect(signedHeaders[BODY_HASH_HEADER_NAME]).toBe(hash256('{"amount":100}'));
    expect(signedHeaders[AUTH_SCHEME_HEADER_NAME]).toBe('gtcx-signed-bearer-v1');
    expect(signedHeaders.Authorization).toMatch(/^Bearer /);

    // In real usage createApiClient merges original + signed headers
    const allHeaders = { ...originalHeaders, ...signedHeaders };

    const result = verifyCanonicalSignature(
      'POST',
      'https://api.gtcx.io/trades',
      allHeaders,
      '{"amount":100}',
      keys.publicKey
    );

    expect(result.valid).toBe(true);
    expect(result.keyId).toBe(formatKeyId(formatDID(keys.publicKey), 'primary'));
    expect(result.did).toBe(formatDID(keys.publicKey));
  });

  it('fails verification with wrong public key', async () => {
    const signer = createCanonicalSigner({
      privateKeyHex: keys.privateKey,
      publicKeyHex: keys.publicKey,
    });

    const originalHeaders = { host: 'api.gtcx.io' };
    const signedHeaders = await signer({
      method: 'GET',
      url: 'https://api.gtcx.io/lots',
      headers: originalHeaders,
      body: null,
      attempt: 1,
    });

    const allHeaders = { ...originalHeaders, ...signedHeaders };

    const otherKeys = await generateKeyPair();
    const result = verifyCanonicalSignature(
      'GET',
      'https://api.gtcx.io/lots',
      allHeaders,
      null,
      otherKeys.publicKey
    );

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Signature verification failed');
  });

  it('fails verification with missing signature header', () => {
    const result = verifyCanonicalSignature(
      'GET',
      'https://api.gtcx.io/lots',
      { host: 'api.gtcx.io', [DID_HEADER_NAME]: 'did:gtcx:tp_test' },
      null,
      keys.publicKey
    );
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Missing signature header');
  });

  it('fails verification with expired timestamp', async () => {
    const signer = createCanonicalSigner({
      privateKeyHex: keys.privateKey,
      publicKeyHex: keys.publicKey,
    });

    const originalHeaders = { host: 'api.gtcx.io' };
    const signedHeaders = await signer({
      method: 'GET',
      url: 'https://api.gtcx.io/lots',
      headers: originalHeaders,
      body: null,
      attempt: 1,
    });

    // Override timestamp to be far in the past
    signedHeaders[TIMESTAMP_HEADER_NAME] = '2020-01-01T00:00:00.000Z';
    signedHeaders[SIGNATURE_HEADER_NAME] = 'invalidsignature';

    const allHeaders = { ...originalHeaders, ...signedHeaders };

    const result = verifyCanonicalSignature(
      'GET',
      'https://api.gtcx.io/lots',
      allHeaders,
      null,
      keys.publicKey
    );
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Request timestamp outside allowed clock skew');
  });
});
