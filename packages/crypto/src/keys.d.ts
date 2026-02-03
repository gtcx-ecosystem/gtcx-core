export type KeyAlgorithm = 'Ed25519' | 'Secp256k1';
export interface KeyPairResult {
    publicKey: string;
    privateKey: string;
    algorithm: KeyAlgorithm;
}
export interface DerivedKey {
    key: string;
    path: string;
    index: number;
}
/**
 * Generate a new key pair
 * @param algorithm - 'Ed25519' (default) or 'Secp256k1'
 */
export declare function generateKeyPair(algorithm?: KeyAlgorithm): KeyPairResult;
/**
 * Derive public key from private key
 */
export declare function derivePublicKey(privateKeyHex: string, algorithm?: KeyAlgorithm): string;
/**
 * Validate a public key format
 */
export declare function isValidPublicKey(publicKeyHex: string, algorithm?: KeyAlgorithm): boolean;
/**
 * Validate a private key format
 */
export declare function isValidPrivateKey(privateKeyHex: string): boolean;
/**
 * Generate a deterministic key ID from public key
 */
export declare function generateKeyId(publicKeyHex: string): string;
/**
 * Convert key to different formats
 */
export declare const keyFormats: {
    toBytes: (hex: string) => Uint8Array;
    toHex: (bytes: Uint8Array) => string;
    toBase64: (hex: string) => string;
    fromBase64: (base64: string) => string;
};
/**
 * Get the expected public key length for an algorithm
 */
export declare function getPublicKeyLength(algorithm: KeyAlgorithm): number;
/**
 * Compress a Secp256k1 public key
 */
export declare function compressPublicKey(publicKeyHex: string): string;
//# sourceMappingURL=keys.d.ts.map