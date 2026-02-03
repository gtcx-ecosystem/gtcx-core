"use strict";
// ============================================================================
// HASHING UTILITIES
// SHA-256 and other hash functions
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash256 = hash256;
exports.hash512 = hash512;
exports.hash = hash;
exports.hashObject = hashObject;
exports.doubleHash256 = doubleHash256;
exports.verifyHash = verifyHash;
exports.createCommitment = createCommitment;
exports.verifyCommitment = verifyCommitment;
exports.generateSalt = generateSalt;
exports.combineHashes = combineHashes;
const sha256_1 = require("@noble/hashes/sha256");
const sha512_1 = require("@noble/hashes/sha512");
const utils_1 = require("@noble/hashes/utils");
/**
 * Hash data using SHA-256
 */
function hash256(data) {
    const bytes = typeof data === 'string'
        ? new TextEncoder().encode(data)
        : data;
    return (0, utils_1.bytesToHex)((0, sha256_1.sha256)(bytes));
}
/**
 * Hash data using SHA-512
 */
function hash512(data) {
    const bytes = typeof data === 'string'
        ? new TextEncoder().encode(data)
        : data;
    return (0, utils_1.bytesToHex)((0, sha512_1.sha512)(bytes));
}
/**
 * Hash with specified algorithm
 */
function hash(data, algorithm = 'sha256') {
    switch (algorithm) {
        case 'sha256':
            return hash256(data);
        case 'sha512':
            return hash512(data);
        default:
            throw new Error(`Unsupported hash algorithm: ${algorithm}`);
    }
}
/**
 * Hash a JSON object (deterministic)
 */
function hashObject(obj) {
    const sortedJson = JSON.stringify(obj, Object.keys(obj).sort());
    return hash256(sortedJson);
}
/**
 * Double hash (hash of hash) - common in blockchain
 */
function doubleHash256(data) {
    const firstHash = (0, sha256_1.sha256)(typeof data === 'string' ? new TextEncoder().encode(data) : data);
    return (0, utils_1.bytesToHex)((0, sha256_1.sha256)(firstHash));
}
/**
 * Verify a hash matches expected value
 */
function verifyHash(data, expectedHash, algorithm = 'sha256') {
    const computedHash = hash(data, algorithm);
    return computedHash === expectedHash.toLowerCase();
}
/**
 * Create a commitment (hash with salt)
 */
function createCommitment(data, salt) {
    return hash256(`${salt}:${data}`);
}
/**
 * Verify a commitment
 */
function verifyCommitment(data, salt, commitment) {
    const computed = createCommitment(data, salt);
    return computed === commitment.toLowerCase();
}
/**
 * Generate a random salt
 */
function generateSalt(length = 32) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return (0, utils_1.bytesToHex)(bytes);
}
/**
 * Combine multiple hashes into one
 */
function combineHashes(...hashes) {
    const combined = hashes.sort().join('');
    return hash256(combined);
}
//# sourceMappingURL=hashing.js.map