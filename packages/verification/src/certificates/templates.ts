// ============================================================================
// CERTIFICATE TEMPLATES
// Pre-defined templates for different certificate types
// COMMODITY-AGNOSTIC ARCHITECTURE - Templates work for ANY commodity
// ============================================================================

import type { 
  CertificateTemplate, 
  CertificateType, 
  CertificateSecurityLevel,
  CommodityType,
  CommodityConfig,
  MeasurementUnit,
} from '../types';

// ============================================================================
// CORE TEMPLATES (Commodity-Agnostic)
// ============================================================================

/**
 * Asset Origin Certificate Template - UNIVERSAL
 * Military-grade security for tracking ANY commodity from source to market
 * 
 * Use: Gold, silver, cobalt, cocoa, coffee, etc.
 */
export const ASSET_ORIGIN_TEMPLATE: CertificateTemplate = {
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
export const WORK_SITE_TEMPLATE: CertificateTemplate = {
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
export const GOVERNMENT_INSPECTOR_TEMPLATE: CertificateTemplate = {
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
export const LOCATION_TEMPLATE: CertificateTemplate = {
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
export const PHOTO_TEMPLATE: CertificateTemplate = {
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
export const COMPLIANCE_TEMPLATE: CertificateTemplate = {
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
export const CUSTODY_TRANSFER_TEMPLATE: CertificateTemplate = {
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
export const SETTLEMENT_TEMPLATE: CertificateTemplate = {
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
export const GOLD_ORIGIN_TEMPLATE = ASSET_ORIGIN_TEMPLATE;

// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================

/**
 * All available certificate templates
 */
export const CERTIFICATE_TEMPLATES: Record<string, CertificateTemplate> = {
  // Primary (commodity-agnostic)
  'asset-origin': ASSET_ORIGIN_TEMPLATE,
  'work-site': WORK_SITE_TEMPLATE,
  'government-inspection': GOVERNMENT_INSPECTOR_TEMPLATE,
  'location': LOCATION_TEMPLATE,
  'photo': PHOTO_TEMPLATE,
  'compliance': COMPLIANCE_TEMPLATE,
  'custody-transfer': CUSTODY_TRANSFER_TEMPLATE,
  'settlement': SETTLEMENT_TEMPLATE,
  
  // Legacy alias (for backwards compatibility)
  'gold-origin': ASSET_ORIGIN_TEMPLATE,
};

// ============================================================================
// COMMODITY-SPECIFIC CONFIGURATIONS
// These are CONFIGURATIONS, not TEMPLATES - they customize the universal templates
// ============================================================================

/**
 * Configuration overlay for commodity-specific certificate behavior
 */
export interface CommodityCertificateConfig {
  /** Which template to use */
  templateId: string;
  /** Commodity type */
  commodityType: CommodityType;
  /** Default measurement unit */
  defaultUnit: MeasurementUnit;
  /** Display name for UI */
  displayName: string;
  /** Additional validation rules specific to this commodity */
  additionalValidation?: Array<{
    field: string;
    min?: number;
    max?: number;
    value?: boolean | string | number;
    message: string;
  }>;
  /** Custom required fields beyond template defaults */
  additionalRequiredFields?: string[];
}

/**
 * Pre-defined commodity configurations
 */
export const COMMODITY_CERTIFICATE_CONFIGS: Record<string, CommodityCertificateConfig> = {
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
export function getTemplate(templateId: string): CertificateTemplate | undefined {
  return CERTIFICATE_TEMPLATES[templateId];
}

/**
 * Get templates by security level
 */
export function getTemplatesBySecurityLevel(
  level: CertificateSecurityLevel
): CertificateTemplate[] {
  return Object.values(CERTIFICATE_TEMPLATES).filter(t => t.securityLevel === level);
}

/**
 * Get templates by type
 */
export function getTemplatesByType(type: CertificateType): CertificateTemplate[] {
  return Object.values(CERTIFICATE_TEMPLATES).filter(t => t.type === type);
}

/**
 * List all template IDs
 */
export function listTemplateIds(): string[] {
  return Object.keys(CERTIFICATE_TEMPLATES);
}

/**
 * Get commodity-specific certificate configuration
 */
export function getCommodityCertificateConfig(
  configId: string
): CommodityCertificateConfig | undefined {
  return COMMODITY_CERTIFICATE_CONFIGS[configId];
}

/**
 * Create a commodity-specific certificate configuration dynamically
 */
export function createCommodityCertificateConfig(
  commodityType: CommodityType,
  config: CommodityConfig
): CommodityCertificateConfig {
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
export function getEffectiveTemplate(
  templateId: string,
  commodityType?: CommodityType
): CertificateTemplate {
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
    ...(commodityConfig.additionalValidation ?? []),
  ];

  // Merge required fields
  const mergedRequiredFields = [
    ...baseTemplate.requiredFields,
    ...(commodityConfig.additionalRequiredFields ?? []),
  ];

  return {
    ...baseTemplate,
    name: commodityConfig.displayName,
    requiredFields: Array.from(new Set(mergedRequiredFields)),
    validationRules: mergedRules,
  };
}
