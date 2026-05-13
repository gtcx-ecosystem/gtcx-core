import { createRequire } from 'node:module';
import path from 'node:path';

type NativeKeyPair = { privateKey: string; publicKey: string };

type NativeCrypto = {
  generateKeyPair: () => NativeKeyPair;
  sign: (message: Uint8Array, privateKeyHex: string) => string;
  verify: (signatureHex: string, message: Uint8Array, publicKeyHex: string) => boolean;
  sha256: (data: Uint8Array) => string;
  sha512: (data: Uint8Array) => string;
  blake3Hash?: (data: Uint8Array) => string;
  deriveChildKey?: (parentKeyHex: string, index: number) => string;
  derivePurposeKey?: (masterKeyHex: string, purpose: string) => string;
  version?: () => string;
};

export type Backend = 'native' | 'js';

let cached: NativeCrypto | null | undefined;

function isTruthy(value: unknown): boolean {
  if (!value) return false;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function canLoadNative(): boolean {
  return typeof process !== 'undefined' && !!process.versions?.node;
}

function tryLoadNative(): NativeCrypto | null {
  /* c8 ignore start — browser-only branch; not testable in Node environment */
  if (!canLoadNative()) {
    return null;
  }
  /* c8 ignore stop */

  /* c8 ignore start — ESM-only branch; require is always available in Node/Vitest */
  const req =
    typeof require === 'function'
      ? require
      : createRequire(path.join(process.cwd(), 'package.json'));
  /* c8 ignore stop */
  try {
    const mod = req('@gtcx/crypto-native') as NativeCrypto;
    /* c8 ignore start — defensive check for invalid module shape */
    if (!mod || typeof mod.generateKeyPair !== 'function') {
      return null;
    }
    /* c8 ignore stop */
    return mod;
    /* c8 ignore start — module unavailable in this environment */
  } catch {
    return null;
  }
  /* c8 ignore stop */
}

export function getNativeCrypto(): NativeCrypto | null {
  if (cached !== undefined) {
    return cached;
  }
  cached = tryLoadNative();
  const requireNative =
    typeof process !== 'undefined' && isTruthy(process.env['GTCX_REQUIRE_NATIVE']);
  /* c8 ignore start — requires mocking module load failure in Node */
  if (!cached && requireNative) {
    throw new Error('Native crypto bindings are required but could not be loaded.');
  }
  /* c8 ignore stop */
  return cached;
}

/* c8 ignore start — false branch requires mocking module load failure */
export function getBackend(): Backend {
  return getNativeCrypto() ? 'native' : 'js';
}
/* c8 ignore stop */

/**
 * Reset the native crypto cache.
 *
 * @internal
 * This is exported solely to support reliable testing of backend selection
 * and GTCX_REQUIRE_NATIVE enforcement. It should not be used in production.
 */
export function resetNativeCryptoCache(): void {
  cached = undefined;
}
