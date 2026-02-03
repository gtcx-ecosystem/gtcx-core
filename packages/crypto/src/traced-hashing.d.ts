import { type HashAlgorithm } from './hashing';
/**
 * SHA-256 hash (traced)
 */
export declare const tracedHash256: (input: string | Uint8Array) => string;
/**
 * SHA-512 hash (traced)
 */
export declare const tracedHash512: (input: string | Uint8Array) => string;
/**
 * Generic hash with algorithm selection (traced)
 */
export declare const tracedHash: (input: string | Uint8Array, algorithm?: HashAlgorithm) => string;
/**
 * Hash a JavaScript object deterministically (traced)
 */
export declare const tracedHashObject: (obj: unknown) => string;
/**
 * Double SHA-256 (traced)
 */
export declare const tracedDoubleHash256: (input: string | Uint8Array) => string;
/**
 * Verify a hash matches expected value (traced)
 */
export declare const tracedVerifyHashValue: (input: string | Uint8Array, expectedHash: string, algorithm?: HashAlgorithm) => boolean;
/**
 * Create a commitment (hash of value + salt) (traced)
 */
export declare const tracedCreateCommitment: (value: string, salt: string) => string;
/**
 * Verify a commitment (traced)
 */
export declare const tracedVerifyCommitment: (value: string, salt: string, commitment: string) => boolean;
/**
 * Generate cryptographic salt (traced)
 */
export declare const tracedGenerateSalt: (length?: number) => string;
/**
 * Combine multiple hashes into one (traced)
 */
export declare const tracedCombineHashes: (...hashes: string[]) => string;
//# sourceMappingURL=traced-hashing.d.ts.map