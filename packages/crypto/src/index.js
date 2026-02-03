"use strict";
// ============================================================================
// GTCX CRYPTOGRAPHIC PRIMITIVES
// Core cryptographic operations for the protocol
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logKeyEvent = exports.tracedCompressPublicKey = exports.tracedGenerateKeyId = exports.tracedIsValidPrivateKey = exports.tracedIsValidPublicKey = exports.tracedDerivePublicKey = exports.tracedGenerateKeyPair = exports.tracedCombineHashes = exports.tracedGenerateSalt = exports.tracedVerifyCommitment = exports.tracedCreateCommitment = exports.tracedVerifyHashValue = exports.tracedDoubleHash256 = exports.tracedHashObject = exports.tracedHash = exports.tracedHash512 = exports.tracedHash256 = exports.logSigningOperation = exports.tracedBatchVerify = exports.tracedVerifySignedMessage = exports.tracedCreateSignedMessage = exports.tracedVerifyHash = exports.tracedVerify = exports.tracedSignHash = exports.tracedSign = exports.combineHashes = exports.generateSalt = exports.verifyCommitment = exports.createCommitment = exports.verifyHashValue = exports.doubleHash256 = exports.hashObject = exports.hash = exports.hash512 = exports.hash256 = exports.batchVerify = exports.verifySignedMessage = exports.createSignedMessage = exports.verifyHash = exports.verify = exports.signHash = exports.sign = exports.compressPublicKey = exports.getPublicKeyLength = exports.keyFormats = exports.generateKeyId = exports.isValidPrivateKey = exports.isValidPublicKey = exports.derivePublicKey = exports.generateKeyPair = void 0;
// Base operations (no tracing)
var keys_1 = require("./keys");
Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function () { return keys_1.generateKeyPair; } });
Object.defineProperty(exports, "derivePublicKey", { enumerable: true, get: function () { return keys_1.derivePublicKey; } });
Object.defineProperty(exports, "isValidPublicKey", { enumerable: true, get: function () { return keys_1.isValidPublicKey; } });
Object.defineProperty(exports, "isValidPrivateKey", { enumerable: true, get: function () { return keys_1.isValidPrivateKey; } });
Object.defineProperty(exports, "generateKeyId", { enumerable: true, get: function () { return keys_1.generateKeyId; } });
Object.defineProperty(exports, "keyFormats", { enumerable: true, get: function () { return keys_1.keyFormats; } });
Object.defineProperty(exports, "getPublicKeyLength", { enumerable: true, get: function () { return keys_1.getPublicKeyLength; } });
Object.defineProperty(exports, "compressPublicKey", { enumerable: true, get: function () { return keys_1.compressPublicKey; } });
var signing_1 = require("./signing");
Object.defineProperty(exports, "sign", { enumerable: true, get: function () { return signing_1.sign; } });
Object.defineProperty(exports, "signHash", { enumerable: true, get: function () { return signing_1.signHash; } });
Object.defineProperty(exports, "verify", { enumerable: true, get: function () { return signing_1.verify; } });
Object.defineProperty(exports, "verifyHash", { enumerable: true, get: function () { return signing_1.verifyHash; } });
Object.defineProperty(exports, "createSignedMessage", { enumerable: true, get: function () { return signing_1.createSignedMessage; } });
Object.defineProperty(exports, "verifySignedMessage", { enumerable: true, get: function () { return signing_1.verifySignedMessage; } });
Object.defineProperty(exports, "batchVerify", { enumerable: true, get: function () { return signing_1.batchVerify; } });
var hashing_1 = require("./hashing");
Object.defineProperty(exports, "hash256", { enumerable: true, get: function () { return hashing_1.hash256; } });
Object.defineProperty(exports, "hash512", { enumerable: true, get: function () { return hashing_1.hash512; } });
Object.defineProperty(exports, "hash", { enumerable: true, get: function () { return hashing_1.hash; } });
Object.defineProperty(exports, "hashObject", { enumerable: true, get: function () { return hashing_1.hashObject; } });
Object.defineProperty(exports, "doubleHash256", { enumerable: true, get: function () { return hashing_1.doubleHash256; } });
Object.defineProperty(exports, "verifyHashValue", { enumerable: true, get: function () { return hashing_1.verifyHash; } });
Object.defineProperty(exports, "createCommitment", { enumerable: true, get: function () { return hashing_1.createCommitment; } });
Object.defineProperty(exports, "verifyCommitment", { enumerable: true, get: function () { return hashing_1.verifyCommitment; } });
Object.defineProperty(exports, "generateSalt", { enumerable: true, get: function () { return hashing_1.generateSalt; } });
Object.defineProperty(exports, "combineHashes", { enumerable: true, get: function () { return hashing_1.combineHashes; } });
__exportStar(require("./proofs"), exports);
// ============================================================================
// TRACED OPERATIONS (AI-Native)
// Import from '@gtcx/crypto/traced' for operation logging
// ============================================================================
var traced_1 = require("./traced");
Object.defineProperty(exports, "tracedSign", { enumerable: true, get: function () { return traced_1.tracedSign; } });
Object.defineProperty(exports, "tracedSignHash", { enumerable: true, get: function () { return traced_1.tracedSignHash; } });
Object.defineProperty(exports, "tracedVerify", { enumerable: true, get: function () { return traced_1.tracedVerify; } });
Object.defineProperty(exports, "tracedVerifyHash", { enumerable: true, get: function () { return traced_1.tracedVerifyHash; } });
Object.defineProperty(exports, "tracedCreateSignedMessage", { enumerable: true, get: function () { return traced_1.tracedCreateSignedMessage; } });
Object.defineProperty(exports, "tracedVerifySignedMessage", { enumerable: true, get: function () { return traced_1.tracedVerifySignedMessage; } });
Object.defineProperty(exports, "tracedBatchVerify", { enumerable: true, get: function () { return traced_1.tracedBatchVerify; } });
Object.defineProperty(exports, "logSigningOperation", { enumerable: true, get: function () { return traced_1.logSigningOperation; } });
var traced_hashing_1 = require("./traced-hashing");
Object.defineProperty(exports, "tracedHash256", { enumerable: true, get: function () { return traced_hashing_1.tracedHash256; } });
Object.defineProperty(exports, "tracedHash512", { enumerable: true, get: function () { return traced_hashing_1.tracedHash512; } });
Object.defineProperty(exports, "tracedHash", { enumerable: true, get: function () { return traced_hashing_1.tracedHash; } });
Object.defineProperty(exports, "tracedHashObject", { enumerable: true, get: function () { return traced_hashing_1.tracedHashObject; } });
Object.defineProperty(exports, "tracedDoubleHash256", { enumerable: true, get: function () { return traced_hashing_1.tracedDoubleHash256; } });
Object.defineProperty(exports, "tracedVerifyHashValue", { enumerable: true, get: function () { return traced_hashing_1.tracedVerifyHashValue; } });
Object.defineProperty(exports, "tracedCreateCommitment", { enumerable: true, get: function () { return traced_hashing_1.tracedCreateCommitment; } });
Object.defineProperty(exports, "tracedVerifyCommitment", { enumerable: true, get: function () { return traced_hashing_1.tracedVerifyCommitment; } });
Object.defineProperty(exports, "tracedGenerateSalt", { enumerable: true, get: function () { return traced_hashing_1.tracedGenerateSalt; } });
Object.defineProperty(exports, "tracedCombineHashes", { enumerable: true, get: function () { return traced_hashing_1.tracedCombineHashes; } });
var traced_keys_1 = require("./traced-keys");
Object.defineProperty(exports, "tracedGenerateKeyPair", { enumerable: true, get: function () { return traced_keys_1.tracedGenerateKeyPair; } });
Object.defineProperty(exports, "tracedDerivePublicKey", { enumerable: true, get: function () { return traced_keys_1.tracedDerivePublicKey; } });
Object.defineProperty(exports, "tracedIsValidPublicKey", { enumerable: true, get: function () { return traced_keys_1.tracedIsValidPublicKey; } });
Object.defineProperty(exports, "tracedIsValidPrivateKey", { enumerable: true, get: function () { return traced_keys_1.tracedIsValidPrivateKey; } });
Object.defineProperty(exports, "tracedGenerateKeyId", { enumerable: true, get: function () { return traced_keys_1.tracedGenerateKeyId; } });
Object.defineProperty(exports, "tracedCompressPublicKey", { enumerable: true, get: function () { return traced_keys_1.tracedCompressPublicKey; } });
Object.defineProperty(exports, "logKeyEvent", { enumerable: true, get: function () { return traced_keys_1.logKeyEvent; } });
//# sourceMappingURL=index.js.map