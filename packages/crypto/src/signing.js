"use strict";
// ============================================================================
// DIGITAL SIGNATURES
// Ed25519 signing and verification
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.signHash = signHash;
exports.verify = verify;
exports.verifyHash = verifyHash;
exports.createSignedMessage = createSignedMessage;
exports.verifySignedMessage = verifySignedMessage;
exports.batchVerify = batchVerify;
const ed25519_1 = require("@noble/curves/ed25519");
const utils_1 = require("@noble/hashes/utils");
/**
 * Sign a message with Ed25519
 */
function sign(message, privateKeyHex) {
    const privateKey = (0, utils_1.hexToBytes)(privateKeyHex);
    const messageBytes = typeof message === 'string'
        ? new TextEncoder().encode(message)
        : message;
    const signature = ed25519_1.ed25519.sign(messageBytes, privateKey);
    return (0, utils_1.bytesToHex)(signature);
}
/**
 * Sign a hash directly
 */
function signHash(hash, privateKeyHex) {
    const privateKey = (0, utils_1.hexToBytes)(privateKeyHex);
    const hashBytes = (0, utils_1.hexToBytes)(hash);
    const signature = ed25519_1.ed25519.sign(hashBytes, privateKey);
    return (0, utils_1.bytesToHex)(signature);
}
/**
 * Verify a signature
 */
function verify(message, signatureHex, publicKeyHex) {
    try {
        const signature = (0, utils_1.hexToBytes)(signatureHex);
        const publicKey = (0, utils_1.hexToBytes)(publicKeyHex);
        const messageBytes = typeof message === 'string'
            ? new TextEncoder().encode(message)
            : message;
        return ed25519_1.ed25519.verify(signature, messageBytes, publicKey);
    }
    catch {
        return false;
    }
}
/**
 * Verify a signature against a hash
 */
function verifyHash(hashHex, signatureHex, publicKeyHex) {
    try {
        const hash = (0, utils_1.hexToBytes)(hashHex);
        const signature = (0, utils_1.hexToBytes)(signatureHex);
        const publicKey = (0, utils_1.hexToBytes)(publicKeyHex);
        return ed25519_1.ed25519.verify(signature, hash, publicKey);
    }
    catch {
        return false;
    }
}
/**
 * Create a complete signed message object
 */
function createSignedMessage(data, privateKeyHex, publicKeyHex) {
    const message = typeof data === 'string'
        ? data
        : JSON.stringify(data, Object.keys(data).sort());
    const signature = sign(message, privateKeyHex);
    return {
        signature,
        publicKey: publicKeyHex,
        message,
        timestamp: Date.now(),
    };
}
/**
 * Verify a signed message object
 */
function verifySignedMessage(signedMessage) {
    const isValid = verify(signedMessage.message, signedMessage.signature, signedMessage.publicKey);
    return {
        valid: isValid,
        publicKey: signedMessage.publicKey,
        error: isValid ? undefined : 'Invalid signature',
    };
}
/**
 * Batch verify multiple signatures
 */
function batchVerify(items) {
    return items.map(item => verify(item.message, item.signature, item.publicKey));
}
//# sourceMappingURL=signing.js.map