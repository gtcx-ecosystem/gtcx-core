// ============================================================================
// VERIFICATION TYPES
// Core types for certificates, QR codes, and verification proofs
// ============================================================================
//
// ARCHITECTURAL PRINCIPLES (per TradePass™ Credential Taxonomy):
// 1. Credentials describe ROLES - Commodities and sites are ATTRIBUTES
// 2. Predicates are first-class entities, not strings
// 3. Traits, Templates, Predicates form a composable verification language
// 4. Everything maps to the 13 canonical credential types
//
// See: docs/07-data-model/credential-taxonomy.md
// See: conversations on Predicate Architecture
// ============================================================================

/**
 * Security levels for certificates
 */
export type CertificateSecurityLevel = 'standard' | 'enhanced' | 'military' | 'quantum-resistant';

/**
 * Certificate type discriminator - ROLE-BASED, not commodity-specific
 * These map to verification activities, not credential types
 */
export type CertificateType = 
  | 'asset-origin'              // Origin verification for any commodity
  | 'location'                  // Pure location verification
  | 'photo'                     // Photo evidence verification
  | 'work-site'                 // Site check-in verification
  | 'compliance'                // Regulatory compliance verification
  | 'government-inspection'     // Government inspector verification
  | 'custody-transfer'          // VaultMark custody change
  | 'settlement'                // PvP settlement verification
  | 'quality-assay'             // Quality/purity certification
  | 'chain-of-custody';         // Provenance chain link

/**
 * QR code content types
 */
export type QRCodeType = 'location' | 'photo' | 'certificate' | 'asset-lot';

// ============================================================================
// CREDENTIAL TYPES (per TradePass™ Credential Taxonomy)
// 13 canonical role-based credentials
// ============================================================================

/**
 * Canonical credential types from TradePass™ architecture
 * Each credential authorizes specific activities in the value chain
 * 
 * @see docs/07-data-model/credential-taxonomy.md
 */
export type CredentialType =
  | 'TradePass'       // 01. Universal container
  | 'ProducerID'      // 02. Extraction/harvesting authorization
  | 'SiteID'          // 03. Location authorization
  | 'AggregatorID'    // 04. Consolidation/buying authorization
  | 'ProcessorID'     // 05. Transformation authorization
  | 'TraderID'        // 06. Buying/selling authorization
  | 'CustodyID'       // 07. Storage/security authorization
  | 'LogisticsID'     // 08. Transport authorization
  | 'CertifierID'     // 09. Testing/auditing authorization
  | 'BuyerID'         // 10. End purchase authorization
  | 'AuthorityID'     // 11. Government/regulatory
  | 'FinanceID'       // 12. Financial services
  | 'SecurityID';     // 13. Physical security

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

// ============================================================================
// COMMODITY & ASSET TYPES
// ============================================================================

/**
 * Asset categories - top-level groupings
 */
export type AssetCategory =
  | 'PreciousMetals'
  | 'Agricultural'
  | 'IndustrialMinerals'
  | 'Gemstones'
  | 'Energy';

/**
 * Supported commodity types - extensible per category
 */
export type CommodityType = 
  // Precious Metals
  | 'gold' | 'silver' | 'platinum' | 'palladium' | 'rhodium'
  // Agricultural
  | 'cocoa' | 'coffee' | 'cotton' | 'sugar' | 'vanilla' | 'palm_oil' | 'rubber'
  // Industrial Minerals (Critical Minerals)
  | 'cobalt' | 'lithium' | 'copper' | 'tin' | 'tantalum' | 'tungsten'
  // Gemstones
  | 'diamond' | 'ruby' | 'emerald' | 'sapphire'
  // Energy
  | 'crude_oil' | 'natural_gas' | 'lng'
  // Fallback
  | 'other';

/**
 * Commodity category mapping
 */
export const COMMODITY_CATEGORIES: Record<CommodityType, AssetCategory> = {
  // Precious Metals
  gold: 'PreciousMetals',
  silver: 'PreciousMetals',
  platinum: 'PreciousMetals',
  palladium: 'PreciousMetals',
  rhodium: 'PreciousMetals',
  // Agricultural
  cocoa: 'Agricultural',
  coffee: 'Agricultural',
  cotton: 'Agricultural',
  sugar: 'Agricultural',
  vanilla: 'Agricultural',
  palm_oil: 'Agricultural',
  rubber: 'Agricultural',
  // Industrial Minerals
  cobalt: 'IndustrialMinerals',
  lithium: 'IndustrialMinerals',
  copper: 'IndustrialMinerals',
  tin: 'IndustrialMinerals',
  tantalum: 'IndustrialMinerals',
  tungsten: 'IndustrialMinerals',
  // Gemstones
  diamond: 'Gemstones',
  ruby: 'Gemstones',
  emerald: 'Gemstones',
  sapphire: 'Gemstones',
  // Energy
  crude_oil: 'Energy',
  natural_gas: 'Energy',
  lng: 'Energy',
  // Other
  other: 'IndustrialMinerals',
};

/**
 * Measurement units - universal
 */
export type MeasurementUnit = 
  | 'g' | 'kg' | 'oz' | 'troy_oz' | 'lb' | 'mt'    // Weight
  | 'ct'                                           // Carats (gemstones)
  | 'bag' | 'bale' | 'barrel'                      // Volume/container
  | 'l' | 'gal';                                   // Liquid

/**
 * Quality grades - universal
 */
export type QualityGrade = 'high' | 'medium' | 'low' | 'ungraded';

// ============================================================================
// ASSET LIFECYCLE STATES (per asset-lifecycle.md)
// ============================================================================

/**
 * Asset lifecycle states - 7 canonical states
 * Assets progress through these states from extraction to final transfer
 */
export type AssetLifecycleState =
  | 'RAW'                  // Freshly extracted/harvested, unprocessed
  | 'PRIMARY_PROCESSED'    // Initial beneficiation (washed, dried, sorted)
  | 'SECONDARY_PROCESSED'  // Further transformation (smelted, concentrated)
  | 'REFINED'              // Final purity achieved (refined bar, processed cocoa)
  | 'CERTIFIED'            // Quality certified, ready for market
  | 'FINISHED'             // Manufactured into final product
  | 'TRANSFERRED';         // Ownership transferred to end buyer

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

// ============================================================================
// SITE TAXONOMY (per site-taxonomy.md)
// ============================================================================

/**
 * Site categories - top-level site classification
 */
export type SiteCategory =
  | 'ExtractionSite'      // Where commodities are extracted
  | 'ProcessingFacility'  // Where commodities are transformed
  | 'StorageFacility'     // Where commodities are stored
  | 'TransitPoint'        // Intermediate handling locations
  | 'TradePremises'       // Commercial trading locations
  | 'Port'                // International transit points
  | 'BorderCrossing';     // Customs/border points

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
export type SiteType = 
  // Extraction
  | 'mine' | 'farm' | 'plantation' | 'fishery' | 'forest' | 'quarry'
  // Processing
  | 'mill' | 'refinery' | 'smelter' | 'drying-facility' | 'washing-plant' | 'factory'
  // Storage
  | 'vault' | 'warehouse' | 'silo' | 'free-zone' | 'bonded-warehouse'
  // Transit
  | 'collection-center' | 'weighing-station' | 'checkpoint' | 'transfer-hub'
  // Trade
  | 'buying-center' | 'trading-office' | 'retail-shop' | 'auction-house'
  // Port/Border
  | 'seaport' | 'airport' | 'inland-port' | 'customs-post' | 'land-border';

// ============================================================================
// OPERATOR ROLES (maps to CredentialType)
// ============================================================================

/**
 * Operator roles in the value chain
 * Each role maps to a CredentialType
 * 
 * @see CredentialType for the formal credential taxonomy
 */
export type OperatorRole = 
  | 'producer'       // ProducerID - Extraction (miner, farmer, harvester)
  | 'aggregator'     // AggregatorID - Collection/consolidation
  | 'processor'      // ProcessorID - Transformation (refiner, mill)
  | 'trader'         // TraderID - Commercial trade
  | 'custodian'      // CustodyID - Storage (vault operator)
  | 'transporter'    // LogisticsID - Logistics
  | 'certifier'      // CertifierID - Testing/auditing
  | 'buyer'          // BuyerID - End purchaser
  | 'authority'      // AuthorityID - Government/regulatory
  | 'financier'      // FinanceID - Financial services
  | 'security';      // SecurityID - Physical security

/**
 * Map operator roles to credential types
 */
export const ROLE_TO_CREDENTIAL: Record<OperatorRole, CredentialType> = {
  producer: 'ProducerID',
  aggregator: 'AggregatorID',
  processor: 'ProcessorID',
  trader: 'TraderID',
  custodian: 'CustodyID',
  transporter: 'LogisticsID',
  certifier: 'CertifierID',
  buyer: 'BuyerID',
  authority: 'AuthorityID',
  financier: 'FinanceID',
  security: 'SecurityID',
};

// ============================================================================
// PREDICATE FOUNDATION (per Predicate Architecture)
// ============================================================================

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
export type PredicateDomain =
  | 'identity'      // Person, organization, device verification
  | 'compliance'    // Sanctions, PEP, AML, licensing, environmental, labor
  | 'asset'         // Existence, origin, quality, custody, provenance
  | 'location'      // Current, historical, residence, jurisdiction
  | 'relationship'  // Entity relationships, authorization chains
  | 'temporal'      // Time-based validity, expiration
  | 'financial'     // Transaction capacity, credit status
  | 'composite';    // Bundled verification requirements

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
  values?: string[];  // For enum type
  min?: number;       // For number type
  max?: number;       // For number type
  pattern?: string;   // For string type (regex)
  properties?: Record<string, PredicateSchema>;  // For object type
}

/**
 * Evidence requirements for a predicate
 */
export interface EvidenceRequirements {
  required: EvidenceType[];
  optional?: EvidenceType[];
  alternatives?: EvidenceType[][];  // Any one of these sets is acceptable
}

/**
 * Evidence types
 */
export type EvidenceType =
  | 'government_id'
  | 'biometric_face'
  | 'biometric_fingerprint'
  | 'corporate_registry'
  | 'sanctions_screening'
  | 'site_audit'
  | 'assay_report'
  | 'photo_evidence'
  | 'gps_location'
  | 'document_hash'
  | 'witness_attestation';

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
  value: string;  // DID or pattern like "did:tp:gov:*"
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
  halfLife?: number;  // In days, for decay
}

/**
 * Temporal validity rules
 */
export interface TemporalRules {
  validDuration: string;  // ISO 8601 duration, e.g., "P1Y" for 1 year
  renewalRequired: boolean;
  monitoringType?: 'continuous' | 'periodic' | 'event_triggered';
  triggers?: string[];  // Events that trigger revalidation
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

// ============================================================================
// CLAIM STRUCTURE (Predicate + Value + Evidence)
// ============================================================================

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

// ============================================================================
// QR CODE TYPES
// ============================================================================

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
  location?: { latitude: number; longitude: number };
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

// ============================================================================
// CERTIFICATE TYPES
// ============================================================================

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

// ============================================================================
// CERTIFICATE TEMPLATE TYPES
// ============================================================================

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

// ============================================================================
// PROOF BUNDLE TYPES
// ============================================================================

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

// ============================================================================
// COMMODITY CONFIGURATION
// ============================================================================

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
export const COMMODITY_CONFIGS: Record<CommodityType, CommodityConfig> = {
  // Precious Metals
  gold: {
    type: 'gold',
    category: 'PreciousMetals',
    displayName: 'Gold',
    defaultUnit: 'troy_oz',
    allowedUnits: ['g', 'kg', 'oz', 'troy_oz'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  silver: {
    type: 'silver',
    category: 'PreciousMetals',
    displayName: 'Silver',
    defaultUnit: 'troy_oz',
    allowedUnits: ['g', 'kg', 'oz', 'troy_oz'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  platinum: {
    type: 'platinum',
    category: 'PreciousMetals',
    displayName: 'Platinum',
    defaultUnit: 'troy_oz',
    allowedUnits: ['g', 'kg', 'oz', 'troy_oz'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  palladium: {
    type: 'palladium',
    category: 'PreciousMetals',
    displayName: 'Palladium',
    defaultUnit: 'troy_oz',
    allowedUnits: ['g', 'kg', 'oz', 'troy_oz'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  rhodium: {
    type: 'rhodium',
    category: 'PreciousMetals',
    displayName: 'Rhodium',
    defaultUnit: 'troy_oz',
    allowedUnits: ['g', 'kg', 'oz', 'troy_oz'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  // Agricultural
  cocoa: {
    type: 'cocoa',
    category: 'Agricultural',
    displayName: 'Cocoa',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt', 'bag'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'farm',
  },
  coffee: {
    type: 'coffee',
    category: 'Agricultural',
    displayName: 'Coffee',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt', 'bag'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'farm',
  },
  cotton: {
    type: 'cotton',
    category: 'Agricultural',
    displayName: 'Cotton',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt', 'bale'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'farm',
  },
  sugar: {
    type: 'sugar',
    category: 'Agricultural',
    displayName: 'Sugar',
    defaultUnit: 'mt',
    allowedUnits: ['kg', 'mt'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'plantation',
  },
  vanilla: {
    type: 'vanilla',
    category: 'Agricultural',
    displayName: 'Vanilla',
    defaultUnit: 'kg',
    allowedUnits: ['g', 'kg'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'farm',
  },
  palm_oil: {
    type: 'palm_oil',
    category: 'Agricultural',
    displayName: 'Palm Oil',
    defaultUnit: 'mt',
    allowedUnits: ['kg', 'mt', 'l'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'plantation',
  },
  rubber: {
    type: 'rubber',
    category: 'Agricultural',
    displayName: 'Rubber',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'plantation',
  },
  // Industrial Minerals
  cobalt: {
    type: 'cobalt',
    category: 'IndustrialMinerals',
    displayName: 'Cobalt',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt', 'lb'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  lithium: {
    type: 'lithium',
    category: 'IndustrialMinerals',
    displayName: 'Lithium',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  copper: {
    type: 'copper',
    category: 'IndustrialMinerals',
    displayName: 'Copper',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt', 'lb'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  tin: {
    type: 'tin',
    category: 'IndustrialMinerals',
    displayName: 'Tin',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt', 'lb'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  tantalum: {
    type: 'tantalum',
    category: 'IndustrialMinerals',
    displayName: 'Tantalum',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt', 'lb'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  tungsten: {
    type: 'tungsten',
    category: 'IndustrialMinerals',
    displayName: 'Tungsten',
    defaultUnit: 'kg',
    allowedUnits: ['kg', 'mt', 'lb'],
    hasPurity: true,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  // Gemstones
  diamond: {
    type: 'diamond',
    category: 'Gemstones',
    displayName: 'Diamond',
    defaultUnit: 'ct',
    allowedUnits: ['ct', 'g'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  ruby: {
    type: 'ruby',
    category: 'Gemstones',
    displayName: 'Ruby',
    defaultUnit: 'ct',
    allowedUnits: ['ct', 'g'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  emerald: {
    type: 'emerald',
    category: 'Gemstones',
    displayName: 'Emerald',
    defaultUnit: 'ct',
    allowedUnits: ['ct', 'g'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  sapphire: {
    type: 'sapphire',
    category: 'Gemstones',
    displayName: 'Sapphire',
    defaultUnit: 'ct',
    allowedUnits: ['ct', 'g'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  // Energy
  crude_oil: {
    type: 'crude_oil',
    category: 'Energy',
    displayName: 'Crude Oil',
    defaultUnit: 'barrel',
    allowedUnits: ['barrel', 'l', 'gal'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  natural_gas: {
    type: 'natural_gas',
    category: 'Energy',
    displayName: 'Natural Gas',
    defaultUnit: 'mt',
    allowedUnits: ['mt', 'kg'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  lng: {
    type: 'lng',
    category: 'Energy',
    displayName: 'LNG',
    defaultUnit: 'mt',
    allowedUnits: ['mt', 'kg'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
  // Fallback
  other: {
    type: 'other',
    category: 'IndustrialMinerals',
    displayName: 'Other Commodity',
    defaultUnit: 'kg',
    allowedUnits: ['g', 'kg', 'mt', 'lb'],
    hasPurity: false,
    qualityGrades: ['high', 'medium', 'low', 'ungraded'],
    primaryProducerRole: 'producer',
    primarySiteType: 'mine',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get commodity configuration
 */
export function getCommodityConfig(type: CommodityType): CommodityConfig {
  return COMMODITY_CONFIGS[type] ?? COMMODITY_CONFIGS.other;
}

/**
 * Get category for a commodity
 */
export function getCommodityCategory(type: CommodityType): AssetCategory {
  return COMMODITY_CATEGORIES[type];
}

/**
 * Get credential type for an operator role
 */
export function getCredentialForRole(role: OperatorRole): CredentialType {
  return ROLE_TO_CREDENTIAL[role];
}

/**
 * Convert legacy lot data format to universal AssetLotData
 * @deprecated The GoldLotData type itself is deprecated - use AssetLotData directly
 */
export function migrateLegacyLotData(legacyData: GoldLotData, commodityType: CommodityType = 'gold'): AssetLotData {
  return {
    commodityType,
    category: getCommodityCategory(commodityType),
    estimatedWeight: legacyData.estimatedWeight,
    unit: 'troy_oz',
    quality: legacyData.quality,
    purity: legacyData.purity,
    producerId: legacyData.miner,
    operatorRole: 'producer',
    discoveryDate: legacyData.discoveryDate,
    state: 'RAW',
  };
}

/**
 * @deprecated Use migrateLegacyLotData instead
 */
export const migrateGoldLotData = migrateLegacyLotData;

// ============================================================================
// RE-EXPORT ZOD SCHEMAS
// ============================================================================

export * from './schemas';
