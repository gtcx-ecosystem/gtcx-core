// ============================================================================
// DIGITAL SIGNATURES
// Ed25519 signing and verification
// ============================================================================

import { ed25519 } from '@noble/curves/ed25519';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

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
  error?: string;
}

/**
 * Securely wipe a buffer by filling it with zeros.
 */
export function secureWipe(buffer: Uint8Array): void {
  buffer.fill(0);
}

/**
 * Sign a message with Ed25519
 */
export function sign(message: string | Uint8Array, privateKeyHex: string): string {
  const messageBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;
  const native = getNativeCrypto();
  if (native) {
    return native.sign(messageBytes, privateKeyHex);
  }

  const privateKey = hexToBytes(privateKeyHex);

  try {
    const signature = ed25519.sign(messageBytes, privateKey);
    return bytesToHex(signature);
  } finally {
    secureWipe(privateKey);
  }
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

  const privateKey = hexToBytes(privateKeyHex);

  try {
    const signature = ed25519.sign(hashBytes, privateKey);
    return bytesToHex(signature);
  } finally {
    secureWipe(privateKey);
  }
}

/**
 * Verify a signature
 */
export function verify(
  message: string | Uint8Array,
  signatureHex: string,
  publicKeyHex: string
): boolean {
  try {
    const messageBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;
    const native = getNativeCrypto();
    if (native) {
      return native.verify(signatureHex, messageBytes, publicKeyHex);
    }

    const signature = hexToBytes(signatureHex);
    const publicKey = hexToBytes(publicKeyHex);

    return ed25519.verify(signature, messageBytes, publicKey);
  } catch {
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

    const signature = hexToBytes(signatureHex);
    const publicKey = hexToBytes(publicKeyHex);

    return ed25519.verify(signature, hash, publicKey);
  } catch {
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
