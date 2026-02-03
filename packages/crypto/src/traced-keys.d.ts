import { type KeyAlgorithm, type KeyPairResult } from './keys';
/**
 * Generate a new key pair (traced)
 *
 * @description
 * Generates a new Ed25519 or secp256k1 key pair. The operation is logged
 * but private keys are NEVER included in logs.
 */
export declare const tracedGenerateKeyPair: (algorithm?: KeyAlgorithm) => KeyPairResult;
/**
 * Derive public key from private key (traced)
 */
export declare const tracedDerivePublicKey: (privateKeyHex: string, algorithm?: KeyAlgorithm) => string;
/**
 * Validate a public key (traced)
 */
export declare const tracedIsValidPublicKey: (publicKeyHex: string, algorithm?: KeyAlgorithm) => boolean;
/**
 * Validate a private key (traced)
 */
export declare const tracedIsValidPrivateKey: (privateKeyHex: string) => boolean;
/**
 * Generate a key ID from public key (traced)
 */
export declare const tracedGenerateKeyId: (publicKeyHex: string) => string;
/**
 * Compress a public key (traced)
 */
export declare const tracedCompressPublicKey: (publicKeyHex: string) => string;
/**
 * Log a key lifecycle event for audit purposes
 */
export declare function logKeyEvent(event: {
    type: 'generated' | 'imported' | 'rotated' | 'revoked' | 'expired';
    keyId: string;
    algorithm: KeyAlgorithm;
    context?: string;
}): void;
//# sourceMappingURL=traced-keys.d.ts.map