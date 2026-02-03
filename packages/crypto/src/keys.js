"use strict";
// ============================================================================
// KEY MANAGEMENT
// Key generation, derivation, and storage utilities
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyFormats = void 0;
exports.generateKeyPair = generateKeyPair;
exports.derivePublicKey = derivePublicKey;
exports.isValidPublicKey = isValidPublicKey;
exports.isValidPrivateKey = isValidPrivateKey;
exports.generateKeyId = generateKeyId;
exports.getPublicKeyLength = getPublicKeyLength;
exports.compressPublicKey = compressPublicKey;
const ed25519_1 = require("@noble/curves/ed25519");
const secp256k1_1 = require("@noble/curves/secp256k1");
const utils_1 = require("@noble/hashes/utils");
/**
 * Generate a new key pair
 * @param algorithm - 'Ed25519' (default) or 'Secp256k1'
 */
function generateKeyPair(algorithm = 'Ed25519') {
    if (algorithm === 'Secp256k1') {
        const privateKey = secp256k1_1.secp256k1.utils.randomPrivateKey();
        const publicKey = secp256k1_1.secp256k1.getPublicKey(privateKey);
        return {
            publicKey: (0, utils_1.bytesToHex)(publicKey),
            privateKey: (0, utils_1.bytesToHex)(privateKey),
            algorithm: 'Secp256k1',
        };
    }
    // Default: Ed25519
    const privateKey = ed25519_1.ed25519.utils.randomPrivateKey();
    const publicKey = ed25519_1.ed25519.getPublicKey(privateKey);
    return {
        publicKey: (0, utils_1.bytesToHex)(publicKey),
        privateKey: (0, utils_1.bytesToHex)(privateKey),
        algorithm: 'Ed25519',
    };
}
/**
 * Derive public key from private key
 */
function derivePublicKey(privateKeyHex, algorithm = 'Ed25519') {
    const privateKey = (0, utils_1.hexToBytes)(privateKeyHex);
    if (algorithm === 'Secp256k1') {
        const publicKey = secp256k1_1.secp256k1.getPublicKey(privateKey);
        return (0, utils_1.bytesToHex)(publicKey);
    }
    const publicKey = ed25519_1.ed25519.getPublicKey(privateKey);
    return (0, utils_1.bytesToHex)(publicKey);
}
/**
 * Validate a public key format
 */
function isValidPublicKey(publicKeyHex, algorithm = 'Ed25519') {
    try {
        const bytes = (0, utils_1.hexToBytes)(publicKeyHex);
        if (algorithm === 'Secp256k1') {
            // Secp256k1 compressed public key is 33 bytes, uncompressed is 65
            return bytes.length === 33 || bytes.length === 65;
        }
        // Ed25519 public key is 32 bytes
        return bytes.length === 32;
    }
    catch {
        return false;
    }
}
/**
 * Validate a private key format
 */
function isValidPrivateKey(privateKeyHex) {
    try {
        const bytes = (0, utils_1.hexToBytes)(privateKeyHex);
        return bytes.length === 32 || bytes.length === 64;
    }
    catch {
        return false;
    }
}
/**
 * Generate a deterministic key ID from public key
 */
function generateKeyId(publicKeyHex) {
    return `did:gtcx:${publicKeyHex.substring(0, 16)}`;
}
/**
 * Convert key to different formats
 */
exports.keyFormats = {
    toBytes: (hex) => (0, utils_1.hexToBytes)(hex),
    toHex: (bytes) => (0, utils_1.bytesToHex)(bytes),
    toBase64: (hex) => {
        const bytes = (0, utils_1.hexToBytes)(hex);
        // Use btoa for browser/RN compatibility
        if (typeof btoa !== 'undefined') {
            return btoa(String.fromCharCode(...bytes));
        }
        return Buffer.from(bytes).toString('base64');
    },
    fromBase64: (base64) => {
        // Use atob for browser/RN compatibility
        if (typeof atob !== 'undefined') {
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return (0, utils_1.bytesToHex)(bytes);
        }
        const bytes = Buffer.from(base64, 'base64');
        return (0, utils_1.bytesToHex)(new Uint8Array(bytes));
    },
};
/**
 * Get the expected public key length for an algorithm
 */
function getPublicKeyLength(algorithm) {
    return algorithm === 'Secp256k1' ? 33 : 32;
}
/**
 * Compress a Secp256k1 public key
 */
function compressPublicKey(publicKeyHex) {
    const bytes = (0, utils_1.hexToBytes)(publicKeyHex);
    // Already compressed
    if (bytes.length === 33) {
        return publicKeyHex;
    }
    // Compress 65-byte key to 33-byte
    if (bytes.length === 65) {
        const lastByte = bytes[64];
        if (lastByte === undefined) {
            throw new Error('Invalid public key format');
        }
        const prefix = lastByte % 2 === 0 ? 0x02 : 0x03;
        const compressed = new Uint8Array(33);
        compressed[0] = prefix;
        compressed.set(bytes.slice(1, 33), 1);
        return (0, utils_1.bytesToHex)(compressed);
    }
    throw new Error('Invalid public key length for compression');
}
//# sourceMappingURL=keys.js.map