"use strict";
// ============================================================================
// TRACED KEY OPERATIONS
// Key generation and derivation with operation logging
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracedCompressPublicKey = exports.tracedGenerateKeyId = exports.tracedIsValidPrivateKey = exports.tracedIsValidPublicKey = exports.tracedDerivePublicKey = exports.tracedGenerateKeyPair = void 0;
exports.logKeyEvent = logKeyEvent;
const ai_1 = require("@gtcx/ai");
const keys_1 = require("./keys");
const cryptoLog = (0, ai_1.createCategoryLogger)('crypto');
// ============================================================================
// TRACED KEY OPERATIONS
// ============================================================================
/**
 * Generate a new key pair (traced)
 *
 * @description
 * Generates a new Ed25519 or secp256k1 key pair. The operation is logged
 * but private keys are NEVER included in logs.
 */
exports.tracedGenerateKeyPair = (0, ai_1.traced)((algorithm = 'Ed25519') => {
    return (0, keys_1.generateKeyPair)(algorithm);
}, 'crypto.generateKeyPair', {
    category: 'crypto',
    logInput: true,
    logOutput: false, // Never log key material
    sanitizeOutput: (output) => {
        const result = output;
        return {
            algorithm: result.algorithm,
            publicKeyLength: result.publicKey.length,
        };
    },
});
/**
 * Derive public key from private key (traced)
 */
exports.tracedDerivePublicKey = (0, ai_1.traced)((privateKeyHex, algorithm = 'Ed25519') => {
    return (0, keys_1.derivePublicKey)(privateKeyHex, algorithm);
}, 'crypto.derivePublicKey', {
    category: 'crypto',
    logInput: false, // Never log private keys
    logOutput: false, // Don't log public keys either
    sanitizeOutput: (output) => {
        const publicKey = output;
        return {
            publicKeyLength: publicKey.length,
        };
    },
});
/**
 * Validate a public key (traced)
 */
exports.tracedIsValidPublicKey = (0, ai_1.traced)((publicKeyHex, algorithm = 'Ed25519') => {
    return (0, keys_1.isValidPublicKey)(publicKeyHex, algorithm);
}, 'crypto.isValidPublicKey', {
    category: 'crypto',
    logInput: false,
    logOutput: true, // Log valid/invalid
});
/**
 * Validate a private key (traced)
 */
exports.tracedIsValidPrivateKey = (0, ai_1.traced)((privateKeyHex) => {
    return (0, keys_1.isValidPrivateKey)(privateKeyHex);
}, 'crypto.isValidPrivateKey', {
    category: 'crypto',
    logInput: false, // Never log private keys
    logOutput: true,
});
/**
 * Generate a key ID from public key (traced)
 */
exports.tracedGenerateKeyId = (0, ai_1.traced)((publicKeyHex) => {
    return (0, keys_1.generateKeyId)(publicKeyHex);
}, 'crypto.generateKeyId', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    sanitizeOutput: (output) => {
        const keyId = output;
        return {
            keyIdPrefix: keyId.slice(0, 8) + '...',
        };
    },
});
/**
 * Compress a public key (traced)
 */
exports.tracedCompressPublicKey = (0, ai_1.traced)((publicKeyHex) => {
    return (0, keys_1.compressPublicKey)(publicKeyHex);
}, 'crypto.compressPublicKey', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
});
// ============================================================================
// KEY LIFECYCLE LOGGING
// ============================================================================
/**
 * Log a key lifecycle event for audit purposes
 */
function logKeyEvent(event) {
    cryptoLog.info(`key.${event.type}`, {
        keyIdPrefix: event.keyId.slice(0, 8) + '...',
        algorithm: event.algorithm,
        context: event.context,
    });
}
//# sourceMappingURL=traced-keys.js.map