"use strict";
// ============================================================================
// TRACED DIGITAL SIGNATURES
// Ed25519 signing and verification with operation logging
// ============================================================================
//
// This module provides traced versions of all signing operations for:
// - Debugging complex verification workflows
// - Training AI models on operational data
// - Audit trails for compliance
// - Performance optimization
//
// Usage:
//   import { tracedSign, tracedVerify } from '@gtcx/crypto/traced';
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracedBatchVerify = exports.tracedVerifySignedMessage = exports.tracedCreateSignedMessage = exports.tracedVerifyHash = exports.tracedVerify = exports.tracedSignHash = exports.tracedSign = void 0;
exports.logSigningOperation = logSigningOperation;
const ai_1 = require("@gtcx/ai");
const signing_1 = require("./signing");
// Create crypto-specific logger
const cryptoLog = (0, ai_1.createCategoryLogger)('crypto');
// ============================================================================
// TRACED SIGNING OPERATIONS
// ============================================================================
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
exports.tracedSign = (0, ai_1.traced)((message, privateKeyHex) => {
    return (0, signing_1.sign)(message, privateKeyHex);
}, 'crypto.sign', {
    category: 'crypto',
    logInput: false, // Never log private keys
    logOutput: false, // Don't log signatures (could be sensitive)
    metadata: { algorithm: 'Ed25519' },
});
/**
 * Sign a hash directly (traced)
 */
exports.tracedSignHash = (0, ai_1.traced)((hash, privateKeyHex) => {
    return (0, signing_1.signHash)(hash, privateKeyHex);
}, 'crypto.signHash', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    metadata: { algorithm: 'Ed25519' },
});
/**
 * Verify a signature (traced)
 *
 * @description
 * Traced version that logs verification attempts. Useful for debugging
 * failed verifications and analyzing verification patterns.
 */
exports.tracedVerify = (0, ai_1.traced)((message, signatureHex, publicKeyHex) => {
    return (0, signing_1.verify)(message, signatureHex, publicKeyHex);
}, 'crypto.verify', {
    category: 'crypto',
    logInput: false,
    logOutput: true, // Log success/failure
    metadata: { algorithm: 'Ed25519' },
});
/**
 * Verify a signature against a hash (traced)
 */
exports.tracedVerifyHash = (0, ai_1.traced)((hashHex, signatureHex, publicKeyHex) => {
    return (0, signing_1.verifyHash)(hashHex, signatureHex, publicKeyHex);
}, 'crypto.verifyHash', {
    category: 'crypto',
    logInput: false,
    logOutput: true,
    metadata: { algorithm: 'Ed25519' },
});
/**
 * Create a complete signed message object (traced)
 */
exports.tracedCreateSignedMessage = (0, ai_1.traced)((data, privateKeyHex, publicKeyHex) => {
    return (0, signing_1.createSignedMessage)(data, privateKeyHex, publicKeyHex);
}, 'crypto.createSignedMessage', {
    category: 'crypto',
    logInput: false,
    logOutput: false,
    metadata: { algorithm: 'Ed25519' },
});
/**
 * Verify a signed message object (traced)
 */
exports.tracedVerifySignedMessage = (0, ai_1.traced)((signedMessage) => {
    return (0, signing_1.verifySignedMessage)(signedMessage);
}, 'crypto.verifySignedMessage', {
    category: 'crypto',
    logInput: false,
    logOutput: true,
    metadata: { algorithm: 'Ed25519' },
});
/**
 * Batch verify multiple signatures (traced)
 */
exports.tracedBatchVerify = (0, ai_1.traced)((items) => {
    return (0, signing_1.batchVerify)(items);
}, 'crypto.batchVerify', {
    category: 'crypto',
    logInput: false,
    logOutput: true,
    metadata: { algorithm: 'Ed25519' },
    sanitizeOutput: (output) => {
        const results = output;
        return {
            total: results.length,
            valid: results.filter(Boolean).length,
            invalid: results.filter((r) => !r).length,
        };
    },
});
// ============================================================================
// LOGGING UTILITIES
// ============================================================================
/**
 * Log a signing operation for audit purposes
 */
function logSigningOperation(metadata) {
    if (metadata.success) {
        cryptoLog.info(`${metadata.operation}`, {
            publicKeyId: metadata.publicKeyId,
            context: metadata.context,
        });
    }
    else {
        cryptoLog.warn(`${metadata.operation}.failed`, {
            publicKeyId: metadata.publicKeyId,
            context: metadata.context,
        });
    }
}
//# sourceMappingURL=traced.js.map