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
  if (!canLoadNative()) {
    /* c8 ignore next */
    return null;
  }

  const req =
    typeof require === 'function'
      ? require
      : createRequire(path.join(process.cwd(), 'package.json'));
  try {
    const mod = req('@gtcx/crypto-native') as NativeCrypto;
    if (!mod || typeof mod.generateKeyPair !== 'function') {
      /* c8 ignore next */
      return null;
    }
    return mod;
  } catch {
    /* c8 ignore next */
    return null;
  }
}

export function getNativeCrypto(): NativeCrypto | null {
  if (cached !== undefined) {
    return cached;
  }
  cached = tryLoadNative();
  const requireNative =
    typeof process !== 'undefined' && isTruthy(process.env['GTCX_REQUIRE_NATIVE']);
  if (!cached && requireNative) {
    /* c8 ignore next */
    throw new Error('Native crypto bindings are required but could not be loaded.');
  }
  return cached;
}

export function getBackend(): Backend {
  return getNativeCrypto() ? 'native' : 'js';
}

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
