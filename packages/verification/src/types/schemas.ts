// ============================================================================
// VERIFICATION SCHEMAS
// Zod schemas for runtime validation of verification types
// ============================================================================

import { z } from 'zod';

// ============================================================================
// BASIC ENUMS AS SCHEMAS
// ============================================================================

export const CertificateSecurityLevelSchema = z.enum([
  'standard',
  'enhanced', 
  'military',
  'quantum-resistant',
]);

export const CertificateTypeSchema = z.enum([
  'asset-origin',
  'location',
  'photo',
  'work-site',
  'compliance',
  'government-inspection',
  'custody-transfer',
  'settlement',
  'quality-assay',
  'chain-of-custody',
]);

export const QRCodeTypeSchema = z.enum(['location', 'photo', 'certificate', 'asset-lot']);

export const CredentialTypeSchema = z.enum([
  'TradePass',
  'ProducerID',
  'SiteID',
  'AggregatorID',
  'ProcessorID',
  'TraderID',
  'CustodyID',
  'LogisticsID',
  'CertifierID',
  'BuyerID',
  'AuthorityID',
  'FinanceID',
  'SecurityID',
]);

export const OperatorTierSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export const AssetCategorySchema = z.enum([
  'PreciousMetals',
  'Agricultural',
  'IndustrialMinerals',
  'Gemstones',
  'Energy',
]);

export const CommodityTypeSchema = z.enum([
  // Precious Metals
  'gold', 'silver', 'platinum', 'palladium', 'rhodium',
  // Agricultural
  'cocoa', 'coffee', 'cotton', 'sugar', 'vanilla', 'palm_oil', 'rubber',
  // Industrial Minerals
  'cobalt', 'lithium', 'copper', 'tin', 'tantalum', 'tungsten',
  // Gemstones
  'diamond', 'ruby', 'emerald', 'sapphire',
  // Energy
  'crude_oil', 'natural_gas', 'lng',
  // Fallback
  'other',
]);

export const MeasurementUnitSchema = z.enum([
  'g', 'kg', 'oz', 'troy_oz', 'lb', 'mt',
  'ct',
  'bag', 'bale', 'barrel',
  'l', 'gal',
]);

export const QualityGradeSchema = z.enum(['high', 'medium', 'low', 'ungraded']);

export const AssetLifecycleStateSchema = z.enum([
  'RAW',
  'PRIMARY_PROCESSED',
  'SECONDARY_PROCESSED',
  'REFINED',
  'CERTIFIED',
  'FINISHED',
  'TRANSFERRED',
]);

export const SiteCategorySchema = z.enum([
  'ExtractionSite',
  'ProcessingFacility',
  'StorageFacility',
  'TransitPoint',
  'TradePremises',
  'Port',
  'BorderCrossing',
]);

export const SiteTypeSchema = z.enum([
  // Extraction
  'mine', 'farm', 'plantation', 'fishery', 'forest', 'quarry',
  // Processing
  'mill', 'refinery', 'smelter', 'drying-facility', 'washing-plant', 'factory',
  // Storage
  'vault', 'warehouse', 'silo', 'free-zone', 'bonded-warehouse',
  // Transit
  'collection-center', 'weighing-station', 'checkpoint', 'transfer-hub',
  // Trade
  'buying-center', 'trading-office', 'retail-shop', 'auction-house',
  // Port/Border
  'seaport', 'airport', 'inland-port', 'customs-post', 'land-border',
]);

export const OperatorRoleSchema = z.enum([
  'producer',
  'aggregator',
  'processor',
  'trader',
  'custodian',
  'transporter',
  'certifier',
  'buyer',
  'authority',
  'financier',
  'security',
]);

export const PredicateDomainSchema = z.enum([
  'identity',
  'compliance',
  'asset',
  'location',
  'relationship',
  'temporal',
  'financial',
  'composite',
]);

export const EvidenceTypeSchema = z.enum([
  'government_id',
  'biometric_face',
  'biometric_fingerprint',
  'corporate_registry',
  'sanctions_screening',
  'site_audit',
  'assay_report',
  'photo_evidence',
  'gps_location',
  'document_hash',
  'witness_attestation',
]);

// ============================================================================
// LOCATION & ENVIRONMENTAL SCHEMAS
// ============================================================================

export const CertificateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  altitude: z.number().optional(),
  accuracy: z.number().positive(),
  timestamp: z.number(),
});

export const EnvironmentalFactorsSchema = z.object({
  satelliteCount: z.number().int().nonnegative(),
  signalStrength: z.number(),
  atmosphericConditions: z.string(),
  multipathIndicator: z.boolean(),
});

export const ValidationMetricsSchema = z.object({
  isJammed: z.boolean(),
  isSpoofed: z.boolean(),
  confidenceLevel: z.number().min(0).max(1),
  integrityCheck: z.boolean(),
});

export const ResourceContextSchema = z.object({
  commodityPotential: z.enum(['high', 'medium', 'low', 'none']),
  commodityType: CommodityTypeSchema.optional(),
  formation: z.string().optional(),
  confidence: z.number().min(0).max(1),
  source: z.string().optional(),
});

// ============================================================================
// SITE SCHEMAS
// ============================================================================

export const SiteReferenceSchema = z.object({
  siteId: z.string(),
  name: z.string(),
  category: SiteCategorySchema.optional(),
  siteType: SiteTypeSchema.optional(),
  region: z.string(),
  country: z.string(),
});

// ============================================================================
// ASSET LOT SCHEMAS
// ============================================================================

export const AssetLotDataSchema = z.object({
  lotId: z.string().optional(),
  commodityType: CommodityTypeSchema,
  commoditySubtype: z.string().optional(),
  category: AssetCategorySchema.optional(),
  estimatedWeight: z.number().positive(),
  unit: MeasurementUnitSchema,
  quality: QualityGradeSchema.optional(),
  purity: z.number().min(0).max(100).optional(),
  state: AssetLifecycleStateSchema.optional(),
  previousState: AssetLifecycleStateSchema.optional(),
  producerId: z.string().optional(),
  operatorRole: OperatorRoleSchema.optional(),
  discoveryDate: z.string().optional(),
  siteId: z.string().optional(),
  site: SiteReferenceSchema.optional(),
  attributes: z.record(z.unknown()).optional(),
});

// ============================================================================
// QR CODE SCHEMAS
// ============================================================================

export const QRCodeMetadataSchema = z.object({
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  assetWeight: z.number().optional(),
  assetUnit: MeasurementUnitSchema.optional(),
  commodityType: CommodityTypeSchema.optional(),
  assetState: AssetLifecycleStateSchema.optional(),
  purity: z.number().optional(),
  producerId: z.string().optional(),
  operatorRole: OperatorRoleSchema.optional(),
});

export const QRCodeDataSchema = z.object({
  certificateId: z.string(),
  verifyUrl: z.string().url(),
  hash: z.string(),
  timestamp: z.number(),
  type: QRCodeTypeSchema,
  metadata: QRCodeMetadataSchema.optional(),
});

export const GeneratedQRCodeSchema = z.object({
  id: z.string(),
  data: QRCodeDataSchema,
  qrCodeUri: z.string(),
  dataString: z.string(),
  size: z.number().int().positive(),
  timestamp: z.number(),
});

export const QRCodeVerificationResultSchema = z.object({
  isValid: z.boolean(),
  data: QRCodeDataSchema.optional(),
  error: z.string().optional(),
});

// ============================================================================
// PREDICATE SCHEMAS
// ============================================================================

export const PredicateURISchema = z.string().regex(/^tradepass:\/\/[^/]+\/[^/]+\/[^/]+$/);

export const PredicateSchemaSchema: z.ZodType<any> = z.object({
  type: z.enum(['boolean', 'enum', 'string', 'number', 'date', 'object']),
  values: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  properties: z.record(z.lazy(() => PredicateSchemaSchema)).optional(),
});

export const AttestorPatternSchema = z.object({
  type: z.enum(['exact', 'pattern', 'credential']),
  value: z.string(),
  credentialRequired: CredentialTypeSchema.optional(),
});

export const EvidenceRequirementsSchema = z.object({
  required: z.array(EvidenceTypeSchema),
  optional: z.array(EvidenceTypeSchema).optional(),
  alternatives: z.array(z.array(EvidenceTypeSchema)).optional(),
});

export const AttestationRulesSchema = z.object({
  allowedAttestors: z.array(AttestorPatternSchema),
  selfAttestation: z.boolean(),
  multiSignatureRequired: z.boolean().optional(),
  minimumAttestors: z.number().int().positive().optional(),
});

export const ConfidenceRulesSchema = z.object({
  baseScore: z.number().min(0).max(1),
  evidenceWeights: z.record(z.number()),
  minimumThreshold: z.number().min(0).max(1),
  decayModel: z.enum(['linear', 'exponential', 'none']).optional(),
  halfLife: z.number().positive().optional(),
});

export const TemporalRulesSchema = z.object({
  validDuration: z.string(),
  renewalRequired: z.boolean(),
  monitoringType: z.enum(['continuous', 'periodic', 'event_triggered']).optional(),
  triggers: z.array(z.string()).optional(),
});

export const AIMetadataSchema = z.object({
  embeddingModel: z.string(),
  reasoningHints: z.array(z.string()),
  relatedPredicates: z.array(PredicateURISchema),
  contradictoryPredicates: z.array(PredicateURISchema).optional(),
  contextTemplate: z.string(),
});

export const PredicateDefinitionSchema = z.object({
  uri: PredicateURISchema,
  name: z.string(),
  description: z.string(),
  domain: PredicateDomainSchema,
  version: z.string(),
  schema: PredicateSchemaSchema,
  evidence: EvidenceRequirementsSchema,
  attestation: AttestationRulesSchema,
  confidence: ConfidenceRulesSchema,
  temporal: TemporalRulesSchema,
  ai: AIMetadataSchema,
});

// ============================================================================
// CLAIM SCHEMAS
// ============================================================================

export const ClaimProofSchema = z.object({
  type: z.enum(['Ed25519Signature2020', 'EcdsaSecp256k1Signature2019']),
  created: z.string(),
  verificationMethod: z.string(),
  proofValue: z.string(),
});

export const ClaimEvidenceSchema = z.object({
  type: EvidenceTypeSchema,
  hash: z.string(),
  timestamp: z.number(),
  metadata: z.record(z.unknown()).optional(),
});

export const ClaimSchema = z.object({
  id: z.string(),
  subject: z.string(),
  predicate: PredicateURISchema,
  value: z.unknown(),
  evidence: z.array(ClaimEvidenceSchema),
  attestor: z.string(),
  confidence: z.number().min(0).max(1),
  issuedAt: z.number(),
  validUntil: z.number().optional(),
  proof: ClaimProofSchema,
});

// ============================================================================
// CERTIFICATE SCHEMAS
// ============================================================================

export const CertificateMetadataSchema = z.object({
  issuer: z.string(),
  issuedAt: z.number(),
  expiresAt: z.number().optional(),
  userRole: z.string(),
  deviceId: z.string(),
  location: CertificateLocationSchema,
  resourceContext: ResourceContextSchema.optional(),
  geologicalContext: z.object({
    goldPotential: z.enum(['high', 'medium', 'low', 'none']),
    formation: z.string().optional(),
    confidence: z.number(),
  }).optional(),
  environmentalFactors: EnvironmentalFactorsSchema.optional(),
  validationMetrics: ValidationMetricsSchema.optional(),
});

export const MultiSignatureSchema = z.object({
  ed25519: z.string(),
  secp256k1: z.string().optional(),
});

export const CertificateVerificationDataSchema = z.object({
  publicKey: z.string(),
  signature: z.string(),
  timestamp: z.number(),
  entropyQuality: z.number().optional(),
});

export const BaseCertificateSchema = z.object({
  certificateId: z.string(),
  version: z.string(),
  type: CertificateTypeSchema,
  securityLevel: CertificateSecurityLevelSchema,
  metadata: CertificateMetadataSchema,
  verificationData: CertificateVerificationDataSchema,
  createdAt: z.number(),
});

export const PhotoEvidenceRefSchema = z.object({
  id: z.string(),
  hash: z.string(),
  timestamp: z.number(),
});

export const ComplianceDataSchema = z.object({
  permitNumber: z.string().optional(),
  inspectorId: z.string().optional(),
  complianceLevel: z.string().optional(),
  notes: z.string().optional(),
  gciScore: z.number().min(0).max(100).optional(),
  claims: z.array(ClaimSchema).optional(),
});

export const StandardCertificateSchema = BaseCertificateSchema.extend({
  securityLevel: z.enum(['standard', 'enhanced']),
  dataHash: z.string(),
  signature: z.string(),
});

export const MilitaryGradeCertificateSchema = BaseCertificateSchema.extend({
  securityLevel: z.enum(['military', 'quantum-resistant']),
  quantumResistantHash: z.string(),
  multiSignature: MultiSignatureSchema,
  certificateData: z.object({
    assetLotData: AssetLotDataSchema.optional(),
    goldLotData: z.object({
      estimatedWeight: z.number(),
      quality: z.enum(['high', 'medium', 'low']).optional(),
      purity: z.number().optional(),
      miner: z.string().optional(),
      discoveryDate: z.string().optional(),
    }).optional(),
    photoEvidence: z.array(PhotoEvidenceRefSchema).optional(),
    workflowContext: z.string().optional(),
    complianceData: ComplianceDataSchema.optional(),
    claims: z.array(ClaimSchema).optional(),
  }),
});

export const CertificateVerificationResultSchema = z.object({
  isValid: z.boolean(),
  certificate: BaseCertificateSchema.optional(),
  confidence: z.number().min(0).max(1),
  details: z.string(),
  checks: z.object({
    hashValid: z.boolean(),
    signatureValid: z.boolean(),
    timestampValid: z.boolean(),
    notExpired: z.boolean(),
  }),
});

// ============================================================================
// TEMPLATE SCHEMAS
// ============================================================================

export const ValidationRuleSchema = z.object({
  field: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
  value: z.union([z.boolean(), z.string(), z.number()]).optional(),
  message: z.string(),
});

export const CertificateTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: CertificateTypeSchema,
  securityLevel: CertificateSecurityLevelSchema,
  requiredFields: z.array(z.string()),
  optionalFields: z.array(z.string()),
  validationRules: z.array(ValidationRuleSchema),
  requiredPredicates: z.array(PredicateURISchema).optional(),
});

// ============================================================================
// PROOF BUNDLE SCHEMAS
// ============================================================================

export const CryptographicProofRefSchema = z.object({
  algorithm: z.string(),
  dataHash: z.string(),
  signature: z.string(),
  publicKey: z.string(),
});

export const LocationProofRefSchema = z.object({
  id: z.string(),
  coordinates: CertificateLocationSchema,
  hash: z.string(),
});

export const PhotoProofRefSchema = z.object({
  id: z.string(),
  uri: z.string(),
  hash: z.string(),
  timestamp: z.number(),
});

export const ProofBundleSchema = z.object({
  id: z.string(),
  type: z.enum(['location', 'photo', 'workflow', 'certificate']),
  timestamp: z.number(),
  proofs: z.object({
    cryptographicProof: CryptographicProofRefSchema,
    locationProof: LocationProofRefSchema.optional(),
    photoProofs: z.array(PhotoProofRefSchema).optional(),
  }),
  certificate: BaseCertificateSchema.optional(),
  qrCode: GeneratedQRCodeSchema.optional(),
  claims: z.array(ClaimSchema).optional(),
});

// ============================================================================
// COMMODITY CONFIG SCHEMA
// ============================================================================

export const CommodityConfigSchema = z.object({
  type: CommodityTypeSchema,
  category: AssetCategorySchema,
  displayName: z.string(),
  defaultUnit: MeasurementUnitSchema,
  allowedUnits: z.array(MeasurementUnitSchema),
  hasPurity: z.boolean(),
  qualityGrades: z.array(QualityGradeSchema),
  primaryProducerRole: OperatorRoleSchema,
  primarySiteType: SiteTypeSchema,
  settings: z.record(z.unknown()).optional(),
});
