/**
 * FIPS-validated cryptographic backend using node:crypto.
 *
 * When GTCX_FIPS_MODE=true, this module routes signing and verification
 * through Node.js `crypto` module, which delegates to OpenSSL. When Node.js
 * is started with `--enable-fips`, OpenSSL uses its FIPS-validated provider
 * (CMVP Certificate #4282 or AWS-LC-FIPS #4631).
 *
 * Algorithm: ECDSA over P-256 (prime256v1) — FIPS 186-4, universally
 * supported by all FIPS-validated OpenSSL configurations.
 *
 * Key format:
 * - Private key: 32 bytes (hex-encoded, same as Ed25519/Secp256k1)
 * - Public key: 65 bytes uncompressed or 33 bytes compressed (hex-encoded)
 * - Signature: DER-encoded ECDSA signature (hex-encoded, variable length)
 */

import { createSign, createVerify, generateKeyPairSync, randomBytes } from 'node:crypto';

/**
 * Generate a FIPS-validated ECDSA P-256 key pair via node:crypto.
 *
 * Uses the OpenSSL backend (FIPS-validated when --enable-fips is active).
 */
export function fipsGenerateKeyPair(): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: { type: 'spki', format: 'der' },
    privateKeyEncoding: { type: 'pkcs8', format: 'der' },
  });

  return {
    publicKey: Buffer.from(publicKey).toString('hex'),
    privateKey: Buffer.from(privateKey).toString('hex'),
  };
}

/**
 * Sign a message using ECDSA P-256 via node:crypto.
 *
 * The signature is DER-encoded and returned as hex.
 */
export function fipsSign(message: Uint8Array, privateKeyDer: string): string {
  const keyBuffer = Buffer.from(privateKeyDer, 'hex');

  const signer = createSign('SHA256');
  signer.update(message);
  signer.end();

  const signature = signer.sign({
    key: keyBuffer,
    format: 'der',
    type: 'pkcs8',
  });

  return signature.toString('hex');
}

/**
 * Verify a signature using ECDSA P-256 via node:crypto.
 */
export function fipsVerify(
  message: Uint8Array,
  signatureHex: string,
  publicKeyDer: string
): boolean {
  const keyBuffer = Buffer.from(publicKeyDer, 'hex');
  const sigBuffer = Buffer.from(signatureHex, 'hex');

  const verifier = createVerify('SHA256');
  verifier.update(message);
  verifier.end();

  return verifier.verify(
    {
      key: keyBuffer,
      format: 'der',
      type: 'spki',
    },
    sigBuffer
  );
}

/**
 * Generate a FIPS-validated random salt via node:crypto.
 */
export function fipsGenerateSalt(length: number = 32): string {
  return randomBytes(length).toString('hex');
}
