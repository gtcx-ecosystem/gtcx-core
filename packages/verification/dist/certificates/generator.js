"use strict";
// ============================================================================
// CERTIFICATE GENERATOR - UNIVERSAL (Platform-Agnostic)
// Generates certificate data structures
// Platform adapters handle storage and signing
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCertificateId = generateCertificateId;
exports.validateCertificateInput = validateCertificateInput;
exports.createCertificateMetadata = createCertificateMetadata;
exports.createDefaultEnvironmentalFactors = createDefaultEnvironmentalFactors;
exports.createDefaultValidationMetrics = createDefaultValidationMetrics;
exports.createStandardCertificateData = createStandardCertificateData;
exports.createMilitaryGradeCertificateData = createMilitaryGradeCertificateData;
exports.verifyCertificateStructure = verifyCertificateStructure;
exports.isCertificateExpired = isCertificateExpired;
exports.getCertificateAge = getCertificateAge;
exports.formatCertificateForDisplay = formatCertificateForDisplay;
exports.getCertificateCommodityType = getCertificateCommodityType;
const crypto_1 = require("@gtcx/crypto");
const types_1 = require("../types");
const templates_1 = require("./templates");
// ============================================================================
// CERTIFICATE ID GENERATION
// ============================================================================
/**
 * Generate unique certificate ID
 */
function generateCertificateId(type, prefix = 'GH') {
    const typeCode = type.toUpperCase().replace(/-/g, '_');
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${typeCode}_${prefix}_${timestamp}_${random}`;
}
/**
 * Normalize input to use new commodity-agnostic fields
 */
function normalizeInput(input) {
    var _a, _b;
    const normalized = Object.assign({}, input);
    // Migrate legacy lot data to universal AssetLotData if needed
    if (input.goldLotData && !input.assetLotData) {
        normalized.assetLotData = (0, types_1.migrateLegacyLotData)(input.goldLotData, input.commodityType);
    }
    // Migrate geologicalContext to resourceContext if needed
    if (input.geologicalContext && !input.resourceContext) {
        const commodityType = (_b = (_a = normalized.assetLotData) === null || _a === void 0 ? void 0 : _a.commodityType) !== null && _b !== void 0 ? _b : 'gold';
        normalized.resourceContext = {
            commodityPotential: input.geologicalContext.goldPotential,
            commodityType,
            formation: input.geologicalContext.formation,
            confidence: input.geologicalContext.confidence,
        };
    }
    return normalized;
}
/**
 * Validate certificate input against template rules
 */
function validateCertificateInput(input) {
    var _a;
    const normalizedInput = normalizeInput(input);
    const commodityType = (_a = normalizedInput.assetLotData) === null || _a === void 0 ? void 0 : _a.commodityType;
    const template = (0, templates_1.getEffectiveTemplate)(input.templateId, commodityType);
    const errors = [];
    if (!template) {
        return { valid: false, errors: [`Template '${input.templateId}' not found`] };
    }
    // Check required fields
    for (const field of template.requiredFields) {
        const value = getNestedValue(normalizedInput, field);
        if (value === undefined || value === null) {
            errors.push(`Required field '${field}' is missing`);
        }
    }
    // Check validation rules
    for (const rule of template.validationRules) {
        const value = getNestedValue(normalizedInput, rule.field);
        if (value === undefined || value === null)
            continue;
        if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
            errors.push(rule.message);
        }
        if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
            errors.push(rule.message);
        }
        if (rule.value !== undefined && value !== rule.value) {
            errors.push(rule.message);
        }
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Create certificate metadata
 */
function createCertificateMetadata(input, issuer = 'GTCX Verification System') {
    var _a, _b;
    const normalizedInput = normalizeInput(input);
    return {
        issuer,
        issuedAt: Date.now(),
        expiresAt: normalizedInput.expiresAt,
        userRole: normalizedInput.userRole,
        deviceId: normalizedInput.deviceId,
        location: normalizedInput.location,
        resourceContext: normalizedInput.resourceContext,
        // Keep legacy for backwards compatibility
        geologicalContext: normalizedInput.geologicalContext,
        environmentalFactors: (_a = normalizedInput.environmentalFactors) !== null && _a !== void 0 ? _a : createDefaultEnvironmentalFactors(),
        validationMetrics: (_b = normalizedInput.validationMetrics) !== null && _b !== void 0 ? _b : createDefaultValidationMetrics(),
    };
}
/**
 * Create default environmental factors
 */
function createDefaultEnvironmentalFactors() {
    return {
        satelliteCount: 0,
        signalStrength: 0,
        atmosphericConditions: 'unknown',
        multipathIndicator: false,
    };
}
/**
 * Create default validation metrics
 */
function createDefaultValidationMetrics() {
    return {
        isJammed: false,
        isSpoofed: false,
        confidenceLevel: 0.5,
        integrityCheck: true,
    };
}
/**
 * Create a standard certificate structure (unsigned)
 * Caller must sign with appropriate crypto service
 */
function createStandardCertificateData(input) {
    var _a;
    const normalizedInput = normalizeInput(input);
    const commodityType = (_a = normalizedInput.assetLotData) === null || _a === void 0 ? void 0 : _a.commodityType;
    const template = (0, templates_1.getEffectiveTemplate)(normalizedInput.templateId, commodityType);
    if (!template) {
        throw new Error(`Template '${normalizedInput.templateId}' not found`);
    }
    const validation = validateCertificateInput(normalizedInput);
    if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    const certificateId = generateCertificateId(template.type);
    const metadata = createCertificateMetadata(normalizedInput);
    // Create data hash - use commodity-agnostic field
    const dataToHash = {
        certificateId,
        type: template.type,
        metadata,
        assetLotData: normalizedInput.assetLotData,
        photoEvidence: normalizedInput.photoEvidence,
        workflowContext: normalizedInput.workflowContext,
        complianceData: normalizedInput.complianceData,
    };
    const dataHash = (0, crypto_1.hash256)(JSON.stringify(dataToHash));
    const dataToSign = JSON.stringify({ certificateId, metadata, dataHash });
    return {
        certificateId,
        version: '1.0',
        type: template.type,
        securityLevel: template.securityLevel,
        metadata,
        verificationData: {
            publicKey: '', // Caller must fill
            signature: '', // Caller must fill
            timestamp: Date.now(),
        },
        createdAt: Date.now(),
        dataHash,
        dataToSign,
    };
}
/**
 * Create a military-grade certificate structure (unsigned)
 * Caller must sign with multi-signature crypto service
 */
function createMilitaryGradeCertificateData(input) {
    var _a;
    const normalizedInput = normalizeInput(input);
    const commodityType = (_a = normalizedInput.assetLotData) === null || _a === void 0 ? void 0 : _a.commodityType;
    const template = (0, templates_1.getEffectiveTemplate)(normalizedInput.templateId, commodityType);
    if (!template) {
        throw new Error(`Template '${normalizedInput.templateId}' not found`);
    }
    if (!['military', 'quantum-resistant'].includes(template.securityLevel)) {
        throw new Error(`Template '${normalizedInput.templateId}' is not military-grade`);
    }
    const validation = validateCertificateInput(normalizedInput);
    if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    const certificateId = generateCertificateId(template.type, 'MIL');
    const metadata = createCertificateMetadata(normalizedInput, 'GTCX Military-Grade Verification System');
    // Use commodity-agnostic field
    const certificateData = {
        assetLotData: normalizedInput.assetLotData,
        // Keep legacy for backwards compatibility
        goldLotData: normalizedInput.goldLotData,
        photoEvidence: normalizedInput.photoEvidence,
        workflowContext: normalizedInput.workflowContext,
        complianceData: normalizedInput.complianceData,
    };
    // Data for quantum-resistant hash
    const dataForQuantumHash = JSON.stringify({
        certificateId,
        metadata,
        certificateData,
    });
    // Data to sign (will include quantum hash after it's generated)
    const dataToSign = JSON.stringify({
        certificateId,
        metadata,
        // quantumResistantHash will be added by caller
    });
    return {
        certificateId,
        version: '2.0',
        type: template.type,
        securityLevel: template.securityLevel,
        metadata,
        certificateData,
        verificationData: {
            publicKey: '', // Caller must fill
            signature: '', // Caller must fill
            timestamp: Date.now(),
            entropyQuality: 0, // Caller must fill
        },
        createdAt: Date.now(),
        dataToSign,
        dataForQuantumHash,
    };
}
// ============================================================================
// CERTIFICATE VERIFICATION
// ============================================================================
/**
 * Verify certificate structure (without cryptographic verification)
 * Cryptographic verification must be done by platform-specific code
 */
function verifyCertificateStructure(certificate) {
    var _a;
    const errors = [];
    // Basic field checks
    if (!certificate.certificateId) {
        errors.push('Missing certificate ID');
    }
    if (!certificate.version) {
        errors.push('Missing version');
    }
    if (!certificate.type) {
        errors.push('Missing type');
    }
    if (!certificate.metadata) {
        errors.push('Missing metadata');
    }
    else {
        if (!certificate.metadata.issuer)
            errors.push('Missing issuer');
        if (!certificate.metadata.issuedAt)
            errors.push('Missing issuedAt');
        if (!certificate.metadata.location)
            errors.push('Missing location');
    }
    if (!certificate.verificationData) {
        errors.push('Missing verification data');
    }
    else {
        if (!certificate.verificationData.publicKey)
            errors.push('Missing public key');
        if (!certificate.verificationData.signature)
            errors.push('Missing signature');
    }
    // Expiration check
    if (((_a = certificate.metadata) === null || _a === void 0 ? void 0 : _a.expiresAt) && certificate.metadata.expiresAt < Date.now()) {
        errors.push('Certificate has expired');
    }
    return { valid: errors.length === 0, errors };
}
/**
 * Check if certificate is expired
 */
function isCertificateExpired(certificate) {
    var _a;
    if (!((_a = certificate.metadata) === null || _a === void 0 ? void 0 : _a.expiresAt))
        return false;
    return certificate.metadata.expiresAt < Date.now();
}
/**
 * Get certificate age in milliseconds
 */
function getCertificateAge(certificate) {
    return Date.now() - certificate.createdAt;
}
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
    if (!obj || typeof obj !== 'object')
        return undefined;
    return path.split('.').reduce((current, key) => {
        if (current && typeof current === 'object') {
            return current[key];
        }
        return undefined;
    }, obj);
}
/**
 * Format certificate for display
 */
function formatCertificateForDisplay(certificate) {
    var _a, _b;
    const { metadata } = certificate;
    // Try to get commodity type from certificate data
    let commodityType;
    if ('certificateData' in certificate) {
        const milCert = certificate;
        commodityType = (_b = (_a = milCert.certificateData) === null || _a === void 0 ? void 0 : _a.assetLotData) === null || _b === void 0 ? void 0 : _b.commodityType;
    }
    return {
        id: certificate.certificateId,
        type: certificate.type,
        securityLevel: certificate.securityLevel,
        issued: new Date(metadata.issuedAt).toISOString(),
        expires: metadata.expiresAt ? new Date(metadata.expiresAt).toISOString() : null,
        location: `${metadata.location.latitude.toFixed(6)}, ${metadata.location.longitude.toFixed(6)}`,
        issuer: metadata.issuer,
        commodityType,
    };
}
/**
 * Extract commodity type from certificate
 */
function getCertificateCommodityType(certificate) {
    var _a, _b;
    if ('certificateData' in certificate) {
        const milCert = certificate;
        return (_b = (_a = milCert.certificateData) === null || _a === void 0 ? void 0 : _a.assetLotData) === null || _b === void 0 ? void 0 : _b.commodityType;
    }
    return undefined;
}
//# sourceMappingURL=generator.js.map