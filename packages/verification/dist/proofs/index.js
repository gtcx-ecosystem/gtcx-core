"use strict";
// ============================================================================
// PROOFS MODULE - PUBLIC API
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProofBundleSummary = exports.extractProofHashes = exports.hashProofBundle = exports.parseProofBundle = exports.serializeProofBundle = exports.verifyProofBundleStructure = exports.createProofBundle = exports.createCryptographicProofRef = exports.createPhotoProof = exports.createLocationProof = exports.generateProofBundleId = void 0;
var bundler_1 = require("./bundler");
// ID generation
Object.defineProperty(exports, "generateProofBundleId", { enumerable: true, get: function () { return bundler_1.generateProofBundleId; } });
// Proof creation
Object.defineProperty(exports, "createLocationProof", { enumerable: true, get: function () { return bundler_1.createLocationProof; } });
Object.defineProperty(exports, "createPhotoProof", { enumerable: true, get: function () { return bundler_1.createPhotoProof; } });
Object.defineProperty(exports, "createCryptographicProofRef", { enumerable: true, get: function () { return bundler_1.createCryptographicProofRef; } });
Object.defineProperty(exports, "createProofBundle", { enumerable: true, get: function () { return bundler_1.createProofBundle; } });
// Verification
Object.defineProperty(exports, "verifyProofBundleStructure", { enumerable: true, get: function () { return bundler_1.verifyProofBundleStructure; } });
// Serialization
Object.defineProperty(exports, "serializeProofBundle", { enumerable: true, get: function () { return bundler_1.serializeProofBundle; } });
Object.defineProperty(exports, "parseProofBundle", { enumerable: true, get: function () { return bundler_1.parseProofBundle; } });
// Utilities
Object.defineProperty(exports, "hashProofBundle", { enumerable: true, get: function () { return bundler_1.hashProofBundle; } });
Object.defineProperty(exports, "extractProofHashes", { enumerable: true, get: function () { return bundler_1.extractProofHashes; } });
Object.defineProperty(exports, "getProofBundleSummary", { enumerable: true, get: function () { return bundler_1.getProofBundleSummary; } });
//# sourceMappingURL=index.js.map