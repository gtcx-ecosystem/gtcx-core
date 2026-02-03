/**
 * Security levels for certificates
 */
export type CertificateSecurityLevel = 'standard' | 'enhanced' | 'military' | 'quantum-resistant';
/**
 * Certificate type discriminator - ROLE-BASED, not commodity-specific
 * These map to verification activities, not credential types
 */
export type CertificateType = 'asset-origin' | 'location' | 'photo' | 'work-site' | 'compliance' | 'government-inspection' | 'custody-transfer' | 'settlement' | 'quality-assay' | 'chain-of-custody';
/**
 * QR code content types
 */
export type QRCodeType = 'location' | 'photo' | 'certificate' | 'asset-lot';
/**
 * Canonical credential types from TradePass™ architecture
 * Each credential authorizes specific activities in the value chain
 *
 * @see docs/07-data-model/credential-taxonomy.md
 */
export type CredentialType = 'TradePass' | 'ProducerID' | 'SiteID' | 'AggregatorID' | 'ProcessorID' | 'TraderID' | 'CustodyID' | 'LogisticsID' | 'CertifierID' | 'BuyerID' | 'AuthorityID' | 'FinanceID' | 'SecurityID';
/**
 * Credential subtypes - used as discriminators within each credential type
 */
export interface CredentialSubtypes {
    ProducerID: 'Individual' | 'Group' | 'Operation' | 'Industrial';
    SiteID: 'ExtractionSite' | 'ProcessingFacility' | 'StorageFacility' | 'TransitPoint' | 'TradePremises' | 'Port' | 'BorderCrossing';
    AggregatorID: 'Local' | 'Regional';
    ProcessorID: 'Primary' | 'Secondary' | 'Refiner' | 'Manufacturer';
    TraderID: 'Dealer' | 'Exporter' | 'Importer' | 'TradingHouse';
    CustodyID: 'Vault' | 'Warehouse' | 'FreeZone' | 'Bonded';
    LogisticsID: 'Local' | 'Secure' | 'Freight' | 'Carrier';
    CertifierID: 'Assayer' | 'Auditor' | 'Inspector' | 'CertificationBody';
    BuyerID: 'Industrial' | 'Retail' | 'Institutional' | 'Investor';
    AuthorityID: 'Regulator' | 'Customs' | 'Tax' | 'CentralBank';
    FinanceID: 'Bank' | 'TradeFinance' | 'Insurance';
    SecurityID: 'Agent' | 'Company';
}
/**
 * Operator tier (compliance/capability level)
 */
export type OperatorTier = 1 | 2 | 3;
/**
 * Asset categories - top-level groupings
 */
export type AssetCategory = 'PreciousMetals' | 'Agricultural' | 'IndustrialMinerals' | 'Gemstones' | 'Energy';
/**
 * Supported commodity types - extensible per category
 */
export type CommodityType = 'gold' | 'silver' | 'platinum' | 'palladium' | 'rhodium' | 'cocoa' | 'coffee' | 'cotton' | 'sugar' | 'vanilla' | 'palm_oil' | 'rubber' | 'cobalt' | 'lithium' | 'copper' | 'tin' | 'tantalum' | 'tungsten' | 'diamond' | 'ruby' | 'emerald' | 'sapphire' | 'crude_oil' | 'natural_gas' | 'lng' | 'other';
/**
 * Commodity category mapping
 */
export declare const COMMODITY_CATEGORIES: Record<CommodityType, AssetCategory>;
/**
 * Measurement units - universal
 */
export type MeasurementUnit = 'g' | 'kg' | 'oz' | 'troy_oz' | 'lb' | 'mt' | 'ct' | 'bag' | 'bale' | 'barrel' | 'l' | 'gal';
/**
 * Quality grades - universal
 */
export type QualityGrade = 'high' | 'medium' | 'low' | 'ungraded';
/**
 * Asset lifecycle states - 7 canonical states
 * Assets progress through these states from extraction to final transfer
 */
export type AssetLifecycleState = 'RAW' | 'PRIMARY_PROCESSED' | 'SECONDARY_PROCESSED' | 'REFINED' | 'CERTIFIED' | 'FINISHED' | 'TRANSFERRED';
/**
 * Form variations by category
 */
export interface AssetForms {
    PreciousMetals: 'ore' | 'concentrate' | 'dore' | 'refined' | 'coin' | 'jewelry';
    Agricultural: 'raw' | 'dried' | 'fermented' | 'processed' | 'refined' | 'finished';
    IndustrialMinerals: 'ore' | 'concentrate' | 'refined' | 'battery_grade';
    Gemstones: 'rough' | 'polished' | 'set';
    Energy: 'raw' | 'refined';
}
/**
 * Site categories - top-level site classification
 */
export type SiteCategory = 'ExtractionSite' | 'ProcessingFacility' | 'StorageFacility' | 'TransitPoint' | 'TradePremises' | 'Port' | 'BorderCrossing';
/**
 * Site types within each category
 */
export interface SiteTypes {
    ExtractionSite: 'Mine' | 'Farm' | 'Plantation' | 'Fishery' | 'Forest' | 'Quarry';
    ProcessingFacility: 'Mill' | 'Refinery' | 'Smelter' | 'DryingFacility' | 'WashingPlant' | 'Factory';
    StorageFacility: 'Vault' | 'Warehouse' | 'Silo' | 'FreeZone' | 'BondedWarehouse';
    TransitPoint: 'CollectionCenter' | 'WeighingStation' | 'Checkpoint' | 'TransferHub';
    TradePremises: 'BuyingCenter' | 'TradingOffice' | 'RetailShop' | 'AuctionHouse';
    Port: 'Seaport' | 'Airport' | 'InlandPort';
    BorderCrossing: 'CustomsPost' | 'LandBorder';
}
/**
 * Site subtypes for extraction sites
 */
export interface ExtractionSiteSubtypes {
    Mine: 'Artisanal' | 'Alluvial' | 'OpenPit' | 'Underground';
    Farm: 'Smallholder' | 'Commercial' | 'Cooperative' | 'Plantation';
    Fishery: 'Artisanal' | 'Commercial';
    Forest: 'Concession' | 'Community';
    Quarry: 'Artisanal' | 'Commercial';
}
/**
 * Flattened site type for simple usage
 */
export type SiteType = 'mine' | 'farm' | 'plantation' | 'fishery' | 'forest' | 'quarry' | 'mill' | 'refinery' | 'smelter' | 'drying-facility' | 'washing-plant' | 'factory' | 'vault' | 'warehouse' | 'silo' | 'free-zone' | 'bonded-warehouse' | 'collection-center' | 'weighing-station' | 'checkpoint' | 'transfer-hub' | 'buying-center' | 'trading-office' | 'retail-shop' | 'auction-house' | 'seaport' | 'airport' | 'inland-port' | 'customs-post' | 'land-border';
/**
 * Operator roles in the value chain
 * Each role maps to a CredentialType
 *
 * @see CredentialType for the formal credential taxonomy
 */
export type OperatorRole = 'producer' | 'aggregator' | 'processor' | 'trader' | 'custodian' | 'transporter' | 'certifier' | 'buyer' | 'authority' | 'financier' | 'security';
/**
 * Map operator roles to credential types
 */
export declare const ROLE_TO_CREDENTIAL: Record<OperatorRole, CredentialType>;
/**
 * Predicate URI structure
 * Format: tradepass://{domain}/{category}/{predicate}
 *
 * @example "tradepass://compliance/sanctions/status"
 * @example "tradepass://asset/origin/verified"
 */
export type PredicateURI = `tradepass://${string}/${string}/${string}`;
/**
 * Predicate domains - top-level namespaces
 */
export type PredicateDomain = 'identity' | 'compliance' | 'asset' | 'location' | 'relationship' | 'temporal' | 'financial' | 'composite';
/**
 * Predicate definition structure
 * Each predicate is a first-class entity, not just a string
 */
export interface PredicateDefinition {
    /** Unique predicate URI */
    uri: PredicateURI;
    /** Human-readable name */
    name: string;
    /** Description of what this predicate verifies */
    description: string;
    /** Domain this predicate belongs to */
    domain: PredicateDomain;
    /** Version for evolution */
    version: string;
    /** Schema for the predicate value */
    schema: PredicateSchema;
    /** Evidence requirements */
    evidence: EvidenceRequirements;
    /** Attestation rules */
    attestation: AttestationRules;
    /** Confidence scoring */
    confidence: ConfidenceRules;
    /** Temporal validity */
    temporal: TemporalRules;
    /** AI metadata for reasoning */
    ai: AIMetadata;
}
/**
 * Predicate value schema
 */
export interface PredicateSchema {
    type: 'boolean' | 'enum' | 'string' | 'number' | 'date' | 'object';
    values?: string[];
    min?: number;
    max?: number;
    pattern?: string;
    properties?: Record<string, PredicateSchema>;
}
/**
 * Evidence requirements for a predicate
 */
export interface EvidenceRequirements {
    required: EvidenceType[];
    optional?: EvidenceType[];
    alternatives?: EvidenceType[][];
}
/**
 * Evidence types
 */
export type EvidenceType = 'government_id' | 'biometric_face' | 'biometric_fingerprint' | 'corporate_registry' | 'sanctions_screening' | 'site_audit' | 'assay_report' | 'photo_evidence' | 'gps_location' | 'document_hash' | 'witness_attestation';
/**
 * Attestation rules
 */
export interface AttestationRules {
    allowedAttestors: AttestorPattern[];
    selfAttestation: boolean;
    multiSignatureRequired?: boolean;
    minimumAttestors?: number;
}
/**
 * Attestor pattern for matching
 */
export interface AttestorPattern {
    type: 'exact' | 'pattern' | 'credential';
    value: string;
    credentialRequired?: CredentialType;
}
/**
 * Confidence scoring rules
 */
export interface ConfidenceRules {
    baseScore: number;
    evidenceWeights: Record<string, number>;
    minimumThreshold: number;
    decayModel?: 'linear' | 'exponential' | 'none';
    halfLife?: number;
}
/**
 * Temporal validity rules
 */
export interface TemporalRules {
    validDuration: string;
    renewalRequired: boolean;
    monitoringType?: 'continuous' | 'periodic' | 'event_triggered';
    triggers?: string[];
}
/**
 * AI metadata for reasoning
 */
export interface AIMetadata {
    embeddingModel: string;
    reasoningHints: string[];
    relatedPredicates: PredicateURI[];
    contradictoryPredicates?: PredicateURI[];
    contextTemplate: string;
}
/**
 * A claim is an assertion about a subject using a predicate
 */
export interface Claim {
    /** Unique claim identifier */
    id: string;
    /** Subject of the claim (DID) */
    subject: string;
    /** Predicate URI */
    predicate: PredicateURI;
    /** Value of the claim (matches predicate schema) */
    value: unknown;
    /** Evidence supporting the claim */
    evidence: ClaimEvidence[];
    /** Attestor who made the claim */
    attestor: string;
    /** Confidence score (0-1) */
    confidence: number;
    /** When the claim was issued */
    issuedAt: number;
    /** When the claim expires */
    validUntil?: number;
    /** Cryptographic proof */
    proof: ClaimProof;
}
/**
 * Evidence attached to a claim
 */
export interface ClaimEvidence {
    type: EvidenceType;
    hash: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}
/**
 * Cryptographic proof for a claim
 */
export interface ClaimProof {
    type: 'Ed25519Signature2020' | 'EcdsaSecp256k1Signature2019';
    created: string;
    verificationMethod: string;
    proofValue: string;
}
/**
 * Data encoded in a QR code
 */
export interface QRCodeData {
    certificateId: string;
    verifyUrl: string;
    hash: string;
    timestamp: number;
    type: QRCodeType;
    metadata?: QRCodeMetadata;
}
/**
 * QR code metadata - commodity-agnostic
 */
export interface QRCodeMetadata {
    location?: {
        latitude: number;
        longitude: number;
    };
    assetWeight?: number;
    assetUnit?: MeasurementUnit;
    commodityType?: CommodityType;
    assetState?: AssetLifecycleState;
    purity?: number;
    producerId?: string;
    operatorRole?: OperatorRole;
}
/**
 * Generated QR code with all metadata
 */
export interface GeneratedQRCode {
    id: string;
    data: QRCodeData;
    qrCodeUri: string;
    dataString: string;
    size: number;
    timestamp: number;
}
/**
 * QR code verification result
 */
export interface QRCodeVerificationResult {
    isValid: boolean;
    data?: QRCodeData;
    error?: string;
}
/**
 * Location data for certificates
 */
export interface CertificateLocation {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy: number;
    timestamp: number;
}
/**
 * Environmental factors at time of capture
 */
export interface EnvironmentalFactors {
    satelliteCount: number;
    signalStrength: number;
    atmosphericConditions: string;
    multipathIndicator: boolean;
}
/**
 * Validation metrics for certificate
 */
export interface ValidationMetrics {
    isJammed: boolean;
    isSpoofed: boolean;
    confidenceLevel: number;
    integrityCheck: boolean;
}
/**
 * Resource context - commodity-agnostic
 * Replaces the old GeologicalContext
 */
export interface ResourceContext {
    commodityPotential: 'high' | 'medium' | 'low' | 'none';
    commodityType?: CommodityType;
    formation?: string;
    confidence: number;
    source?: string;
}
/**
 * @deprecated Use ResourceContext instead
 */
export interface GeologicalContext {
    goldPotential: 'high' | 'medium' | 'low' | 'none';
    formation?: string;
    confidence: number;
}
/**
 * Certificate metadata
 */
export interface CertificateMetadata {
    issuer: string;
    issuedAt: number;
    expiresAt?: number;
    userRole: string;
    deviceId: string;
    location: CertificateLocation;
    resourceContext?: ResourceContext;
    /** @deprecated Use resourceContext */
    geologicalContext?: GeologicalContext;
    environmentalFactors?: EnvironmentalFactors;
    validationMetrics?: ValidationMetrics;
}
/**
 * Multi-signature structure
 */
export interface MultiSignature {
    ed25519: string;
    secp256k1?: string;
}
/**
 * Certificate verification data
 */
export interface CertificateVerificationData {
    publicKey: string;
    signature: string;
    timestamp: number;
    entropyQuality?: number;
}
/**
 * Base certificate structure
 */
export interface Certificate {
    certificateId: string;
    version: string;
    type: CertificateType;
    securityLevel: CertificateSecurityLevel;
    metadata: CertificateMetadata;
    verificationData: CertificateVerificationData;
    createdAt: number;
}
/**
 * Standard certificate (single signature)
 */
export interface StandardCertificate extends Certificate {
    securityLevel: 'standard' | 'enhanced';
    dataHash: string;
    signature: string;
}
/**
 * Military-grade certificate (multi-signature, quantum-resistant)
 */
export interface MilitaryGradeCertificate extends Certificate {
    securityLevel: 'military' | 'quantum-resistant';
    quantumResistantHash: string;
    multiSignature: MultiSignature;
    certificateData: {
        assetLotData?: AssetLotData;
        /** @deprecated Use assetLotData */
        goldLotData?: GoldLotData;
        photoEvidence?: PhotoEvidenceRef[];
        workflowContext?: string;
        complianceData?: ComplianceData;
        /** Claims associated with this certificate */
        claims?: Claim[];
    };
}
/**
 * Asset lot data - universal
 */
export interface AssetLotData {
    lotId?: string;
    commodityType: CommodityType;
    commoditySubtype?: string;
    category?: AssetCategory;
    estimatedWeight: number;
    unit: MeasurementUnit;
    quality?: QualityGrade;
    purity?: number;
    /** Current lifecycle state */
    state?: AssetLifecycleState;
    /** Previous state (for transitions) */
    previousState?: AssetLifecycleState;
    producerId?: string;
    operatorRole?: OperatorRole;
    discoveryDate?: string;
    siteId?: string;
    /** Site reference with full details */
    site?: SiteReference;
    attributes?: Record<string, unknown>;
}
/**
 * Site reference
 */
export interface SiteReference {
    siteId: string;
    name: string;
    category?: SiteCategory;
    siteType?: SiteType;
    region: string;
    country: string;
}
/**
 * @deprecated Use AssetLotData with commodityType: 'gold'
 */
export interface GoldLotData {
    estimatedWeight: number;
    quality?: 'high' | 'medium' | 'low';
    purity?: number;
    /** @deprecated Use producerId in AssetLotData */
    miner?: string;
    discoveryDate?: string;
}
/**
 * Photo evidence reference
 */
export interface PhotoEvidenceRef {
    id: string;
    hash: string;
    timestamp: number;
}
/**
 * Compliance data
 */
export interface ComplianceData {
    permitNumber?: string;
    inspectorId?: string;
    complianceLevel?: string;
    notes?: string;
    /** GCI score if available */
    gciScore?: number;
    /** Associated claims */
    claims?: Claim[];
}
/**
 * Certificate verification result
 */
export interface CertificateVerificationResult {
    isValid: boolean;
    certificate?: Certificate;
    confidence: number;
    details: string;
    checks: {
        hashValid: boolean;
        signatureValid: boolean;
        timestampValid: boolean;
        notExpired: boolean;
    };
}
/**
 * Validation rule for certificate fields
 */
export interface ValidationRule {
    field: string;
    min?: number;
    max?: number;
    value?: boolean | string | number;
    message: string;
}
/**
 * Certificate template definition
 */
export interface CertificateTemplate {
    id: string;
    name: string;
    description: string;
    type: CertificateType;
    securityLevel: CertificateSecurityLevel;
    requiredFields: string[];
    optionalFields: string[];
    validationRules: ValidationRule[];
    /** Predicates that must be satisfied for this certificate */
    requiredPredicates?: PredicateURI[];
}
/**
 * Bundled proof combining multiple verification elements
 */
export interface ProofBundle {
    id: string;
    type: 'location' | 'photo' | 'workflow' | 'certificate';
    timestamp: number;
    proofs: {
        cryptographicProof: CryptographicProofRef;
        locationProof?: LocationProofRef;
        photoProofs?: PhotoProofRef[];
    };
    certificate?: Certificate;
    qrCode?: GeneratedQRCode;
    /** Claims included in this bundle */
    claims?: Claim[];
}
export interface CryptographicProofRef {
    algorithm: string;
    dataHash: string;
    signature: string;
    publicKey: string;
}
export interface LocationProofRef {
    id: string;
    coordinates: CertificateLocation;
    hash: string;
}
export interface PhotoProofRef {
    id: string;
    uri: string;
    hash: string;
    timestamp: number;
}
/**
 * Commodity-specific configuration
 */
export interface CommodityConfig {
    type: CommodityType;
    category: AssetCategory;
    displayName: string;
    defaultUnit: MeasurementUnit;
    allowedUnits: MeasurementUnit[];
    hasPurity: boolean;
    qualityGrades: QualityGrade[];
    primaryProducerRole: OperatorRole;
    primarySiteType: SiteType;
    settings?: Record<string, unknown>;
}
/**
 * Pre-defined commodity configurations
 */
export declare const COMMODITY_CONFIGS: Record<CommodityType, CommodityConfig>;
/**
 * Get commodity configuration
 */
export declare function getCommodityConfig(type: CommodityType): CommodityConfig;
/**
 * Get category for a commodity
 */
export declare function getCommodityCategory(type: CommodityType): AssetCategory;
/**
 * Get credential type for an operator role
 */
export declare function getCredentialForRole(role: OperatorRole): CredentialType;
/**
 * Convert legacy lot data format to universal AssetLotData
 * @deprecated The GoldLotData type itself is deprecated - use AssetLotData directly
 */
export declare function migrateLegacyLotData(legacyData: GoldLotData, commodityType?: CommodityType): AssetLotData;
/**
 * @deprecated Use migrateLegacyLotData instead
 */
export declare const migrateGoldLotData: typeof migrateLegacyLotData;
export * from './schemas';
//# sourceMappingURL=index.d.ts.map