/**
 * FIPS mode integration tests.
 *
 * Tests the full FIPS code path: environment variable detection,
 * algorithm routing, P-256 key generation, sign/verify round-trip,
 * and warning behavior for non-FIPS algorithms.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { isFipsMode, resetFipsMode, fipsWarn } from '../src/fips';
import { fipsGenerateKeyPair, fipsSign, fipsVerify, fipsGenerateSalt } from '../src/fips-backend';

describe('FIPS mode detection', () => {
  beforeEach(() => {
    resetFipsMode();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetFipsMode();
  });

  it('detects FIPS mode when GTCX_FIPS_MODE=true', () => {
    vi.stubEnv('GTCX_FIPS_MODE', 'true');
    resetFipsMode();
    expect(isFipsMode()).toBe(true);
  });

  it('is disabled by default', () => {
    vi.stubEnv('GTCX_FIPS_MODE', '');
    resetFipsMode();
    expect(isFipsMode()).toBe(false);
  });

  it('is disabled when GTCX_FIPS_MODE is not "true"', () => {
    vi.stubEnv('GTCX_FIPS_MODE', '1');
    resetFipsMode();
    expect(isFipsMode()).toBe(false);
  });

  it('caches the result after first read', () => {
    vi.stubEnv('GTCX_FIPS_MODE', 'true');
    resetFipsMode();
    expect(isFipsMode()).toBe(true);
    // Change env — cached value should persist
    vi.stubEnv('GTCX_FIPS_MODE', '');
    expect(isFipsMode()).toBe(true);
  });

  it('resetFipsMode clears the cache', () => {
    vi.stubEnv('GTCX_FIPS_MODE', 'true');
    resetFipsMode();
    expect(isFipsMode()).toBe(true);
    vi.stubEnv('GTCX_FIPS_MODE', '');
    resetFipsMode();
    expect(isFipsMode()).toBe(false);
  });
});

describe('FIPS warning system', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetFipsMode();
  });

  it('does not warn when FIPS mode is off', () => {
    vi.stubEnv('GTCX_FIPS_MODE', '');
    resetFipsMode();
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    fipsWarn('Blake3', 'SHA-256');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('FIPS P-256 backend (node:crypto)', () => {
  it('generates valid P-256 key pair', () => {
    const { publicKey, privateKey } = fipsGenerateKeyPair();
    expect(publicKey).toBeTruthy();
    expect(privateKey).toBeTruthy();
    // DER-encoded P-256 keys are hex strings
    expect(publicKey.length).toBeGreaterThan(100);
    expect(privateKey.length).toBeGreaterThan(100);
  });

  it('generates unique key pairs', () => {
    const kp1 = fipsGenerateKeyPair();
    const kp2 = fipsGenerateKeyPair();
    expect(kp1.privateKey).not.toBe(kp2.privateKey);
    expect(kp1.publicKey).not.toBe(kp2.publicKey);
  });

  it('signs and verifies with P-256', () => {
    const { publicKey, privateKey } = fipsGenerateKeyPair();
    const message = new TextEncoder().encode('FIPS compliance round-trip test');

    const signature = fipsSign(message, privateKey);
    expect(signature).toBeTruthy();
    expect(signature.length).toBeGreaterThan(0);

    const valid = fipsVerify(message, signature, publicKey);
    expect(valid).toBe(true);
  });

  it('rejects tampered messages', () => {
    const { publicKey, privateKey } = fipsGenerateKeyPair();
    const message = new TextEncoder().encode('original message');
    const tampered = new TextEncoder().encode('tampered message');

    const signature = fipsSign(message, privateKey);
    const valid = fipsVerify(tampered, signature, publicKey);
    expect(valid).toBe(false);
  });

  it('rejects tampered signatures', () => {
    const { publicKey, privateKey } = fipsGenerateKeyPair();
    const message = new TextEncoder().encode('test payload');

    const signature = fipsSign(message, privateKey);
    // Flip a byte in the signature
    const tamperedSig = signature.slice(0, -2) + (signature.slice(-2) === '00' ? 'ff' : '00');
    const valid = fipsVerify(message, tamperedSig, publicKey);
    expect(valid).toBe(false);
  });

  it('rejects wrong public key', () => {
    const kp1 = fipsGenerateKeyPair();
    const kp2 = fipsGenerateKeyPair();
    const message = new TextEncoder().encode('wrong key test');

    const signature = fipsSign(message, kp1.privateKey);
    const valid = fipsVerify(message, signature, kp2.publicKey);
    expect(valid).toBe(false);
  });

  it('generates random salt', () => {
    const salt1 = fipsGenerateSalt();
    const salt2 = fipsGenerateSalt();
    expect(salt1).not.toBe(salt2);
    expect(salt1.length).toBe(64); // 32 bytes = 64 hex chars
  });

  it('generates salt of custom length', () => {
    const salt = fipsGenerateSalt(16);
    expect(salt.length).toBe(32); // 16 bytes = 32 hex chars
  });
});
