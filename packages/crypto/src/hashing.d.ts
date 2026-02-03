export type HashAlgorithm = 'sha256' | 'sha512';
/**
 * Hash data using SHA-256
 */
export declare function hash256(data: string | Uint8Array): string;
/**
 * Hash data using SHA-512
 */
export declare function hash512(data: string | Uint8Array): string;
/**
 * Hash with specified algorithm
 */
export declare function hash(data: string | Uint8Array, algorithm?: HashAlgorithm): string;
/**
 * Hash a JSON object (deterministic)
 */
export declare function hashObject(obj: unknown): string;
/**
 * Double hash (hash of hash) - common in blockchain
 */
export declare function doubleHash256(data: string | Uint8Array): string;
/**
 * Verify a hash matches expected value
 */
export declare function verifyHash(data: string | Uint8Array, expectedHash: string, algorithm?: HashAlgorithm): boolean;
/**
 * Create a commitment (hash with salt)
 */
export declare function createCommitment(data: string, salt: string): string;
/**
 * Verify a commitment
 */
export declare function verifyCommitment(data: string, salt: string, commitment: string): boolean;
/**
 * Generate a random salt
 */
export declare function generateSalt(length?: number): string;
/**
 * Combine multiple hashes into one
 */
export declare function combineHashes(...hashes: string[]): string;
//# sourceMappingURL=hashing.d.ts.map