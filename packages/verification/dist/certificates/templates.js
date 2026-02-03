"use strict";
// ============================================================================
// CERTIFICATE TEMPLATES
// Pre-defined templates for different certificate types
// COMMODITY-AGNOSTIC ARCHITECTURE - Templates work for ANY commodity
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMODITY_CERTIFICATE_CONFIGS = exports.CERTIFICATE_TEMPLATES = exports.GOLD_ORIGIN_TEMPLATE = exports.SETTLEMENT_TEMPLATE = exports.CUSTODY_TRANSFER_TEMPLATE = exports.COMPLIANCE_TEMPLATE = exports.PHOTO_TEMPLATE = exports.LOCATION_TEMPLATE = exports.GOVERNMENT_INSPECTOR_TEMPLATE = exports.WORK_SITE_TEMPLATE = exports.ASSET_ORIGIN_TEMPLATE = void 0;
exports.getTemplate = getTemplate;
exports.getTemplatesBySecurityLevel = getTemplatesBySecurityLevel;
exports.getTemplatesByType = getTemplatesByType;
exports.listTemplateIds = listTemplateIds;
exports.getCommodityCertificateConfig = getCommodityCertificateConfig;
exports.createCommodityCertificateConfig = createCommodityCertificateConfig;
exports.getEffectiveTemplate = getEffectiveTemplate;
// ============================================================================
// CORE TEMPLATES (Commodity-Agnostic)
// ============================================================================
/**
 * Asset Origin Certificate Template - UNIVERSAL
 * Military-grade security for tracking ANY commodity from source to market
 *
 * Use: Gold, silver, cobalt, cocoa, coffee, etc.
 */
exports.ASSET_ORIGIN_TEMPLATE = {
    id: 'asset-origin',
    name: 'Asset Origin Certificate',
    description: 'Military-grade certificate for commodity lot origin verification',
    type: 'asset-origin',
    securityLevel: 'quantum-resistant',
    requiredFields: ['location', 'assetLotData', 'userRole', 'deviceId'],
    optionalFields: ['photoEvidence', 'resourceContext', 'complianceData'],
    validationRules: [
        {
            field: 'location.accuracy',
            max: 10,
            message: 'Location accuracy must be within 10 meters'
        },
        {
            field: 'validationMetrics.confidenceLevel',
            min: 0.8,
            message: 'Confidence level must be at least 80%'
        },
        {
            field: 'validationMetrics.integrityCheck',
            value: true,
            message: 'Integrity check must pass'
        },
    ],
};
/**
 * Work Site Verification Template
 * Daily check-in verification for producers at extraction sites
 */
exports.WORK_SITE_TEMPLATE = {
    id: 'work-site',
    name: 'Work Site Verification Certificate',
    description: 'Certificate for daily work site verification',
    type: 'work-site',
    securityLevel: 'enhanced',
    requiredFields: ['location', 'userRole', 'deviceId', 'workflowContext'],
    optionalFields: ['photoEvidence', 'environmentalFactors'],
    validationRules: [
        {
            field: 'location.accuracy',
            max: 15,
            message: 'Location accuracy must be within 15 meters'
        },
        {
            field: 'validationMetrics.confidenceLevel',
            min: 0.7,
            message: 'Confidence level must be at least 70%'
        },
    ],
};
/**
 * Government Inspector Template
 * Highest security for government inspection activities
 */
exports.GOVERNMENT_INSPECTOR_TEMPLATE = {
    id: 'government-inspection',
    name: 'Government Inspector Certificate',
    description: 'Quantum-resistant certificate for government inspection activities',
    type: 'government-inspection',
    securityLevel: 'quantum-resistant',
    requiredFields: ['location', 'userRole', 'deviceId', 'complianceData'],
    optionalFields: ['photoEvidence', 'resourceContext', 'environmentalFactors'],
    validationRules: [
        {
            field: 'location.accuracy',
            max: 5,
            message: 'Location accuracy must be within 5 meters'
        },
        {
            field: 'validationMetrics.confidenceLevel',
            min: 0.9,
            message: 'Confidence level must be at least 90%'
        },
        {
            field: 'validationMetrics.integrityCheck',
            value: true,
            message: 'Integrity check must pass'
        },
        {
            field: 'validationMetrics.isJammed',
            value: false,
            message: 'GPS must not be jammed'
        },
        {
            field: 'validationMetrics.isSpoofed',
            value: false,
            message: 'GPS must not be spoofed'
        },
    ],
};
/**
 * Location Certificate Template
 * Standard location verification
 */
exports.LOCATION_TEMPLATE = {
    id: 'location',
    name: 'Location Certificate',
    description: 'Standard certificate for location verification',
    type: 'location',
    securityLevel: 'standard',
    requiredFields: ['location', 'deviceId'],
    optionalFields: ['userRole', 'environmentalFactors'],
    validationRules: [
        {
            field: 'location.accuracy',
            max: 20,
            message: 'Location accuracy must be within 20 meters'
        },
    ],
};
/**
 * Photo Evidence Template
 * Photo with location binding
 */
exports.PHOTO_TEMPLATE = {
    id: 'photo',
    name: 'Photo Evidence Certificate',
    description: 'Certificate for photo evidence with location binding',
    type: 'photo',
    securityLevel: 'standard',
    requiredFields: ['location', 'photoHash', 'deviceId'],
    optionalFields: ['userRole', 'description', 'category'],
    validationRules: [
        {
            field: 'location.accuracy',
            max: 25,
            message: 'Location accuracy must be within 25 meters'
        },
    ],
};
/**
 * Compliance Certificate Template
 * For regulatory compliance verification
 */
exports.COMPLIANCE_TEMPLATE = {
    id: 'compliance',
    name: 'Compliance Certificate',
    description: 'Certificate for regulatory compliance verification',
    type: 'compliance',
    securityLevel: 'enhanced',
    requiredFields: ['location', 'userRole', 'deviceId', 'complianceData'],
    optionalFields: ['photoEvidence', 'notes'],
    validationRules: [
        {
            field: 'location.accuracy',
            max: 10,
            message: 'Location accuracy must be within 10 meters'
        },
        {
            field: 'validationMetrics.confidenceLevel',
            min: 0.85,
            message: 'Confidence level must be at least 85%'
        },
    ],
};
/**
 * Custody Transfer Template - NEW
 * For VaultMark custody change verification
 */
exports.CUSTODY_TRANSFER_TEMPLATE = {
    id: 'custody-transfer',
    name: 'Custody Transfer Certificate',
    description: 'Certificate for custody transfer verification (VaultMark)',
    type: 'custody-transfer',
    securityLevel: 'military',
    requiredFields: ['location', 'userRole', 'deviceId', 'assetLotData', 'custodyData'],
    optionalFields: ['photoEvidence', 'complianceData'],
    validationRules: [
        {
            field: 'location.accuracy',
            max: 5,
            message: 'Location accuracy must be within 5 meters'
        },
        {
            field: 'validationMetrics.confidenceLevel',
            min: 0.95,
            message: 'Confidence level must be at least 95%'
        },
        {
            field: 'validationMetrics.integrityCheck',
            value: true,
            message: 'Integrity check must pass'
        },
    ],
};
/**
 * Settlement Template - NEW
 * For PvP settlement verification
 */
exports.SETTLEMENT_TEMPLATE = {
    id: 'settlement',
    name: 'Settlement Certificate',
    description: 'Certificate for PvP settlement verification',
    type: 'settlement',
    securityLevel: 'quantum-resistant',
    requiredFields: ['location', 'userRole', 'deviceId', 'assetLotData', 'settlementData'],
    optionalFields: ['photoEvidence', 'complianceData'],
    validationRules: [
        {
            field: 'location.accuracy',
            max: 5,
            message: 'Location accuracy must be within 5 meters'
        },
        {
            field: 'validationMetrics.confidenceLevel',
            min: 0.98,
            message: 'Confidence level must be at least 98%'
        },
        {
            field: 'validationMetrics.integrityCheck',
            value: true,
            message: 'Integrity check must pass'
        },
        {
            field: 'validationMetrics.isJammed',
            value: false,
            message: 'GPS must not be jammed'
        },
        {
            field: 'validationMetrics.isSpoofed',
            value: false,
            message: 'GPS must not be spoofed'
        },
    ],
};
// ============================================================================
// LEGACY ALIAS (Backwards Compatibility)
// ============================================================================
/**
 * @deprecated Use ASSET_ORIGIN_TEMPLATE instead
 * This alias exists only for backwards compatibility during migration
 */
exports.GOLD_ORIGIN_TEMPLATE = exports.ASSET_ORIGIN_TEMPLATE;
// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================
/**
 * All available certificate templates
 */
exports.CERTIFICATE_TEMPLATES = {
    // Primary (commodity-agnostic)
    'asset-origin': exports.ASSET_ORIGIN_TEMPLATE,
    'work-site': exports.WORK_SITE_TEMPLATE,
    'government-inspection': exports.GOVERNMENT_INSPECTOR_TEMPLATE,
    'location': exports.LOCATION_TEMPLATE,
    'photo': exports.PHOTO_TEMPLATE,
    'compliance': exports.COMPLIANCE_TEMPLATE,
    'custody-transfer': exports.CUSTODY_TRANSFER_TEMPLATE,
    'settlement': exports.SETTLEMENT_TEMPLATE,
    // Legacy alias (for backwards compatibility)
    'gold-origin': exports.ASSET_ORIGIN_TEMPLATE,
};
/**
 * Pre-defined commodity configurations
 */
exports.COMMODITY_CERTIFICATE_CONFIGS = {
    'gold-origin': {
        templateId: 'asset-origin',
        commodityType: 'gold',
        defaultUnit: 'troy_oz',
        displayName: 'Gold Origin Certificate',
        additionalValidation: [
            { field: 'assetLotData.purity', min: 0, max: 100, message: 'Purity must be 0-100%' },
        ],
    },
    'silver-origin': {
        templateId: 'asset-origin',
        commodityType: 'silver',
        defaultUnit: 'troy_oz',
        displayName: 'Silver Origin Certificate',
    },
    'cobalt-origin': {
        templateId: 'asset-origin',
        commodityType: 'cobalt',
        defaultUnit: 'kg',
        displayName: 'Cobalt Origin Certificate',
        additionalRequiredFields: ['resourceContext'],
    },
    'cocoa-origin': {
        templateId: 'asset-origin',
        commodityType: 'cocoa',
        defaultUnit: 'kg',
        displayName: 'Cocoa Origin Certificate',
    },
    'coffee-origin': {
        templateId: 'asset-origin',
        commodityType: 'coffee',
        defaultUnit: 'kg',
        displayName: 'Coffee Origin Certificate',
    },
};
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Get template by ID
 */
function getTemplate(templateId) {
    return exports.CERTIFICATE_TEMPLATES[templateId];
}
/**
 * Get templates by security level
 */
function getTemplatesBySecurityLevel(level) {
    return Object.values(exports.CERTIFICATE_TEMPLATES).filter(t => t.securityLevel === level);
}
/**
 * Get templates by type
 */
function getTemplatesByType(type) {
    return Object.values(exports.CERTIFICATE_TEMPLATES).filter(t => t.type === type);
}
/**
 * List all template IDs
 */
function listTemplateIds() {
    return Object.keys(exports.CERTIFICATE_TEMPLATES);
}
/**
 * Get commodity-specific certificate configuration
 */
function getCommodityCertificateConfig(configId) {
    return exports.COMMODITY_CERTIFICATE_CONFIGS[configId];
}
/**
 * Create a commodity-specific certificate configuration dynamically
 */
function createCommodityCertificateConfig(commodityType, config) {
    return {
        templateId: 'asset-origin',
        commodityType,
        defaultUnit: config.defaultUnit,
        displayName: `${config.displayName} Origin Certificate`,
        additionalValidation: config.hasPurity
            ? [{ field: 'assetLotData.purity', min: 0, max: 100, message: 'Purity must be 0-100%' }]
            : undefined,
    };
}
/**
 * Get effective template with commodity-specific overrides
 */
function getEffectiveTemplate(templateId, commodityType) {
    var _a, _b;
    const baseTemplate = getTemplate(templateId);
    if (!baseTemplate) {
        throw new Error(`Template not found: ${templateId}`);
    }
    // If no commodity type or no specific config, return base template
    if (!commodityType) {
        return baseTemplate;
    }
    const commodityConfigId = `${commodityType}-origin`;
    const commodityConfig = getCommodityCertificateConfig(commodityConfigId);
    if (!commodityConfig) {
        return baseTemplate;
    }
    // Merge commodity-specific validation rules
    const mergedRules = [
        ...baseTemplate.validationRules,
        ...((_a = commodityConfig.additionalValidation) !== null && _a !== void 0 ? _a : []),
    ];
    // Merge required fields
    const mergedRequiredFields = [
        ...baseTemplate.requiredFields,
        ...((_b = commodityConfig.additionalRequiredFields) !== null && _b !== void 0 ? _b : []),
    ];
    return Object.assign(Object.assign({}, baseTemplate), { name: commodityConfig.displayName, requiredFields: Array.from(new Set(mergedRequiredFields)), validationRules: mergedRules });
}
//# sourceMappingURL=templates.js.map