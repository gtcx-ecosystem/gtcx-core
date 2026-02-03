"use strict";
// ============================================================================
// PROOF BUNDLER - UNIVERSAL (Platform-Agnostic)
// Combines multiple verification elements into exportable bundles
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProofBundleId = generateProofBundleId;
exports.createLocationProof = createLocationProof;
exports.createPhotoProof = createPhotoProof;
exports.createCryptographicProofRef = createCryptographicProofRef;
exports.createProofBundle = createProofBundle;
exports.verifyProofBundleStructure = verifyProofBundleStructure;
exports.serializeProofBundle = serializeProofBundle;
exports.parseProofBundle = parseProofBundle;
exports.hashProofBundle = hashProofBundle;
exports.extractProofHashes = extractProofHashes;
exports.getProofBundleSummary = getProofBundleSummary;
const crypto_1 = require("@gtcx/crypto");
/**
 * Generate unique proof bundle ID
 */
function generateProofBundleId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 11);
    return `proof_${timestamp}_${random}`;
}
/**
 * Create a location proof reference
 */
function createLocationProof(input) {
    const dataToHash = JSON.stringify({
        coordinates: input.coordinates,
        timestamp: input.coordinates.timestamp,
    });
    return {
        id: `loc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        coordinates: input.coordinates,
        hash: (0, crypto_1.hash256)(dataToHash),
    };
}
/**
 * Create a photo proof reference
 */
function createPhotoProof(input) {
    return {
        id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        uri: input.uri,
        hash: input.fileHash,
        timestamp: input.timestamp,
    };
}
/**
 * Create a cryptographic proof reference
 */
function createCryptographicProofRef(dataHash, signature, publicKey, algorithm = 'Ed25519-SHA256') {
    return {
        algorithm,
        dataHash,
        signature,
        publicKey,
    };
}
/**
 * Create a proof bundle combining multiple verification elements
 */
function createProofBundle(input) {
    return {
        id: generateProofBundleId(),
        type: input.type,
        timestamp: Date.now(),
        proofs: {
            cryptographicProof: input.cryptographicProof,
            locationProof: input.locationProof,
            photoProofs: input.photoProofs,
        },
        certificate: input.certificate,
        qrCode: input.qrCode,
    };
}
/**
 * Verify proof bundle integrity (structural only)
 * Cryptographic verification must be done by platform-specific code
 */
function verifyProofBundleStructure(bundle) {
    var _a;
    const errors = [];
    if (!bundle.id) {
        errors.push('Missing bundle ID');
    }
    if (!bundle.type) {
        errors.push('Missing bundle type');
    }
    if (!bundle.timestamp) {
        errors.push('Missing timestamp');
    }
    if (!((_a = bundle.proofs) === null || _a === void 0 ? void 0 : _a.cryptographicProof)) {
        errors.push('Missing cryptographic proof');
    }
    else {
        const cp = bundle.proofs.cryptographicProof;
        if (!cp.algorithm)
            errors.push('Missing algorithm in cryptographic proof');
        if (!cp.dataHash)
            errors.push('Missing dataHash in cryptographic proof');
        if (!cp.signature)
            errors.push('Missing signature in cryptographic proof');
        if (!cp.publicKey)
            errors.push('Missing publicKey in cryptographic proof');
    }
    // Type-specific validation
    if (bundle.type === 'location' && !bundle.proofs.locationProof) {
        errors.push('Location bundle requires locationProof');
    }
    if (bundle.type === 'photo' && (!bundle.proofs.photoProofs || bundle.proofs.photoProofs.length === 0)) {
        errors.push('Photo bundle requires at least one photoProof');
    }
    if (bundle.type === 'certificate' && !bundle.certificate) {
        errors.push('Certificate bundle requires certificate');
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Serialize proof bundle for export
 */
function serializeProofBundle(bundle) {
    return JSON.stringify(bundle, null, 2);
}
/**
 * Parse proof bundle from serialized string
 */
function parseProofBundle(serialized) {
    try {
        return JSON.parse(serialized);
    }
    catch (_a) {
        return null;
    }
}
/**
 * Calculate hash of entire proof bundle
 */
function hashProofBundle(bundle) {
    return (0, crypto_1.hash256)(JSON.stringify(bundle));
}
/**
 * Extract all hashes from a proof bundle
 */
function extractProofHashes(bundle) {
    var _a, _b;
    const hashes = [];
    if ((_a = bundle.proofs.cryptographicProof) === null || _a === void 0 ? void 0 : _a.dataHash) {
        hashes.push(bundle.proofs.cryptographicProof.dataHash);
    }
    if ((_b = bundle.proofs.locationProof) === null || _b === void 0 ? void 0 : _b.hash) {
        hashes.push(bundle.proofs.locationProof.hash);
    }
    if (bundle.proofs.photoProofs) {
        for (const photo of bundle.proofs.photoProofs) {
            if (photo.hash) {
                hashes.push(photo.hash);
            }
        }
    }
    return hashes;
}
/**
 * Get bundle summary for display
 */
function getProofBundleSummary(bundle) {
    var _a, _b;
    return {
        id: bundle.id,
        type: bundle.type,
        timestamp: new Date(bundle.timestamp).toISOString(),
        hasLocation: !!bundle.proofs.locationProof,
        photoCount: (_b = (_a = bundle.proofs.photoProofs) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
        hasCertificate: !!bundle.certificate,
        hasQRCode: !!bundle.qrCode,
    };
}
//# sourceMappingURL=bundler.js.map