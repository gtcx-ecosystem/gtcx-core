"use strict";
// ============================================================================
// TRACED HASHING OPERATIONS
// SHA-256/512 hashing with operation logging
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracedCombineHashes = exports.tracedGenerateSalt = exports.tracedVerifyCommitment = exports.tracedCreateCommitment = exports.tracedVerifyHashValue = exports.tracedDoubleHash256 = exports.tracedHashObject = exports.tracedHash = exports.tracedHash512 = exports.tracedHash256 = void 0;
const ai_1 = require("@gtcx/ai");
const hashing_1 = require("./hashing");
// ============================================================================
// TRACED HASHING OPERATIONS
// ============================================================================
/**
 * SHA-256 hash (traced)
 */
exports.tracedHash256 = (0, ai_1.traced)((input) => (0, hashing_1.hash256)(input), 'crypto.hash256', {
    category: 'crypto',
    logInput: false,
    logOutput: false, // Hashes can be sensitive
    metadata: { algorithm: 'SHA-256' },
});
/**
 * SHA-512 hash (traced)
 */
exports.tracedHash512 = (0, ai_1.traced)((input) => (0, hashing_1.hash512)(input), 'crypto.hash512', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    metadata: { algorithm: 'SHA-512' },
});
/**
 * Generic hash with algorithm selection (traced)
 */
exports.tracedHash = (0, ai_1.traced)((input, algorithm = 'sha256') => (0, hashing_1.hash)(input, algorithm), 'crypto.hash', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
});
/**
 * Hash a JavaScript object deterministically (traced)
 */
exports.tracedHashObject = (0, ai_1.traced)((obj) => (0, hashing_1.hashObject)(obj), 'crypto.hashObject', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
});
/**
 * Double SHA-256 (traced)
 */
exports.tracedDoubleHash256 = (0, ai_1.traced)((input) => (0, hashing_1.doubleHash256)(input), 'crypto.doubleHash256', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    metadata: { algorithm: 'SHA-256-double' },
});
/**
 * Verify a hash matches expected value (traced)
 */
exports.tracedVerifyHashValue = (0, ai_1.traced)((input, expectedHash, algorithm = 'sha256') => (0, hashing_1.verifyHash)(input, expectedHash, algorithm), 'crypto.verifyHashValue', {
    category: 'crypto',
    logInput: false,
    logOutput: true, // Log success/failure
});
/**
 * Create a commitment (hash of value + salt) (traced)
 */
exports.tracedCreateCommitment = (0, ai_1.traced)((value, salt) => (0, hashing_1.createCommitment)(value, salt), 'crypto.createCommitment', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
});
/**
 * Verify a commitment (traced)
 */
exports.tracedVerifyCommitment = (0, ai_1.traced)((value, salt, commitment) => (0, hashing_1.verifyCommitment)(value, salt, commitment), 'crypto.verifyCommitment', {
    category: 'crypto',
    logInput: false,
    logOutput: true,
});
/**
 * Generate cryptographic salt (traced)
 */
exports.tracedGenerateSalt = (0, ai_1.traced)((length = 32) => (0, hashing_1.generateSalt)(length), 'crypto.generateSalt', {
    category: 'crypto',
    logInput: true,
    logOutput: false, // Never log salt values
    metadata: { purpose: 'salt-generation' },
});
/**
 * Combine multiple hashes into one (traced)
 */
exports.tracedCombineHashes = (0, ai_1.traced)((...hashes) => (0, hashing_1.combineHashes)(...hashes), 'crypto.combineHashes', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    sanitizeInput: (input) => {
        const args = input;
        return {
            hashCount: args.length,
        };
    },
});
//# sourceMappingURL=traced-hashing.js.map