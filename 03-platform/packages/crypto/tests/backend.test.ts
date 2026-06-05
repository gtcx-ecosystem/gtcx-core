import { describe, expect, it, beforeEach } from 'vitest';

import { getBackend, getNativeCrypto, resetNativeCryptoCache } from '../src/native-loader';

describe('crypto backend selection — native available', () => {
  beforeEach(() => {
    resetNativeCryptoCache();
  });

  it('uses native when bindings are available', () => {
    expect(getBackend()).toBe('native');
  });

  it('does not throw when GTCX_REQUIRE_NATIVE is unset', () => {
    const originalEnv = process.env['GTCX_REQUIRE_NATIVE'];
    delete process.env['GTCX_REQUIRE_NATIVE'];

    try {
      expect(() => getNativeCrypto()).not.toThrow();
    } finally {
      if (originalEnv !== undefined) {
        process.env['GTCX_REQUIRE_NATIVE'] = originalEnv;
      }
    }
  });

  it('returns native bindings when available and GTCX_REQUIRE_NATIVE=true', () => {
    const originalEnv = process.env['GTCX_REQUIRE_NATIVE'];
    process.env['GTCX_REQUIRE_NATIVE'] = 'true';

    try {
      const native = getNativeCrypto();
      expect(native).not.toBeNull();
      expect(native).toHaveProperty('generateKeyPair');
      expect(native).toHaveProperty('sign');
      expect(native).toHaveProperty('verify');
    } finally {
      process.env['GTCX_REQUIRE_NATIVE'] = originalEnv;
    }
  });
});
