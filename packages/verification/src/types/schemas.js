"use strict";
// ============================================================================
// VERIFICATION SCHEMAS
// Zod schemas for runtime validation of verification types
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationProofRefSchema = exports.CryptographicProofRefSchema = exports.CertificateTemplateSchema = exports.ValidationRuleSchema = exports.CertificateVerificationResultSchema = exports.MilitaryGradeCertificateSchema = exports.StandardCertificateSchema = exports.ComplianceDataSchema = exports.PhotoEvidenceRefSchema = exports.BaseCertificateSchema = exports.CertificateVerificationDataSchema = exports.MultiSignatureSchema = exports.CertificateMetadataSchema = exports.ClaimSchema = exports.ClaimEvidenceSchema = exports.ClaimProofSchema = exports.PredicateDefinitionSchema = exports.AIMetadataSchema = exports.TemporalRulesSchema = exports.ConfidenceRulesSchema = exports.AttestationRulesSchema = exports.EvidenceRequirementsSchema = exports.AttestorPatternSchema = exports.PredicateSchemaSchema = exports.PredicateURISchema = exports.QRCodeVerificationResultSchema = exports.GeneratedQRCodeSchema = exports.QRCodeDataSchema = exports.QRCodeMetadataSchema = exports.AssetLotDataSchema = exports.SiteReferenceSchema = exports.ResourceContextSchema = exports.ValidationMetricsSchema = exports.EnvironmentalFactorsSchema = exports.CertificateLocationSchema = exports.EvidenceTypeSchema = exports.PredicateDomainSchema = exports.OperatorRoleSchema = exports.SiteTypeSchema = exports.SiteCategorySchema = exports.AssetLifecycleStateSchema = exports.QualityGradeSchema = exports.MeasurementUnitSchema = exports.CommodityTypeSchema = exports.AssetCategorySchema = exports.OperatorTierSchema = exports.CredentialTypeSchema = exports.QRCodeTypeSchema = exports.CertificateTypeSchema = exports.CertificateSecurityLevelSchema = void 0;
exports.CommodityConfigSchema = exports.ProofBundleSchema = exports.PhotoProofRefSchema = void 0;
const zod_1 = require("zod");
// ============================================================================
// BASIC ENUMS AS SCHEMAS
// ============================================================================
exports.CertificateSecurityLevelSchema = zod_1.z.enum([
    'standard',
    'enhanced',
    'military',
    'quantum-resistant',
]);
exports.CertificateTypeSchema = zod_1.z.enum([
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
exports.QRCodeTypeSchema = zod_1.z.enum(['location', 'photo', 'certificate', 'asset-lot']);
exports.CredentialTypeSchema = zod_1.z.enum([
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
exports.OperatorTierSchema = zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2), zod_1.z.literal(3)]);
exports.AssetCategorySchema = zod_1.z.enum([
    'PreciousMetals',
    'Agricultural',
    'IndustrialMinerals',
    'Gemstones',
    'Energy',
]);
exports.CommodityTypeSchema = zod_1.z.enum([
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
exports.MeasurementUnitSchema = zod_1.z.enum([
    'g', 'kg', 'oz', 'troy_oz', 'lb', 'mt',
    'ct',
    'bag', 'bale', 'barrel',
    'l', 'gal',
]);
exports.QualityGradeSchema = zod_1.z.enum(['high', 'medium', 'low', 'ungraded']);
exports.AssetLifecycleStateSchema = zod_1.z.enum([
    'RAW',
    'PRIMARY_PROCESSED',
    'SECONDARY_PROCESSED',
    'REFINED',
    'CERTIFIED',
    'FINISHED',
    'TRANSFERRED',
]);
exports.SiteCategorySchema = zod_1.z.enum([
    'ExtractionSite',
    'ProcessingFacility',
    'StorageFacility',
    'TransitPoint',
    'TradePremises',
    'Port',
    'BorderCrossing',
]);
exports.SiteTypeSchema = zod_1.z.enum([
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
exports.OperatorRoleSchema = zod_1.z.enum([
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
exports.PredicateDomainSchema = zod_1.z.enum([
    'identity',
    'compliance',
    'asset',
    'location',
    'relationship',
    'temporal',
    'financial',
    'composite',
]);
exports.EvidenceTypeSchema = zod_1.z.enum([
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
exports.CertificateLocationSchema = zod_1.z.object({
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    altitude: zod_1.z.number().optional(),
    accuracy: zod_1.z.number().positive(),
    timestamp: zod_1.z.number(),
});
exports.EnvironmentalFactorsSchema = zod_1.z.object({
    satelliteCount: zod_1.z.number().int().nonnegative(),
    signalStrength: zod_1.z.number(),
    atmosphericConditions: zod_1.z.string(),
    multipathIndicator: zod_1.z.boolean(),
});
exports.ValidationMetricsSchema = zod_1.z.object({
    isJammed: zod_1.z.boolean(),
    isSpoofed: zod_1.z.boolean(),
    confidenceLevel: zod_1.z.number().min(0).max(1),
    integrityCheck: zod_1.z.boolean(),
});
exports.ResourceContextSchema = zod_1.z.object({
    commodityPotential: zod_1.z.enum(['high', 'medium', 'low', 'none']),
    commodityType: exports.CommodityTypeSchema.optional(),
    formation: zod_1.z.string().optional(),
    confidence: zod_1.z.number().min(0).max(1),
    source: zod_1.z.string().optional(),
});
// ============================================================================
// SITE SCHEMAS
// ============================================================================
exports.SiteReferenceSchema = zod_1.z.object({
    siteId: zod_1.z.string(),
    name: zod_1.z.string(),
    category: exports.SiteCategorySchema.optional(),
    siteType: exports.SiteTypeSchema.optional(),
    region: zod_1.z.string(),
    country: zod_1.z.string(),
});
// ============================================================================
// ASSET LOT SCHEMAS
// ============================================================================
exports.AssetLotDataSchema = zod_1.z.object({
    lotId: zod_1.z.string().optional(),
    commodityType: exports.CommodityTypeSchema,
    commoditySubtype: zod_1.z.string().optional(),
    category: exports.AssetCategorySchema.optional(),
    estimatedWeight: zod_1.z.number().positive(),
    unit: exports.MeasurementUnitSchema,
    quality: exports.QualityGradeSchema.optional(),
    purity: zod_1.z.number().min(0).max(100).optional(),
    state: exports.AssetLifecycleStateSchema.optional(),
    previousState: exports.AssetLifecycleStateSchema.optional(),
    producerId: zod_1.z.string().optional(),
    operatorRole: exports.OperatorRoleSchema.optional(),
    discoveryDate: zod_1.z.string().optional(),
    siteId: zod_1.z.string().optional(),
    site: exports.SiteReferenceSchema.optional(),
    attributes: zod_1.z.record(zod_1.z.unknown()).optional(),
});
// ============================================================================
// QR CODE SCHEMAS
// ============================================================================
exports.QRCodeMetadataSchema = zod_1.z.object({
    location: zod_1.z.object({
        latitude: zod_1.z.number(),
        longitude: zod_1.z.number(),
    }).optional(),
    assetWeight: zod_1.z.number().optional(),
    assetUnit: exports.MeasurementUnitSchema.optional(),
    commodityType: exports.CommodityTypeSchema.optional(),
    assetState: exports.AssetLifecycleStateSchema.optional(),
    purity: zod_1.z.number().optional(),
    producerId: zod_1.z.string().optional(),
    operatorRole: exports.OperatorRoleSchema.optional(),
});
exports.QRCodeDataSchema = zod_1.z.object({
    certificateId: zod_1.z.string(),
    verifyUrl: zod_1.z.string().url(),
    hash: zod_1.z.string(),
    timestamp: zod_1.z.number(),
    type: exports.QRCodeTypeSchema,
    metadata: exports.QRCodeMetadataSchema.optional(),
});
exports.GeneratedQRCodeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    data: exports.QRCodeDataSchema,
    qrCodeUri: zod_1.z.string(),
    dataString: zod_1.z.string(),
    size: zod_1.z.number().int().positive(),
    timestamp: zod_1.z.number(),
});
exports.QRCodeVerificationResultSchema = zod_1.z.object({
    isValid: zod_1.z.boolean(),
    data: exports.QRCodeDataSchema.optional(),
    error: zod_1.z.string().optional(),
});
// ============================================================================
// PREDICATE SCHEMAS
// ============================================================================
exports.PredicateURISchema = zod_1.z.string().regex(/^tradepass:\/\/[^/]+\/[^/]+\/[^/]+$/);
exports.PredicateSchemaSchema = zod_1.z.object({
    type: zod_1.z.enum(['boolean', 'enum', 'string', 'number', 'date', 'object']),
    values: zod_1.z.array(zod_1.z.string()).optional(),
    min: zod_1.z.number().optional(),
    max: zod_1.z.number().optional(),
    pattern: zod_1.z.string().optional(),
    properties: zod_1.z.record(zod_1.z.lazy(() => exports.PredicateSchemaSchema)).optional(),
});
exports.AttestorPatternSchema = zod_1.z.object({
    type: zod_1.z.enum(['exact', 'pattern', 'credential']),
    value: zod_1.z.string(),
    credentialRequired: exports.CredentialTypeSchema.optional(),
});
exports.EvidenceRequirementsSchema = zod_1.z.object({
    required: zod_1.z.array(exports.EvidenceTypeSchema),
    optional: zod_1.z.array(exports.EvidenceTypeSchema).optional(),
    alternatives: zod_1.z.array(zod_1.z.array(exports.EvidenceTypeSchema)).optional(),
});
exports.AttestationRulesSchema = zod_1.z.object({
    allowedAttestors: zod_1.z.array(exports.AttestorPatternSchema),
    selfAttestation: zod_1.z.boolean(),
    multiSignatureRequired: zod_1.z.boolean().optional(),
    minimumAttestors: zod_1.z.number().int().positive().optional(),
});
exports.ConfidenceRulesSchema = zod_1.z.object({
    baseScore: zod_1.z.number().min(0).max(1),
    evidenceWeights: zod_1.z.record(zod_1.z.number()),
    minimumThreshold: zod_1.z.number().min(0).max(1),
    decayModel: zod_1.z.enum(['linear', 'exponential', 'none']).optional(),
    halfLife: zod_1.z.number().positive().optional(),
});
exports.TemporalRulesSchema = zod_1.z.object({
    validDuration: zod_1.z.string(),
    renewalRequired: zod_1.z.boolean(),
    monitoringType: zod_1.z.enum(['continuous', 'periodic', 'event_triggered']).optional(),
    triggers: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.AIMetadataSchema = zod_1.z.object({
    embeddingModel: zod_1.z.string(),
    reasoningHints: zod_1.z.array(zod_1.z.string()),
    relatedPredicates: zod_1.z.array(exports.PredicateURISchema),
    contradictoryPredicates: zod_1.z.array(exports.PredicateURISchema).optional(),
    contextTemplate: zod_1.z.string(),
});
exports.PredicateDefinitionSchema = zod_1.z.object({
    uri: exports.PredicateURISchema,
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    domain: exports.PredicateDomainSchema,
    version: zod_1.z.string(),
    schema: exports.PredicateSchemaSchema,
    evidence: exports.EvidenceRequirementsSchema,
    attestation: exports.AttestationRulesSchema,
    confidence: exports.ConfidenceRulesSchema,
    temporal: exports.TemporalRulesSchema,
    ai: exports.AIMetadataSchema,
});
// ============================================================================
// CLAIM SCHEMAS
// ============================================================================
exports.ClaimProofSchema = zod_1.z.object({
    type: zod_1.z.enum(['Ed25519Signature2020', 'EcdsaSecp256k1Signature2019']),
    created: zod_1.z.string(),
    verificationMethod: zod_1.z.string(),
    proofValue: zod_1.z.string(),
});
exports.ClaimEvidenceSchema = zod_1.z.object({
    type: exports.EvidenceTypeSchema,
    hash: zod_1.z.string(),
    timestamp: zod_1.z.number(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.ClaimSchema = zod_1.z.object({
    id: zod_1.z.string(),
    subject: zod_1.z.string(),
    predicate: exports.PredicateURISchema,
    value: zod_1.z.unknown(),
    evidence: zod_1.z.array(exports.ClaimEvidenceSchema),
    attestor: zod_1.z.string(),
    confidence: zod_1.z.number().min(0).max(1),
    issuedAt: zod_1.z.number(),
    validUntil: zod_1.z.number().optional(),
    proof: exports.ClaimProofSchema,
});
// ============================================================================
// CERTIFICATE SCHEMAS
// ============================================================================
exports.CertificateMetadataSchema = zod_1.z.object({
    issuer: zod_1.z.string(),
    issuedAt: zod_1.z.number(),
    expiresAt: zod_1.z.number().optional(),
    userRole: zod_1.z.string(),
    deviceId: zod_1.z.string(),
    location: exports.CertificateLocationSchema,
    resourceContext: exports.ResourceContextSchema.optional(),
    geologicalContext: zod_1.z.object({
        goldPotential: zod_1.z.enum(['high', 'medium', 'low', 'none']),
        formation: zod_1.z.string().optional(),
        confidence: zod_1.z.number(),
    }).optional(),
    environmentalFactors: exports.EnvironmentalFactorsSchema.optional(),
    validationMetrics: exports.ValidationMetricsSchema.optional(),
});
exports.MultiSignatureSchema = zod_1.z.object({
    ed25519: zod_1.z.string(),
    secp256k1: zod_1.z.string().optional(),
});
exports.CertificateVerificationDataSchema = zod_1.z.object({
    publicKey: zod_1.z.string(),
    signature: zod_1.z.string(),
    timestamp: zod_1.z.number(),
    entropyQuality: zod_1.z.number().optional(),
});
exports.BaseCertificateSchema = zod_1.z.object({
    certificateId: zod_1.z.string(),
    version: zod_1.z.string(),
    type: exports.CertificateTypeSchema,
    securityLevel: exports.CertificateSecurityLevelSchema,
    metadata: exports.CertificateMetadataSchema,
    verificationData: exports.CertificateVerificationDataSchema,
    createdAt: zod_1.z.number(),
});
exports.PhotoEvidenceRefSchema = zod_1.z.object({
    id: zod_1.z.string(),
    hash: zod_1.z.string(),
    timestamp: zod_1.z.number(),
});
exports.ComplianceDataSchema = zod_1.z.object({
    permitNumber: zod_1.z.string().optional(),
    inspectorId: zod_1.z.string().optional(),
    complianceLevel: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    gciScore: zod_1.z.number().min(0).max(100).optional(),
    claims: zod_1.z.array(exports.ClaimSchema).optional(),
});
exports.StandardCertificateSchema = exports.BaseCertificateSchema.extend({
    securityLevel: zod_1.z.enum(['standard', 'enhanced']),
    dataHash: zod_1.z.string(),
    signature: zod_1.z.string(),
});
exports.MilitaryGradeCertificateSchema = exports.BaseCertificateSchema.extend({
    securityLevel: zod_1.z.enum(['military', 'quantum-resistant']),
    quantumResistantHash: zod_1.z.string(),
    multiSignature: exports.MultiSignatureSchema,
    certificateData: zod_1.z.object({
        assetLotData: exports.AssetLotDataSchema.optional(),
        goldLotData: zod_1.z.object({
            estimatedWeight: zod_1.z.number(),
            quality: zod_1.z.enum(['high', 'medium', 'low']).optional(),
            purity: zod_1.z.number().optional(),
            miner: zod_1.z.string().optional(),
            discoveryDate: zod_1.z.string().optional(),
        }).optional(),
        photoEvidence: zod_1.z.array(exports.PhotoEvidenceRefSchema).optional(),
        workflowContext: zod_1.z.string().optional(),
        complianceData: exports.ComplianceDataSchema.optional(),
        claims: zod_1.z.array(exports.ClaimSchema).optional(),
    }),
});
exports.CertificateVerificationResultSchema = zod_1.z.object({
    isValid: zod_1.z.boolean(),
    certificate: exports.BaseCertificateSchema.optional(),
    confidence: zod_1.z.number().min(0).max(1),
    details: zod_1.z.string(),
    checks: zod_1.z.object({
        hashValid: zod_1.z.boolean(),
        signatureValid: zod_1.z.boolean(),
        timestampValid: zod_1.z.boolean(),
        notExpired: zod_1.z.boolean(),
    }),
});
// ============================================================================
// TEMPLATE SCHEMAS
// ============================================================================
exports.ValidationRuleSchema = zod_1.z.object({
    field: zod_1.z.string(),
    min: zod_1.z.number().optional(),
    max: zod_1.z.number().optional(),
    value: zod_1.z.union([zod_1.z.boolean(), zod_1.z.string(), zod_1.z.number()]).optional(),
    message: zod_1.z.string(),
});
exports.CertificateTemplateSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    type: exports.CertificateTypeSchema,
    securityLevel: exports.CertificateSecurityLevelSchema,
    requiredFields: zod_1.z.array(zod_1.z.string()),
    optionalFields: zod_1.z.array(zod_1.z.string()),
    validationRules: zod_1.z.array(exports.ValidationRuleSchema),
    requiredPredicates: zod_1.z.array(exports.PredicateURISchema).optional(),
});
// ============================================================================
// PROOF BUNDLE SCHEMAS
// ============================================================================
exports.CryptographicProofRefSchema = zod_1.z.object({
    algorithm: zod_1.z.string(),
    dataHash: zod_1.z.string(),
    signature: zod_1.z.string(),
    publicKey: zod_1.z.string(),
});
exports.LocationProofRefSchema = zod_1.z.object({
    id: zod_1.z.string(),
    coordinates: exports.CertificateLocationSchema,
    hash: zod_1.z.string(),
});
exports.PhotoProofRefSchema = zod_1.z.object({
    id: zod_1.z.string(),
    uri: zod_1.z.string(),
    hash: zod_1.z.string(),
    timestamp: zod_1.z.number(),
});
exports.ProofBundleSchema = zod_1.z.object({
    id: zod_1.z.string(),
    type: zod_1.z.enum(['location', 'photo', 'workflow', 'certificate']),
    timestamp: zod_1.z.number(),
    proofs: zod_1.z.object({
        cryptographicProof: exports.CryptographicProofRefSchema,
        locationProof: exports.LocationProofRefSchema.optional(),
        photoProofs: zod_1.z.array(exports.PhotoProofRefSchema).optional(),
    }),
    certificate: exports.BaseCertificateSchema.optional(),
    qrCode: exports.GeneratedQRCodeSchema.optional(),
    claims: zod_1.z.array(exports.ClaimSchema).optional(),
});
// ============================================================================
// COMMODITY CONFIG SCHEMA
// ============================================================================
exports.CommodityConfigSchema = zod_1.z.object({
    type: exports.CommodityTypeSchema,
    category: exports.AssetCategorySchema,
    displayName: zod_1.z.string(),
    defaultUnit: exports.MeasurementUnitSchema,
    allowedUnits: zod_1.z.array(exports.MeasurementUnitSchema),
    hasPurity: zod_1.z.boolean(),
    qualityGrades: zod_1.z.array(exports.QualityGradeSchema),
    primaryProducerRole: exports.OperatorRoleSchema,
    primarySiteType: exports.SiteTypeSchema,
    settings: zod_1.z.record(zod_1.z.unknown()).optional(),
});
//# sourceMappingURL=schemas.js.map