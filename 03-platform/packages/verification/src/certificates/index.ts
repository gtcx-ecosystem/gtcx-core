// ============================================================================
// CERTIFICATES MODULE - PUBLIC API
// Aligned with TradePass™ Credential Taxonomy & Predicate Architecture
// ============================================================================

export {
  // Templates - commodity-agnostic
  ASSET_ORIGIN_TEMPLATE,
  WORK_SITE_TEMPLATE,
  GOVERNMENT_INSPECTOR_TEMPLATE,
  LOCATION_TEMPLATE,
  PHOTO_TEMPLATE,
  COMPLIANCE_TEMPLATE,
  CUSTODY_TRANSFER_TEMPLATE,
  SETTLEMENT_TEMPLATE,
  CERTIFICATE_TEMPLATES,

  // Legacy alias (deprecated)
  GOLD_ORIGIN_TEMPLATE,

  // Commodity-specific configurations
  COMMODITY_CERTIFICATE_CONFIGS,
  getCommodityCertificateConfig,
  createCommodityCertificateConfig,
  getEffectiveTemplate,

  // Template utilities
  getTemplate,
  getTemplatesBySecurityLevel,
  getTemplatesByType,
  listTemplateIds,

  // Types
  type CommodityCertificateConfig,
} from './templates';

export {
  // Error classes
  VerificationError,

  // Generator functions
  generateCertificateId,
  validateCertificateInput,
  createCertificateMetadata,
  createDefaultEnvironmentalFactors,
  createDefaultValidationMetrics,
  createStandardCertificateData,
  createMilitaryGradeCertificateData,

  // Verification
  verifyCertificateStructure,
  isCertificateExpired,
  getCertificateAge,

  // Utilities
  formatCertificateForDisplay,
  getCertificateCommodityType,

  // Types
  type CreateCertificateInput,
} from './generator';

export {
  // Revocation
  RevocationRegistry,
  checkRevocationStatus,
  assertNotRevoked,
  // Pluggable revocation backend (SA-004 / AT-002)
  createInMemoryRevocationChecker,
  createDenyAllRevocationChecker,
  createNoopRevocationChecker,
  type RevocationChecker,
  type RevocationStatus,
  type RevocationEntry,
} from './revocation';

// Re-export types from central types
export type {
  // Core certificate types
  Certificate,
  StandardCertificate,
  MilitaryGradeCertificate,
  CertificateType,
  CertificateSecurityLevel,
  CertificateMetadata,
  CertificateLocation,
  CertificateVerificationData,
  CertificateVerificationResult,
  CertificateTemplate,
  ValidationRule,
  PhotoEvidenceRef,
  ComplianceData,
  CustodyEntry,
  EnvironmentalFactors,
  SettlementRecord,
  ValidationMetrics,

  // Credential types (TradePass™ Taxonomy)
  CredentialType,
  CredentialSubtypes,
  OperatorTier,

  // Commodity-agnostic types
  AssetLotData,
  AssetCategory,
  AssetLifecycleState,
  ResourceContext,
  CommodityType,
  MeasurementUnit,
  QualityGrade,
  OperatorRole,
  CommodityConfig,

  // Site taxonomy
  SiteCategory,
  SiteTypes,
  SiteType,
  SiteReference,

  // Predicate foundation
  PredicateURI,
  PredicateDomain,
  PredicateDefinition,
  PredicateSchema,
  EvidenceRequirements,
  EvidenceType,
  AttestationRules,
  AttestorPattern,
  ConfidenceRules,
  TemporalRules,
  AIMetadata,
  Claim,
  ClaimEvidence,
  ClaimProof,

  // Legacy types (deprecated)
  GoldLotData,
  GeologicalContext,
} from '../types';

// Re-export constants
export {
  COMMODITY_CONFIGS,
  COMMODITY_CATEGORIES,
  ROLE_TO_CREDENTIAL,
  getCommodityConfig,
  getCommodityCategory,
  getCredentialForRole,
  migrateGoldLotData,
} from '../types';
