type KeyAlgorithm = 'Ed25519' | 'Secp256k1';
interface KeyPairResult {
    publicKey: string;
    privateKey: string;
    algorithm: KeyAlgorithm;
}
interface DerivedKey {
    key: string;
    path: string;
    index: number;
}
/**
 * Generate a new key pair
 * @param algorithm - 'Ed25519' (default) or 'Secp256k1'
 */
declare function generateKeyPair(algorithm?: KeyAlgorithm): KeyPairResult;
/**
 * Derive public key from private key
 */
declare function derivePublicKey(privateKeyHex: string, algorithm?: KeyAlgorithm): string;
/**
 * Validate a public key format
 */
declare function isValidPublicKey(publicKeyHex: string, algorithm?: KeyAlgorithm): boolean;
/**
 * Validate a private key format
 */
declare function isValidPrivateKey(privateKeyHex: string): boolean;
/**
 * Generate a deterministic key ID from public key
 */
declare function generateKeyId(publicKeyHex: string): string;
/**
 * Convert key to different formats
 */
declare const keyFormats: {
    toBytes: (hex: string) => Uint8Array;
    toHex: (bytes: Uint8Array) => string;
    toBase64: (hex: string) => string;
    fromBase64: (base64: string) => string;
};
/**
 * Get the expected public key length for an algorithm
 */
declare function getPublicKeyLength(algorithm: KeyAlgorithm): number;
/**
 * Compress a Secp256k1 public key
 */
declare function compressPublicKey(publicKeyHex: string): string;

interface SignatureResult {
    signature: string;
    publicKey: string;
    message: string;
    timestamp: number;
}
interface VerificationResult {
    valid: boolean;
    publicKey: string;
    error?: string;
}
/**
 * Sign a message with Ed25519
 */
declare function sign(message: string | Uint8Array, privateKeyHex: string): string;
/**
 * Sign a hash directly
 */
declare function signHash(hash: string, privateKeyHex: string): string;
/**
 * Verify a signature
 */
declare function verify(message: string | Uint8Array, signatureHex: string, publicKeyHex: string): boolean;
/**
 * Verify a signature against a hash
 */
declare function verifyHash$1(hashHex: string, signatureHex: string, publicKeyHex: string): boolean;
/**
 * Create a complete signed message object
 */
declare function createSignedMessage(data: unknown, privateKeyHex: string, publicKeyHex: string): SignatureResult;
/**
 * Verify a signed message object
 */
declare function verifySignedMessage(signedMessage: SignatureResult): VerificationResult;
/**
 * Batch verify multiple signatures
 */
declare function batchVerify(items: Array<{
    message: string | Uint8Array;
    signature: string;
    publicKey: string;
}>): boolean[];

type HashAlgorithm = 'sha256' | 'sha512';
/**
 * Hash data using SHA-256
 */
declare function hash256(data: string | Uint8Array): string;
/**
 * Hash data using SHA-512
 */
declare function hash512(data: string | Uint8Array): string;
/**
 * Hash with specified algorithm
 */
declare function hash(data: string | Uint8Array, algorithm?: HashAlgorithm): string;
/**
 * Hash a JSON object (deterministic)
 */
declare function hashObject(obj: unknown): string;
/**
 * Double hash (hash of hash) - common in blockchain
 */
declare function doubleHash256(data: string | Uint8Array): string;
/**
 * Verify a hash matches expected value
 */
declare function verifyHash(data: string | Uint8Array, expectedHash: string, algorithm?: HashAlgorithm): boolean;
/**
 * Create a commitment (hash with salt)
 */
declare function createCommitment(data: string, salt: string): string;
/**
 * Verify a commitment
 */
declare function verifyCommitment(data: string, salt: string, commitment: string): boolean;
/**
 * Generate a random salt
 */
declare function generateSalt(length?: number): string;
/**
 * Combine multiple hashes into one
 */
declare function combineHashes(...hashes: string[]): string;

interface MerkleProof {
    root: string;
    leaf: string;
    leafIndex: number;
    siblings: Array<{
        hash: string;
        position: 'left' | 'right';
    }>;
}
interface MerkleTree {
    root: string;
    leaves: string[];
    layers: string[][];
}
/**
 * Build a Merkle tree from data items
 */
declare function buildMerkleTree(items: string[]): MerkleTree;
/**
 * Generate a proof for a leaf at given index
 */
declare function generateMerkleProof(tree: MerkleTree, leafIndex: number): MerkleProof;
/**
 * Verify a Merkle proof
 */
declare function verifyMerkleProof(proof: MerkleProof): boolean;
/**
 * Create an inclusion proof for specific data
 */
declare function createInclusionProof(data: string, allData: string[]): MerkleProof | null;
/**
 * Verify data is included in a set with given root
 */
declare function verifyInclusion(data: string, proof: MerkleProof): boolean;
/**
 * Batch verify multiple proofs
 */
declare function batchVerifyProofs(proofs: MerkleProof[]): boolean[];
/**
 * Compute root from leaf and proof (without full verification)
 */
declare function computeRootFromProof(proof: Omit<MerkleProof, 'root'>): string;

/**
 * Sign a message with Ed25519 (traced)
 *
 * @description
 * Traced version of sign() that logs operation details for debugging
 * and AI analysis. Does NOT log the private key or full message content.
 *
 * @param message - Message to sign
 * @param privateKeyHex - Private key in hex format
 * @returns Signature in hex format
 */
declare const tracedSign: (message: string | Uint8Array, privateKeyHex: string) => string;
/**
 * Sign a hash directly (traced)
 */
declare const tracedSignHash: (hash: string, privateKeyHex: string) => string;
/**
 * Verify a signature (traced)
 *
 * @description
 * Traced version that logs verification attempts. Useful for debugging
 * failed verifications and analyzing verification patterns.
 */
declare const tracedVerify: (message: string | Uint8Array, signatureHex: string, publicKeyHex: string) => boolean;
/**
 * Verify a signature against a hash (traced)
 */
declare const tracedVerifyHash: (hashHex: string, signatureHex: string, publicKeyHex: string) => boolean;
/**
 * Create a complete signed message object (traced)
 */
declare const tracedCreateSignedMessage: (data: unknown, privateKeyHex: string, publicKeyHex: string) => SignatureResult;
/**
 * Verify a signed message object (traced)
 */
declare const tracedVerifySignedMessage: (signedMessage: SignatureResult) => VerificationResult;
/**
 * Batch verify multiple signatures (traced)
 */
declare const tracedBatchVerify: (items: Array<{
    message: string | Uint8Array;
    signature: string;
    publicKey: string;
}>) => boolean[];
/**
 * Log a signing operation for audit purposes
 */
declare function logSigningOperation(metadata: {
    operation: 'sign' | 'verify';
    publicKeyId?: string;
    success: boolean;
    context?: string;
}): void;

/**
 * SHA-256 hash (traced)
 */
declare const tracedHash256: (input: string | Uint8Array) => string;
/**
 * SHA-512 hash (traced)
 */
declare const tracedHash512: (input: string | Uint8Array) => string;
/**
 * Generic hash with algorithm selection (traced)
 */
declare const tracedHash: (input: string | Uint8Array, algorithm?: HashAlgorithm) => string;
/**
 * Hash a JavaScript object deterministically (traced)
 */
declare const tracedHashObject: (obj: unknown) => string;
/**
 * Double SHA-256 (traced)
 */
declare const tracedDoubleHash256: (input: string | Uint8Array) => string;
/**
 * Verify a hash matches expected value (traced)
 */
declare const tracedVerifyHashValue: (input: string | Uint8Array, expectedHash: string, algorithm?: HashAlgorithm) => boolean;
/**
 * Create a commitment (hash of value + salt) (traced)
 */
declare const tracedCreateCommitment: (value: string, salt: string) => string;
/**
 * Verify a commitment (traced)
 */
declare const tracedVerifyCommitment: (value: string, salt: string, commitment: string) => boolean;
/**
 * Generate cryptographic salt (traced)
 */
declare const tracedGenerateSalt: (length?: number) => string;
/**
 * Combine multiple hashes into one (traced)
 */
declare const tracedCombineHashes: (...hashes: string[]) => string;

/**
 * Generate a new key pair (traced)
 *
 * @description
 * Generates a new Ed25519 or secp256k1 key pair. The operation is logged
 * but private keys are NEVER included in logs.
 */
declare const tracedGenerateKeyPair: (algorithm?: KeyAlgorithm) => KeyPairResult;
/**
 * Derive public key from private key (traced)
 */
declare const tracedDerivePublicKey: (privateKeyHex: string, algorithm?: KeyAlgorithm) => string;
/**
 * Validate a public key (traced)
 */
declare const tracedIsValidPublicKey: (publicKeyHex: string, algorithm?: KeyAlgorithm) => boolean;
/**
 * Validate a private key (traced)
 */
declare const tracedIsValidPrivateKey: (privateKeyHex: string) => boolean;
/**
 * Generate a key ID from public key (traced)
 */
declare const tracedGenerateKeyId: (publicKeyHex: string) => string;
/**
 * Compress a public key (traced)
 */
declare const tracedCompressPublicKey: (publicKeyHex: string) => string;
/**
 * Log a key lifecycle event for audit purposes
 */
declare function logKeyEvent(event: {
    type: 'generated' | 'imported' | 'rotated' | 'revoked' | 'expired';
    keyId: string;
    algorithm: KeyAlgorithm;
    context?: string;
}): void;

export { type DerivedKey, type HashAlgorithm, type KeyAlgorithm, type KeyPairResult, type MerkleProof, type MerkleTree, type SignatureResult, type VerificationResult, batchVerify, batchVerifyProofs, buildMerkleTree, combineHashes, compressPublicKey, computeRootFromProof, createCommitment, createInclusionProof, createSignedMessage, derivePublicKey, doubleHash256, generateKeyId, generateKeyPair, generateMerkleProof, generateSalt, getPublicKeyLength, hash, hash256, hash512, hashObject, isValidPrivateKey, isValidPublicKey, keyFormats, logKeyEvent, logSigningOperation, sign, signHash, tracedBatchVerify, tracedCombineHashes, tracedCompressPublicKey, tracedCreateCommitment, tracedCreateSignedMessage, tracedDerivePublicKey, tracedDoubleHash256, tracedGenerateKeyId, tracedGenerateKeyPair, tracedGenerateSalt, tracedHash, tracedHash256, tracedHash512, tracedHashObject, tracedIsValidPrivateKey, tracedIsValidPublicKey, tracedSign, tracedSignHash, tracedVerify, tracedVerifyCommitment, tracedVerifyHash, tracedVerifyHashValue, tracedVerifySignedMessage, verify, verifyCommitment, verifyHash$1 as verifyHash, verifyHash as verifyHashValue, verifyInclusion, verifyMerkleProof, verifySignedMessage };
