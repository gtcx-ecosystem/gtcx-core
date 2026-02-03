"use strict";
// ============================================================================
// QR CODE GENERATOR - UNIVERSAL (Platform-Agnostic)
// Generates QR code data structures for verification
// Platform adapters handle actual image generation
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCodeId = generateQRCodeId;
exports.createLocationQRData = createLocationQRData;
exports.createPhotoQRData = createPhotoQRData;
exports.createAssetLotQRData = createAssetLotQRData;
exports.createGoldLotQRData = createGoldLotQRData;
exports.createCertificateQRData = createCertificateQRData;
exports.serializeQRData = serializeQRData;
exports.parseQRData = parseQRData;
exports.verifyQRCodeData = verifyQRCodeData;
exports.createQRCodeStructure = createQRCodeStructure;
exports.hashQRCodeContent = hashQRCodeContent;
exports.getQRCodeCommodityType = getQRCodeCommodityType;
const crypto_1 = require("@gtcx/crypto");
/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
    verifyBaseUrl: 'https://verify.gtcx.io',
    defaultSize: 256,
    certificateIdPattern: /^[A-Z0-9_-]+$/,
    maxCertificateAge: 365 * 24 * 60 * 60 * 1000, // 1 year
};
/**
 * Generate unique QR code ID
 */
function generateQRCodeId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 11);
    return `qr_${timestamp}_${random}`;
}
/**
 * Create QR code data structure for a location
 */
function createLocationQRData(certificateId, location, hash, config = {}) {
    const cfg = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
    return {
        certificateId,
        verifyUrl: `${cfg.verifyBaseUrl}/verify/${certificateId}`,
        hash: hash.substring(0, 16),
        timestamp: Date.now(),
        type: 'location',
        metadata: { location },
    };
}
/**
 * Create QR code data structure for a photo
 */
function createPhotoQRData(certificateId, photoHash, location, config = {}) {
    const cfg = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
    return {
        certificateId,
        verifyUrl: `${cfg.verifyBaseUrl}/verify/${certificateId}`,
        hash: photoHash.substring(0, 16),
        timestamp: Date.now(),
        type: 'photo',
        metadata: location ? { location } : undefined,
    };
}
/**
 * Create QR code data structure for an asset lot - COMMODITY-AGNOSTIC
 * Works for gold, silver, cocoa, coffee, or any other commodity
 */
function createAssetLotQRData(certificateId, assetLotData, hash, config = {}) {
    const cfg = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
    return {
        certificateId,
        verifyUrl: `${cfg.verifyBaseUrl}/verify/${certificateId}`,
        hash: hash.substring(0, 16),
        timestamp: Date.now(),
        type: 'asset-lot',
        metadata: {
            location: assetLotData.location,
            assetWeight: assetLotData.weight,
            assetUnit: assetLotData.unit,
            commodityType: assetLotData.commodityType,
            purity: assetLotData.purity,
            producerId: assetLotData.producerId,
            operatorRole: assetLotData.operatorRole,
        },
    };
}
/**
 * @deprecated Use createAssetLotQRData instead
 * Legacy function for gold-specific lot QR codes
 */
function createGoldLotQRData(certificateId, goldLotData, hash, config = {}) {
    // Delegate to commodity-agnostic function
    return createAssetLotQRData(certificateId, {
        weight: goldLotData.weight,
        unit: 'troy_oz',
        purity: goldLotData.purity,
        commodityType: 'gold',
        producerId: goldLotData.miner,
        operatorRole: 'producer',
        location: goldLotData.location,
    }, hash, config);
}
/**
 * Create QR code data structure for a certificate - COMMODITY-AGNOSTIC
 */
function createCertificateQRData(certificateData, proofHash, config = {}) {
    var _a;
    const cfg = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
    const metadata = {};
    if (certificateData.location) {
        metadata.location = certificateData.location;
    }
    // Prefer assetLotData over goldLotData
    const lotData = (_a = certificateData.assetLotData) !== null && _a !== void 0 ? _a : certificateData.goldLotData;
    if (lotData) {
        if ('estimatedWeight' in lotData && lotData.estimatedWeight) {
            metadata.assetWeight = lotData.estimatedWeight;
        }
        if ('unit' in lotData && lotData.unit) {
            metadata.assetUnit = lotData.unit;
        }
        if ('purity' in lotData && lotData.purity) {
            metadata.purity = lotData.purity;
        }
        if ('commodityType' in lotData && lotData.commodityType) {
            metadata.commodityType = lotData.commodityType;
        }
        else if (certificateData.goldLotData) {
            // Legacy gold data
            metadata.commodityType = 'gold';
        }
        if ('producerId' in lotData && lotData.producerId) {
            metadata.producerId = lotData.producerId;
        }
        else if ('miner' in lotData && lotData.miner) {
            // Legacy miner field
            metadata.producerId = lotData.miner;
        }
        if ('operatorRole' in lotData && lotData.operatorRole) {
            metadata.operatorRole = lotData.operatorRole;
        }
    }
    return {
        certificateId: certificateData.certificateId,
        verifyUrl: `${cfg.verifyBaseUrl}/verify/${certificateData.certificateId}`,
        hash: proofHash.substring(0, 16),
        timestamp: certificateData.issuedAt,
        type: 'certificate',
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };
}
/**
 * Serialize QR code data to string
 */
function serializeQRData(data) {
    return JSON.stringify(data);
}
/**
 * Parse QR code data from string
 */
function parseQRData(dataString) {
    try {
        return JSON.parse(dataString);
    }
    catch (_a) {
        return null;
    }
}
/**
 * Verify QR code data structure and integrity
 */
function verifyQRCodeData(qrCodeData, config = {}) {
    const cfg = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
    try {
        const data = typeof qrCodeData === 'string'
            ? parseQRData(qrCodeData)
            : qrCodeData;
        if (!data) {
            return {
                isValid: false,
                error: 'Invalid QR code data format',
            };
        }
        // Required fields check
        if (!data.certificateId || !data.verifyUrl || !data.hash) {
            return {
                isValid: false,
                error: 'Missing required QR code data fields',
            };
        }
        // Certificate ID format validation
        if (!cfg.certificateIdPattern.test(data.certificateId)) {
            return {
                isValid: false,
                error: 'Invalid certificate ID format',
            };
        }
        // Timestamp validation
        const now = Date.now();
        const age = now - data.timestamp;
        if (age < 0) {
            return {
                isValid: false,
                error: 'Certificate timestamp is in the future',
            };
        }
        if (age > cfg.maxCertificateAge) {
            return {
                isValid: false,
                error: 'Certificate has expired',
            };
        }
        // Type validation - support both old and new types
        const validTypes = ['location', 'photo', 'certificate', 'asset-lot'];
        // Also accept legacy 'gold-lot' type
        const legacyTypes = ['gold-lot'];
        if (!validTypes.includes(data.type) && !legacyTypes.includes(data.type)) {
            return {
                isValid: false,
                error: 'Invalid QR code type',
            };
        }
        return {
            isValid: true,
            data,
        };
    }
    catch (error) {
        return {
            isValid: false,
            error: 'QR code verification failed',
        };
    }
}
/**
 * Create a GeneratedQRCode structure (without image - platform adapter adds that)
 */
function createQRCodeStructure(data, size = DEFAULT_CONFIG.defaultSize) {
    return {
        id: generateQRCodeId(),
        data,
        dataString: serializeQRData(data),
        size,
        timestamp: Date.now(),
    };
}
/**
 * Generate data hash for QR code content
 */
function hashQRCodeContent(content) {
    const dataString = typeof content === 'string'
        ? content
        : JSON.stringify(content);
    return (0, crypto_1.hash256)(dataString);
}
/**
 * Extract commodity type from QR code data
 */
function getQRCodeCommodityType(data) {
    var _a;
    return (_a = data.metadata) === null || _a === void 0 ? void 0 : _a.commodityType;
}
//# sourceMappingURL=generator.js.map