// ============================================================================
// DIGITAL SIGNATURES
// Ed25519 signing and verification
// ============================================================================

import { ed25519 } from '@noble/curves/ed25519.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

import { isFipsMode } from './fips';
import { fipsSign, fipsVerify } from './fips-backend';
import { deepSortKeys } from './hashing';
import { getNativeCrypto } from './native-loader';

export interface SignatureResult {
  signature: string;
  publicKey: string;
  message: string;
  timestamp: number;
}

export interface VerificationResult {
  valid: boolean;
  publicKey: string;
  error?: string | undefined;
}

/**
 * Securely wipe a buffer by filling it with zeros.
 */
export function secureWipe(buffer: Uint8Array): void {
  buffer.fill(0);
}

/**
 * Sign a message.
 *
 * In FIPS mode with P256 keys (DER-encoded), routes through node:crypto
 * which delegates to the OpenSSL FIPS provider. Otherwise uses Ed25519
 * via native bindings or noble-curves.
 *
 * @param message - The message to sign
 * @param privateKeyHex - Hex-encoded private key (raw Ed25519 or DER P256)
 * @param options - Optional: `{ algorithm: 'P256' }` to force FIPS backend
 */
export function sign(
  message: string | Uint8Array,
  privateKeyHex: string,
  options?: { algorithm?: 'Ed25519' | 'P256' }
): string {
  const messageBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;

  // FIPS backend: node:crypto ECDSA P-256
  if (options?.algorithm === 'P256' || (isFipsMode() && options?.algorithm !== 'Ed25519')) {
    return fipsSign(messageBytes, privateKeyHex);
  }

  // Native Rust backend (Ed25519)
  const native = getNativeCrypto();
  if (native) {
    return native.sign(messageBytes, privateKeyHex);
  }

  // Pure JS fallback (Ed25519 via noble-curves).
  // This path is unreachable in test environments where native bindings
  // are always available. It is the degradation path for misconfigured
  // deployments missing the native module.
  /* v8 ignore start -- pure-JS fallback; unreachable when native crypto is available */
  const privateKey = hexToBytes(privateKeyHex);

  try {
    const signature = ed25519.sign(messageBytes, privateKey);
    return bytesToHex(signature);
  } finally {
    secureWipe(privateKey);
  }
  /* v8 ignore stop */
}

/**
 * Sign a hash directly
 */
export function signHash(hash: string, privateKeyHex: string): string {
  const hashBytes = hexToBytes(hash);
  const native = getNativeCrypto();
  if (native) {
    return native.sign(hashBytes, privateKeyHex);
  }

  /* v8 ignore start -- pure-JS fallback; unreachable when native crypto is available */
  const privateKey = hexToBytes(privateKeyHex);

  try {
    const signature = ed25519.sign(hashBytes, privateKey);
    return bytesToHex(signature);
  } finally {
    secureWipe(privateKey);
  }
  /* v8 ignore stop */
}

/**
 * Verify a signature.
 *
 * In FIPS mode with P256 keys, routes through node:crypto.
 *
 * @param options - Optional: `{ algorithm: 'P256' }` to force FIPS backend
 */
export function verify(
  message: string | Uint8Array,
  signatureHex: string,
  publicKeyHex: string,
  options?: { algorithm?: 'Ed25519' | 'P256' }
): boolean {
  try {
    const messageBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;

    // FIPS backend: node:crypto ECDSA P-256
    if (options?.algorithm === 'P256' || (isFipsMode() && options?.algorithm !== 'Ed25519')) {
      return fipsVerify(messageBytes, signatureHex, publicKeyHex);
    }

    // Native Rust backend (Ed25519)
    const native = getNativeCrypto();
    if (native) {
      return native.verify(signatureHex, messageBytes, publicKeyHex);
    }

    /* v8 ignore start -- pure-JS fallback; unreachable when native crypto is available */
    const signature = hexToBytes(signatureHex);
    const publicKey = hexToBytes(publicKeyHex);

    return ed25519.verify(signature, messageBytes, publicKey);
    /* v8 ignore stop */
  } catch (error) {
    // Surface programming errors; only swallow signature validation failures
    /* c8 ignore next -- requires TypeError/RangeError from verify internals; edge case */
    if (error instanceof TypeError || error instanceof RangeError) throw error;
    return false;
  }
}

/**
 * Verify a signature against a hash
 */
export function verifyHash(hashHex: string, signatureHex: string, publicKeyHex: string): boolean {
  try {
    const hash = hexToBytes(hashHex);
    const native = getNativeCrypto();
    if (native) {
      return native.verify(signatureHex, hash, publicKeyHex);
    }

    /* v8 ignore start -- pure-JS fallback; unreachable when native crypto is available */
    const signature = hexToBytes(signatureHex);
    const publicKey = hexToBytes(publicKeyHex);

    return ed25519.verify(signature, hash, publicKey);
    /* v8 ignore stop */
  } catch (error) {
    // Surface programming errors; only swallow signature validation failures
    if (error instanceof TypeError || error instanceof RangeError) throw error;
    return false;
  }
}

/**
 * Create a complete signed message object
 */
export function createSignedMessage(
  data: unknown,
  privateKeyHex: string,
  publicKeyHex: string
): SignatureResult {
  const message = typeof data === 'string' ? data : JSON.stringify(deepSortKeys(data));

  const signature = sign(message, privateKeyHex);

  return {
    signature,
    publicKey: publicKeyHex,
    message,
    timestamp: Date.now(),
  };
}

/**
 * Verify a signed message object
 */
export function verifySignedMessage(signedMessage: SignatureResult): VerificationResult {
  const isValid = verify(signedMessage.message, signedMessage.signature, signedMessage.publicKey);

  return {
    valid: isValid,
    publicKey: signedMessage.publicKey,
    error: isValid ? undefined : 'Invalid signature',
  };
}

/**
 * Batch verify multiple signatures
 */
export function batchVerify(
  items: Array<{
    message: string | Uint8Array;
    signature: string;
    publicKey: string;
  }>
): boolean[] {
  return items.map((item) => verify(item.message, item.signature, item.publicKey));
}
