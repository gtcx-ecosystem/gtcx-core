import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { getBackend, getNativeCrypto, resetNativeCryptoCache } from '../src/native-loader';

describe('native-loader', () => {
  beforeEach(() => {
    resetNativeCryptoCache();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetNativeCryptoCache();
  });

  it('getBackend returns "native" when native is available', () => {
    expect(getBackend()).toBe('native');
  });

  it('getNativeCrypto returns a module when native is available', () => {
    const native = getNativeCrypto();
    expect(native).not.toBeNull();
    expect(typeof native?.generateKeyPair).toBe('function');
  });

  it('getNativeCrypto caches the result', () => {
    const first = getNativeCrypto();
    const second = getNativeCrypto();
    expect(first).toBe(second);
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is set and native IS available', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', '1');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
    expect(getNativeCrypto()).not.toBeNull();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is unset', () => {
    expect(() => getNativeCrypto()).not.toThrow();
    expect(getNativeCrypto()).not.toBeNull();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is empty string', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', '');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is "0"', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', '0');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is "false"', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', 'false');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is "no"', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', 'no');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is "off"', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', 'off');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is "TRUE" (uppercase)', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', 'TRUE');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is "YES" (uppercase)', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', 'YES');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is "ON" (uppercase)', () => {
    vi.stubEnv('GTCX_REQUIRE_NATIVE', 'ON');
    resetNativeCryptoCache();
    expect(() => getNativeCrypto()).not.toThrow();
  });
});
