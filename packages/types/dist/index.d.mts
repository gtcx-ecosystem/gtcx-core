/**
 * Security levels for cryptographic operations
 */
type SecurityLevel = 'standard' | 'enhanced' | 'military';
/**
 * Supported cryptographic algorithms
 */
type CryptoAlgorithm = 'Ed25519' | 'Secp256k1' | 'Ed25519-SHA256' | 'Secp256k1-SHA256' | 'MultiSig' | 'QuantumResistant';
/**
 * Key pair representation
 */
interface KeyPair {
    algorithm: CryptoAlgorithm;
    publicKey: string;
    privateKeyRef: string;
    createdAt: number;
}
/**
 * Multi-key identity for enhanced security
 */
interface MultiKeyPairs {
    ed25519: KeyPair;
    secp256k1?: KeyPair;
}
/**
 * Digital identity for GTCX participants
 */
interface DigitalIdentity {
    id: string;
    did?: string;
    publicKey: string;
    privateKeyRef: string;
    createdAt: number;
    expiresAt?: number;
    securityLevel: SecurityLevel;
    metadata: IdentityMetadata;
}
interface IdentityMetadata {
    userId?: string;
    deviceId?: string;
    userRole?: string;
    issuer?: string;
    fingerprint?: string;
    complianceStandards?: string[];
}
/**
 * Enhanced identity with multi-signature support
 */
interface EnhancedIdentity extends DigitalIdentity {
    multiKeyPairs: MultiKeyPairs;
    quantumResistantHash?: string;
    keyDerivation?: KeyDerivationParams;
    entropyValidation?: EntropyValidation;
    certificationChain?: string[];
}
interface KeyDerivationParams {
    algorithm: 'PBKDF2' | 'Argon2' | 'Scrypt';
    iterations: number;
    salt: string;
}
interface EntropyValidation {
    source: 'hardware' | 'cryptographic' | 'hybrid';
    quality: number;
    timestamp: number;
}
/**
 * Device attestation for mobile identity
 */
interface DeviceIdentity {
    deviceId: string;
    platform: 'ios' | 'android' | 'web';
    modelInfo?: string;
    osVersion?: string;
    integrityToken?: string;
    attestationTime: number;
}
/**
 * Verifiable credential structure
 */
interface VerifiableCredential$1 {
    '@context': string[];
    type: string[];
    issuer: string | CredentialIssuer;
    issuanceDate: string;
    expirationDate?: string;
    credentialSubject: CredentialSubject;
    proof?: CredentialProof$1;
}
interface CredentialIssuer {
    id: string;
    name?: string;
}
interface CredentialSubject {
    id: string;
    [key: string]: unknown;
}
interface CredentialProof$1 {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
}
/**
 * Identity verification result
 */
interface IdentityVerificationResult {
    valid: boolean;
    identity?: DigitalIdentity;
    errors?: string[];
    verifiedAt: number;
}

/**
 * Decentralized Identifier for GTCX participants
 */
interface TradePassDID {
    id: string;
    publicKey: string;
    controller: string;
    created: number;
    updated: number;
}
/**
 * Verifiable Credential structure
 */
interface VerifiableCredential {
    '@context': string[];
    id: string;
    type: string[];
    issuer: string;
    issuanceDate: string;
    expirationDate?: string;
    credentialSubject: {
        id: string;
        [key: string]: unknown;
    };
    proof: CredentialProof;
}
interface CredentialProof {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
}
/**
 * TradePass Identity - the core identity container
 */
interface TradePassIdentity {
    did: TradePassDID;
    credentials: VerifiableCredential[];
    roles: TradePassRole[];
    status: 'active' | 'suspended' | 'revoked';
    createdAt: number;
    updatedAt: number;
}
/**
 * Role-based entitlements (time-boxed)
 */
interface TradePassRole {
    id: string;
    type: TradePassRoleType;
    issuedBy: string;
    issuedAt: number;
    expiresAt: number;
    permissions: string[];
    constraints?: RoleConstraints;
}
type TradePassRoleType = 'miner' | 'collector' | 'transporter' | 'refiner' | 'trader' | 'regulator' | 'auditor' | 'operator';
interface RoleConstraints {
    maxTransactionValue?: number;
    allowedRegions?: string[];
    allowedCommodities?: string[];
    requiresApproval?: boolean;
}
/**
 * Role delegation record
 */
interface RoleDelegation {
    id: string;
    fromDid: string;
    toDid: string;
    role: TradePassRole;
    delegatedAt: number;
    revokedAt?: number;
    reason?: string;
}

/**
 * Supported commodity types - extensible
 */
type CommodityType$1 = 'gold' | 'silver' | 'platinum' | 'palladium' | 'copper' | 'cobalt' | 'lithium' | 'tantalum' | 'tungsten' | 'tin' | 'cocoa' | 'coffee' | 'cotton' | 'other';
/**
 * Measurement units - universal
 */
type MeasurementUnit = 'g' | 'kg' | 'oz' | 'troy_oz' | 'lb' | 'mt' | 'bag' | 'bale';
/**
 * Quality grades - universal
 */
type QualityGrade = 'high' | 'medium' | 'low' | 'ungraded';
/**
 * Geographic coordinates with metadata
 */
interface GeoCoordinates {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy: number;
    altitudeAccuracy?: number;
    heading?: number;
    speed?: number;
}
/**
 * Cryptographic proof for any GeoTag data
 */
interface CryptographicProof {
    version: string;
    algorithm: 'Ed25519' | 'ECDSA-P256';
    dataHash: string;
    signature: string;
    publicKey: string;
    timestamp: number;
    proofType: GeoTagProofType;
    metadata: ProofMetadata;
}
type GeoTagProofType = 'location' | 'photo' | 'document' | 'workflow' | 'custody' | 'transfer';
interface ProofMetadata {
    accuracy?: number;
    location?: GeoCoordinates;
    deviceId?: string;
    userRole?: string;
    workflowContext?: string;
    /** Commodity type for asset-related proofs */
    commodityType?: CommodityType$1;
    [key: string]: unknown;
}
/**
 * Location proof - cryptographically attested GPS capture
 */
interface LocationProof {
    id: string;
    coordinates: GeoCoordinates;
    timestamp: number;
    deviceAttestation?: DeviceAttestation;
    cryptographicProof: CryptographicProof;
    resourceContext?: ResourceContext;
    /** @deprecated Use resourceContext instead */
    geologicalContext?: GeologicalContext;
}
interface DeviceAttestation {
    deviceId: string;
    platform: 'ios' | 'android';
    integrityToken?: string;
    attestationTime: number;
}
/**
 * Resource context - COMMODITY-AGNOSTIC
 * Applies to any commodity extraction site
 */
interface ResourceContext {
    /** Potential for the target commodity at this location */
    commodityPotential: 'high' | 'medium' | 'low' | 'none';
    /** Which commodity this assessment is for */
    commodityType?: CommodityType$1;
    /** Geological formation or agricultural zone */
    formation?: string;
    /** Confidence in the assessment (0-1) */
    confidence: number;
    /** Source of the assessment */
    source?: string;
}
/**
 * @deprecated Use ResourceContext instead
 * Kept for backwards compatibility
 */
interface GeologicalContext {
    /** @deprecated Use commodityPotential in ResourceContext */
    goldPotential: 'high' | 'medium' | 'low' | 'none';
    formation?: string;
    confidence: number;
    source?: string;
}
/**
 * Photo evidence bound to location
 */
interface PhotoEvidence {
    id: string;
    uri: string;
    hash: string;
    location: LocationProof;
    timestamp: number;
    metadata: PhotoMetadata;
    cryptographicProof: CryptographicProof;
}
interface PhotoMetadata {
    workflowContext?: string;
    description?: string;
    category?: PhotoCategory;
    dimensions?: {
        width: number;
        height: number;
    };
    fileSize?: number;
}
type PhotoCategory = 'site' | 'production' | 'equipment' | 'sample' | 'transport' | 'storage' | 'documentation';
/**
 * GeoTag capture session - groups related proofs
 */
interface GeoTagSession {
    id: string;
    tradePassId: string;
    startTime: number;
    endTime?: number;
    locationProofs: LocationProof[];
    photoEvidence: PhotoEvidence[];
    workflowType: string;
    status: 'active' | 'completed' | 'cancelled';
    /** Commodity type for this session */
    commodityType?: CommodityType$1;
}
/**
 * Origin certificate - the final attestation
 * COMMODITY-AGNOSTIC - works for any commodity
 */
interface OriginCertificate {
    certificateId: string;
    issuer: string;
    issuedTo: string;
    issuedAt: number;
    expiresAt?: number;
    lotData: LotData;
    locationProof: LocationProof;
    evidenceHashes: string[];
    resourceContext?: ResourceContext;
    /** @deprecated Use resourceContext instead */
    geologicalContext?: GeologicalContext;
    cryptographicProof: CryptographicProof;
    qrCode: string;
}
/**
 * Lot data - COMMODITY-AGNOSTIC
 */
interface LotData {
    lotId: string;
    /** Commodity type (gold, silver, cocoa, etc.) */
    commodity: CommodityType$1;
    /** Commodity subtype (e.g., 'alluvial', 'lode', 'arabica') */
    commoditySubtype?: string;
    estimatedWeight: number;
    unit: MeasurementUnit;
    quality?: QualityGrade;
    /** Purity percentage (0-100), primarily for metals */
    purity?: number;
    discoveryDate: string;
    site?: SiteReference;
    /** Producer identifier (was: minerId) */
    producerId?: string;
}
interface SiteReference {
    siteId: string;
    name: string;
    /** Site type (extraction-site, processing-site, etc.) */
    siteType?: string;
    region: string;
    country: string;
}
/**
 * GeoTagData - Primary data structure for a verified location capture
 * Alias for GeoTagSession for protocol layer convenience
 */
interface GeoTagData {
    id: string;
    tradePassId: string;
    coordinates: GeoCoordinates;
    timestamp: number;
    accuracy: number;
    altitude?: number;
    deviceAttestation?: DeviceAttestation;
    commodityType?: CommodityType$1;
    metadata?: Record<string, unknown>;
}
/**
 * GeoTagProof - Cryptographic proof for location verification
 */
interface GeoTagProof {
    dataHash: string;
    signature: string;
    publicKey: string;
    algorithm: 'Ed25519' | 'ECDSA-P256';
    timestamp: number;
    proofType: GeoTagProofType;
}
/**
 * LocationClaim - A claim about a location that can be verified
 */
interface LocationClaim {
    claimId: string;
    claimant: string;
    location: GeoCoordinates;
    timestamp: number;
    purpose: 'extraction' | 'processing' | 'transport' | 'custody' | 'other';
    evidence?: string[];
    verified: boolean;
    verifiedAt?: number;
    verifiedBy?: string;
}
/**
 * BoundingBox - Geographic boundary definition
 */
interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
    /** Optional altitude bounds */
    minAltitude?: number;
    maxAltitude?: number;
}
/**
 * Helper to migrate legacy GeologicalContext to ResourceContext
 */
declare function migrateGeologicalContext(geo: GeologicalContext, commodityType?: CommodityType$1): ResourceContext;
/**
 * Helper to create ResourceContext for any commodity
 */
declare function createResourceContext(commodityType: CommodityType$1, potential: 'high' | 'medium' | 'low' | 'none', confidence: number, options?: {
    formation?: string;
    source?: string;
}): ResourceContext;

/**
 * Compliance policy definition
 */
interface CompliancePolicy {
    id: string;
    name: string;
    version: string;
    jurisdiction: string;
    effectiveDate: string;
    expirationDate?: string;
    rules: ComplianceRule[];
    metadata: PolicyMetadata;
}
interface PolicyMetadata {
    authority: string;
    description: string;
    tags: string[];
    updatedAt: number;
}
/**
 * Individual compliance rule
 */
interface ComplianceRule {
    id: string;
    name: string;
    description: string;
    type: RuleType;
    condition: RuleCondition;
    weight: number;
    required: boolean;
    remediation?: string;
}
type RuleType = 'identity' | 'location' | 'documentation' | 'financial' | 'environmental' | 'labor' | 'safety' | 'custom';
interface RuleCondition {
    field: string;
    operator: ConditionOperator;
    value: unknown;
    nested?: RuleCondition[];
}
type ConditionOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'exists' | 'and' | 'or';
/**
 * Compliance evaluation result
 */
interface ComplianceEvaluation {
    id: string;
    subjectId: string;
    subjectType: 'tradepass' | 'lot' | 'site' | 'transaction';
    policyId: string;
    policyVersion: string;
    evaluatedAt: number;
    score: ComplianceScore;
    ruleResults: RuleResult[];
    attestation?: ComplianceAttestation;
}
interface ComplianceScore {
    overall: number;
    byCategory: Record<RuleType, number>;
    tier: ComplianceTier;
    trend?: 'improving' | 'stable' | 'declining';
}
type ComplianceTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'pending' | 'blocked';
interface RuleResult {
    ruleId: string;
    passed: boolean;
    score: number;
    evidence?: string;
    message?: string;
    remediation?: string;
}
/**
 * Compliance attestation - signed statement of compliance
 */
interface ComplianceAttestation {
    id: string;
    evaluationId: string;
    attestedBy: string;
    attestedAt: number;
    validUntil: number;
    signature: string;
    publicKey: string;
}
/**
 * Policy registry for managing active policies
 */
interface PolicyRegistry {
    jurisdiction: string;
    activePolicies: CompliancePolicy[];
    lastUpdated: number;
    nextReview: number;
}

/**
 * Trade order
 */
interface TradeOrder {
    id: string;
    type: 'buy' | 'sell';
    lotId: string;
    traderId: string;
    price: PriceQuote;
    quantity: QuantitySpec;
    terms: TradeTerms;
    status: OrderStatus;
    createdAt: number;
    updatedAt: number;
    expiresAt?: number;
}
interface PriceQuote {
    amount: number;
    currency: string;
    pricePerUnit: number;
    unit: 'g' | 'kg' | 'oz' | 'troy_oz';
    validUntil: number;
    source?: 'spot' | 'negotiated' | 'auction';
}
interface QuantitySpec {
    amount: number;
    unit: 'g' | 'kg' | 'oz' | 'troy_oz';
    tolerance?: number;
}
interface TradeTerms {
    settlementType: SettlementType;
    settlementWindow: number;
    deliveryMethod: DeliveryMethod;
    deliveryLocation?: string;
    insuranceRequired: boolean;
    escrowRequired: boolean;
    arbitrationClause?: string;
}
type SettlementType = 'immediate' | 't_plus_1' | 't_plus_2' | 'on_delivery' | 'escrow';
type DeliveryMethod = 'physical' | 'vault_transfer' | 'title_transfer' | 'certificate_only';
type OrderStatus = 'draft' | 'pending' | 'active' | 'matched' | 'settling' | 'settled' | 'cancelled' | 'expired' | 'disputed';
/**
 * Trade match - when buyer and seller agree
 */
interface TradeMatch {
    id: string;
    buyOrderId: string;
    sellOrderId: string;
    matchedAt: number;
    matchPrice: PriceQuote;
    matchQuantity: QuantitySpec;
    settlement: SettlementRecord;
}
/**
 * Settlement record - the actual exchange
 */
interface SettlementRecord {
    id: string;
    tradeMatchId: string;
    status: SettlementStatus;
    paymentLeg: PaymentLeg;
    assetLeg: AssetLeg;
    timeline: SettlementTimeline;
    verification: SettlementVerification;
}
type SettlementStatus = 'initiated' | 'payment_pending' | 'payment_received' | 'asset_pending' | 'asset_transferred' | 'completed' | 'failed' | 'rolled_back';
interface PaymentLeg {
    from: string;
    to: string;
    amount: number;
    currency: string;
    method: PaymentMethod;
    reference?: string;
    confirmedAt?: number;
    proof?: string;
}
type PaymentMethod = 'bank_transfer' | 'mobile_money' | 'escrow' | 'letter_of_credit' | 'crypto';
interface AssetLeg {
    from: string;
    to: string;
    lotId: string;
    custodyTransferId?: string;
    deliveryMethod: DeliveryMethod;
    confirmedAt?: number;
    proof?: string;
}
interface SettlementTimeline {
    initiatedAt: number;
    paymentDeadline: number;
    assetDeadline: number;
    completedAt?: number;
    failedAt?: number;
}
interface SettlementVerification {
    paymentVerified: boolean;
    paymentVerifiedBy?: string;
    paymentVerifiedAt?: number;
    assetVerified: boolean;
    assetVerifiedBy?: string;
    assetVerifiedAt?: number;
    finalSignoff?: string;
}
/**
 * Escrow account for holding funds/assets
 */
interface EscrowAccount {
    id: string;
    tradeMatchId: string;
    type: 'payment' | 'asset' | 'both';
    status: EscrowStatus;
    lockedAt: number;
    releaseConditions: ReleaseCondition[];
    releasedAt?: number;
    releasedTo?: string;
}
type EscrowStatus = 'created' | 'funded' | 'locked' | 'releasing' | 'released' | 'disputed' | 'refunded';
interface ReleaseCondition {
    type: string;
    description: string;
    satisfied: boolean;
    satisfiedAt?: number;
    evidence?: string;
}
/**
 * Atomic swap for simultaneous exchange
 */
interface AtomicSwap {
    id: string;
    settlementId: string;
    hashLock: string;
    timeLock: number;
    paymentPreimage?: string;
    assetPreimage?: string;
    status: SwapStatus;
    createdAt: number;
    executedAt?: number;
}
type SwapStatus = 'pending' | 'locked' | 'executed' | 'expired' | 'refunded';

/**
 * Chain of custody record
 */
interface CustodyChain {
    id: string;
    lotId: string;
    entries: CustodyEntry[];
    currentHolder: string;
    status: CustodyStatus;
    createdAt: number;
    updatedAt: number;
}
type CustodyStatus = 'active' | 'transferred' | 'sealed' | 'released' | 'disputed';
/**
 * Individual custody entry
 */
interface CustodyEntry {
    id: string;
    chainId: string;
    fromHolder?: string;
    toHolder: string;
    timestamp: number;
    location: CustodyLocation;
    action: CustodyAction;
    evidence: CustodyEvidence;
    verification: CustodyVerification;
}
type CustodyAction = 'receive' | 'transfer' | 'store' | 'process' | 'seal' | 'unseal' | 'inspect' | 'release';
interface CustodyLocation {
    facilityId: string;
    facilityName: string;
    facilityType: FacilityType;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    address?: string;
}
type FacilityType = 'mine_site' | 'collection_point' | 'transport' | 'processing' | 'refinery' | 'vault' | 'customs' | 'exchange';
interface CustodyEvidence {
    photos: string[];
    documents: string[];
    seals?: SealRecord[];
    weight?: WeightRecord;
    notes?: string;
}
interface SealRecord {
    sealId: string;
    sealType: 'physical' | 'digital' | 'dual';
    appliedAt: number;
    appliedBy: string;
    verifiedAt?: number;
    brokenAt?: number;
    reason?: string;
}
interface WeightRecord {
    gross: number;
    tare: number;
    net: number;
    unit: 'g' | 'kg' | 'oz' | 'troy_oz';
    measuredAt: number;
    measuredBy: string;
    equipment?: string;
    calibrationDate?: string;
}
interface CustodyVerification {
    verifierId: string;
    verifiedAt: number;
    method: VerificationMethod;
    result: 'verified' | 'failed' | 'pending';
    signature: string;
    notes?: string;
}
type VerificationMethod = 'visual' | 'weight' | 'assay' | 'seal_check' | 'documentation' | 'biometric';
/**
 * Lot record - physical asset being tracked
 */
interface VaultLot {
    id: string;
    commodity: CommodityType;
    origin: LotOrigin;
    currentCustody: CustodyChain;
    specifications: LotSpecifications;
    certifications: string[];
    status: LotStatus;
    createdAt: number;
    updatedAt: number;
}
type CommodityType = 'gold_dore' | 'gold_refined' | 'gold_ore' | 'silver' | 'platinum' | 'palladium' | 'coltan' | 'cobalt' | 'other';
interface LotOrigin {
    siteId: string;
    siteName: string;
    region: string;
    country: string;
    extractionDate: string;
    extractedBy: string;
    originCertificate?: string;
}
interface LotSpecifications {
    weight: WeightRecord;
    purity?: number;
    assayReport?: string;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    form?: 'bar' | 'nugget' | 'dust' | 'ore' | 'concentrate';
}
type LotStatus = 'registered' | 'verified' | 'in_transit' | 'stored' | 'processing' | 'listed' | 'traded' | 'settled';

interface User {
    id: string;
    tradePassId: string;
    email?: string;
    phone?: string;
    profile: UserProfile;
    roles: UserRole[];
    status: UserStatus;
    preferences: UserPreferences;
    createdAt: number;
    updatedAt: number;
    lastActiveAt?: number;
}
interface UserProfile {
    firstName: string;
    lastName: string;
    displayName?: string;
    avatar?: string;
    locale: string;
    timezone: string;
    organization?: OrganizationRef;
}
interface OrganizationRef {
    id: string;
    name: string;
    type: OrganizationType;
    role?: string;
}
type OrganizationType = 'mining_cooperative' | 'collection_center' | 'transport_company' | 'refinery' | 'trading_house' | 'government_agency' | 'ngo' | 'financial_institution';
interface UserRole {
    role: string;
    scope?: string;
    grantedAt: number;
    grantedBy?: string;
    expiresAt?: number;
}
type UserStatus = 'pending_verification' | 'active' | 'suspended' | 'deactivated';
interface UserPreferences {
    language: string;
    currency: string;
    notifications: NotificationPreferences;
    privacy: PrivacyPreferences;
}
interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
    types: string[];
}
interface PrivacyPreferences {
    showProfile: boolean;
    showActivity: boolean;
    allowAnalytics: boolean;
}

interface Lot {
    id: string;
    referenceNumber: string;
    commodity: CommodityType;
    origin: LotOrigin;
    specifications: LotSpecifications;
    custody: CustodyChain;
    compliance: LotCompliance;
    certifications: LotCertification[];
    pricing?: LotPricing;
    status: LotStatus;
    visibility: LotVisibility;
    createdAt: number;
    updatedAt: number;
}
interface LotCompliance {
    gciScore: number;
    tier: string;
    evaluatedAt: number;
    attestationId?: string;
    flags: ComplianceFlag[];
}
interface ComplianceFlag {
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    createdAt: number;
    resolvedAt?: number;
}
interface LotCertification {
    id: string;
    type: CertificationType;
    issuer: string;
    issuedAt: number;
    expiresAt?: number;
    documentUrl?: string;
    verified: boolean;
}
type CertificationType = 'origin' | 'assay' | 'conflict_free' | 'environmental' | 'labor' | 'export' | 'import' | 'custom';
interface LotPricing {
    spotPrice: number;
    askingPrice?: number;
    currency: string;
    pricePerUnit: number;
    unit: string;
    updatedAt: number;
}
type LotVisibility = 'private' | 'organization' | 'marketplace' | 'public';
interface LotSummary {
    id: string;
    referenceNumber: string;
    commodity: CommodityType;
    weight: number;
    unit: string;
    origin: {
        country: string;
        region: string;
    };
    complianceTier: string;
    status: LotStatus;
}

interface Permit {
    id: string;
    permitNumber: string;
    type: PermitType;
    jurisdiction: string;
    applicant: PermitApplicant;
    scope: PermitScope;
    conditions: PermitCondition[];
    workflow: PermitWorkflow;
    status: PermitStatus;
    fees: PermitFee[];
    documents: PermitDocument[];
    issuedAt?: number;
    expiresAt?: number;
    createdAt: number;
    updatedAt: number;
}
type PermitType = 'mining_license' | 'small_scale_mining' | 'artisanal_mining' | 'exploration' | 'processing' | 'trading' | 'export' | 'import' | 'transport' | 'environmental';
interface PermitApplicant {
    tradePassId: string;
    name: string;
    type: 'individual' | 'organization';
    organizationId?: string;
    contactInfo: {
        email?: string;
        phone?: string;
        address?: string;
    };
}
interface PermitScope {
    commodity: string[];
    regions: string[];
    sites?: string[];
    volumeLimit?: {
        amount: number;
        unit: string;
        period: 'daily' | 'monthly' | 'yearly' | 'total';
    };
    activities: string[];
}
interface PermitCondition {
    id: string;
    type: string;
    description: string;
    mandatory: boolean;
    verificationMethod?: string;
    compliance?: {
        status: 'compliant' | 'non_compliant' | 'pending';
        lastChecked?: number;
        notes?: string;
    };
}
interface PermitWorkflow {
    currentStep: string;
    steps: WorkflowStep[];
    history: WorkflowEvent[];
}
interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    assignedTo?: string;
    requiredApprovals: number;
    approvals: WorkflowApproval[];
    status: 'pending' | 'in_progress' | 'approved' | 'rejected' | 'skipped';
    dueDate?: number;
}
interface WorkflowApproval {
    approverId: string;
    approverName: string;
    decision: 'approved' | 'rejected' | 'pending';
    comments?: string;
    decidedAt?: number;
}
interface WorkflowEvent {
    id: string;
    type: string;
    actor: string;
    description: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}
type PermitStatus = 'draft' | 'submitted' | 'under_review' | 'pending_approval' | 'approved' | 'issued' | 'active' | 'suspended' | 'expired' | 'revoked' | 'rejected';
interface PermitFee {
    id: string;
    type: string;
    amount: number;
    currency: string;
    status: 'pending' | 'paid' | 'waived' | 'refunded';
    dueDate?: number;
    paidAt?: number;
    receipt?: string;
}
interface PermitDocument {
    id: string;
    type: string;
    name: string;
    url: string;
    uploadedAt: number;
    uploadedBy: string;
    verified: boolean;
    verifiedBy?: string;
    verifiedAt?: number;
}

interface Site {
    id: string;
    name: string;
    type: SiteType;
    location: SiteLocation;
    operator: SiteOperator;
    permits: string[];
    compliance: SiteCompliance;
    production?: ProductionStats;
    status: SiteStatus;
    metadata: SiteMetadata;
    createdAt: number;
    updatedAt: number;
}
type SiteType = 'artisanal_mine' | 'small_scale_mine' | 'large_scale_mine' | 'collection_point' | 'buying_center' | 'processing_facility' | 'refinery' | 'vault' | 'port';
interface SiteLocation {
    country: string;
    region: string;
    district?: string;
    locality?: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    boundary?: GeoPolygon;
    elevation?: number;
    accessNotes?: string;
}
interface GeoPolygon {
    type: 'Polygon';
    coordinates: number[][][];
}
interface SiteOperator {
    tradePassId: string;
    name: string;
    type: 'individual' | 'cooperative' | 'company';
    organizationId?: string;
    contactInfo?: {
        phone?: string;
        email?: string;
    };
}
interface SiteCompliance {
    gciScore: number;
    tier: string;
    lastAssessment?: number;
    nextAssessment?: number;
    issues: SiteIssue[];
    certifications: string[];
}
interface SiteIssue {
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    reportedAt: number;
    resolvedAt?: number;
    resolution?: string;
}
interface ProductionStats {
    totalProduction: number;
    unit: string;
    period: {
        start: number;
        end: number;
    };
    averageDaily?: number;
    lastUpdated: number;
}
type SiteStatus = 'pending_registration' | 'registered' | 'active' | 'suspended' | 'inactive' | 'closed';
interface SiteMetadata {
    geologicalInfo?: GeologicalInfo;
    infrastructure?: InfrastructureInfo;
    workforce?: WorkforceInfo;
    environmental?: EnvironmentalInfo;
}
interface GeologicalInfo {
    formation?: string;
    mineralogy?: string[];
    goldPotential?: 'high' | 'medium' | 'low';
    estimatedReserves?: number;
    reservesUnit?: string;
}
interface InfrastructureInfo {
    hasRoadAccess: boolean;
    hasElectricity: boolean;
    hasWater: boolean;
    hasCommunications: boolean;
    equipment?: string[];
    facilities?: string[];
}
interface WorkforceInfo {
    totalWorkers: number;
    categories?: Record<string, number>;
    safetyTraining: boolean;
    lastTrainingDate?: number;
}
interface EnvironmentalInfo {
    impactAssessment?: string;
    mitigationPlan?: string;
    monitoringSchedule?: string;
    lastInspection?: number;
}

/**
 * Standard API response wrapper
 */
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: ResponseMeta;
}
interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
}
interface ResponseMeta {
    requestId: string;
    timestamp: number;
    processingTime: number;
    version: string;
}
/**
 * Paginated response
 */
interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: PaginationInfo;
}
interface PaginationInfo {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
}
/**
 * Pagination request params
 */
interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
/**
 * Filter params
 */
interface FilterParams {
    search?: string;
    status?: string | string[];
    dateFrom?: string;
    dateTo?: string;
    [key: string]: unknown;
}
/**
 * Health check response
 */
interface HealthResponse {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    uptime: number;
    checks: HealthCheck[];
}
interface HealthCheck {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    latency?: number;
    message?: string;
}

interface PanxVerifyRequest {
    eventType: string;
    payload: Record<string, unknown>;
    signatures: VerifierSignature[];
    requiredConfidence?: number;
}
interface VerifierSignature {
    verifierId: string;
    signature: string;
    publicKey: string;
    timestamp: number;
    weight?: number;
}
interface PanxVerifyResponse {
    eventId: string;
    verified: boolean;
    confidence: number;
    consensus: ConsensusResult;
    timestamp: number;
    attestation?: string;
}
interface ConsensusResult {
    totalWeight: number;
    threshold: number;
    agreeing: number;
    dissenting: number;
    abstaining: number;
    breakdown: VerifierVote[];
}
interface VerifierVote {
    verifierId: string;
    vote: 'agree' | 'disagree' | 'abstain';
    weight: number;
    reason?: string;
}
interface CortexIngestRequest {
    events: CortexEvent[];
    source: string;
    batchId?: string;
}
interface CortexEvent {
    type: string;
    timestamp: number;
    actorId?: string;
    subjectId?: string;
    subjectType?: string;
    data: Record<string, unknown>;
    location?: {
        latitude: number;
        longitude: number;
    };
}
interface CortexIngestResponse {
    accepted: number;
    rejected: number;
    batchId: string;
    errors?: Array<{
        index: number;
        message: string;
    }>;
}
interface CortexAnomalyAlert {
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedEntity: {
        type: string;
        id: string;
    };
    detectedAt: number;
    evidence: Record<string, unknown>;
    recommendedActions?: string[];
}
interface CortexAnalyticsQuery {
    metric: string;
    dimensions?: string[];
    filters?: Record<string, unknown>;
    timeRange: {
        start: number;
        end: number;
        granularity?: 'hour' | 'day' | 'week' | 'month';
    };
    aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}
interface CortexAnalyticsResponse {
    metric: string;
    data: Array<{
        timestamp: number;
        value: number;
        dimensions?: Record<string, string>;
    }>;
    summary: {
        total: number;
        average: number;
        min: number;
        max: number;
    };
}
interface AnisaContextRequest {
    userId: string;
    location?: {
        country: string;
        region?: string;
    };
    language?: string;
    interactionType: string;
    previousContext?: string;
}
interface AnisaContextResponse {
    contextId: string;
    culturalContext: CulturalContext;
    recommendations: CulturalRecommendation[];
    adaptations: UIAdaptation[];
}
interface CulturalContext {
    locale: string;
    language: string;
    region: string;
    culturalNorms: string[];
    communicationStyle: string;
    formalityLevel: 'formal' | 'semi_formal' | 'informal';
    timeOrientation: string;
    trustFactors: string[];
}
interface CulturalRecommendation {
    type: string;
    priority: number;
    recommendation: string;
    rationale: string;
}
interface UIAdaptation {
    element: string;
    adaptation: string;
    value: unknown;
}
interface AnisaInsightRequest {
    topic: string;
    context: {
        userId?: string;
        region?: string;
        industry?: string;
    };
    depth?: 'brief' | 'detailed' | 'comprehensive';
}
interface AnisaInsightResponse {
    insightId: string;
    topic: string;
    summary: string;
    insights: Insight[];
    sources?: string[];
    confidence: number;
}
interface Insight {
    title: string;
    content: string;
    relevance: number;
    actionable: boolean;
    suggestedActions?: string[];
}

interface CrxPermitCreateRequest {
    type: string;
    applicantId: string;
    scope: {
        commodity: string[];
        regions: string[];
        activities: string[];
    };
    documents?: string[];
    metadata?: Record<string, unknown>;
}
interface CrxPermitResponse {
    permitId: string;
    permitNumber: string;
    status: string;
    currentStep: string;
    nextActions: PermitAction[];
    estimatedCompletion?: number;
}
interface PermitAction {
    action: string;
    description: string;
    requiredBy?: string;
    deadline?: number;
    instructions?: string;
}
interface CrxComplianceCheckRequest {
    subjectId: string;
    subjectType: 'tradepass' | 'lot' | 'site';
    checkType?: string;
    policyIds?: string[];
}
interface CrxComplianceCheckResponse {
    checkId: string;
    subjectId: string;
    score: number;
    tier: string;
    passed: boolean;
    results: Array<{
        policyId: string;
        policyName: string;
        score: number;
        issues: string[];
    }>;
    attestationId?: string;
}
interface SgxListingCreateRequest {
    lotId: string;
    sellerId: string;
    price: {
        amount: number;
        currency: string;
        pricePerUnit: number;
        unit: string;
    };
    terms: {
        minimumQuantity?: number;
        settlementType: string;
        deliveryMethod: string;
        validUntil: number;
    };
    visibility?: 'public' | 'private' | 'invited';
}
interface SgxListingResponse {
    listingId: string;
    lotId: string;
    status: string;
    price: {
        amount: number;
        currency: string;
        pricePerUnit: number;
        unit: string;
    };
    available: {
        quantity: number;
        unit: string;
    };
    views: number;
    inquiries: number;
    createdAt: number;
}
interface SgxOrderRequest {
    listingId: string;
    buyerId: string;
    quantity: {
        amount: number;
        unit: string;
    };
    paymentMethod: string;
    deliveryPreference?: string;
}
interface SgxOrderResponse {
    orderId: string;
    listingId: string;
    status: string;
    totalAmount: number;
    currency: string;
    settlement: {
        status: string;
        paymentDeadline: number;
        deliveryDeadline: number;
    };
    instructions: string[];
}
interface SgxTradeResponse {
    tradeId: string;
    buyOrderId: string;
    sellOrderId: string;
    lotId: string;
    quantity: number;
    unit: string;
    price: number;
    currency: string;
    total: number;
    status: string;
    settledAt?: number;
}
interface AgxDiscoveryRequest {
    commodity: string;
    quantity?: {
        min?: number;
        max?: number;
        unit: string;
    };
    price?: {
        min?: number;
        max?: number;
        currency: string;
    };
    origins?: string[];
    complianceTier?: string[];
    certifications?: string[];
}
interface AgxDiscoveryResponse {
    listings: AgxListing[];
    totalCount: number;
    aggregations: {
        byOrigin: Record<string, number>;
        byTier: Record<string, number>;
        priceRange: {
            min: number;
            max: number;
        };
        quantityRange: {
            min: number;
            max: number;
        };
    };
}
interface AgxListing {
    listingId: string;
    sgxId: string;
    lotSummary: {
        commodity: string;
        weight: number;
        unit: string;
        origin: string;
        complianceTier: string;
    };
    price: {
        amount: number;
        currency: string;
        pricePerUnit: number;
    };
    seller: {
        id: string;
        rating?: number;
        verifiedSince?: number;
    };
    availability: string;
}
interface AgxRouteRequest {
    buyerLocation: string;
    sellerLocation: string;
    commodity: string;
    quantity: number;
    urgency?: 'standard' | 'express' | 'urgent';
}
interface AgxRouteResponse {
    routes: TradeRoute[];
    recommendedRoute: string;
    estimatedCosts: RouteCosts;
}
interface TradeRoute {
    id: string;
    path: string[];
    duration: number;
    cost: number;
    compliance: string[];
    risks: string[];
}
interface RouteCosts {
    transport: number;
    insurance: number;
    duties: number;
    fees: number;
    total: number;
    currency: string;
}

type ErrorCode = 'AUTH_REQUIRED' | 'AUTH_INVALID' | 'AUTH_EXPIRED' | 'PERMISSION_DENIED' | 'ROLE_REQUIRED' | 'VALIDATION_ERROR' | 'INVALID_INPUT' | 'MISSING_FIELD' | 'INVALID_FORMAT' | 'NOT_FOUND' | 'ALREADY_EXISTS' | 'CONFLICT' | 'GONE' | 'COMPLIANCE_FAILED' | 'INSUFFICIENT_BALANCE' | 'QUOTA_EXCEEDED' | 'OPERATION_NOT_ALLOWED' | 'WORKFLOW_ERROR' | 'VERIFICATION_FAILED' | 'SIGNATURE_INVALID' | 'PROOF_EXPIRED' | 'CONSENSUS_NOT_REACHED' | 'INTERNAL_ERROR' | 'SERVICE_UNAVAILABLE' | 'TIMEOUT' | 'RATE_LIMITED';
interface GtcxError {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    timestamp: number;
    requestId?: string;
    retryable?: boolean;
    retryAfter?: number;
}
declare class GtcxException extends Error {
    readonly code: ErrorCode;
    readonly details?: Record<string, unknown> | undefined;
    constructor(code: ErrorCode, message: string, details?: Record<string, unknown> | undefined);
    toJSON(): GtcxError;
}

type EventType = 'identity.created' | 'identity.updated' | 'identity.verified' | 'identity.suspended' | 'role.granted' | 'role.revoked' | 'location.captured' | 'location.verified' | 'photo.captured' | 'session.started' | 'session.completed' | 'compliance.evaluated' | 'compliance.passed' | 'compliance.failed' | 'attestation.issued' | 'custody.received' | 'custody.transferred' | 'custody.sealed' | 'custody.verified' | 'lot.registered' | 'lot.certified' | 'listing.created' | 'listing.updated' | 'listing.cancelled' | 'order.placed' | 'order.matched' | 'order.cancelled' | 'trade.executed' | 'settlement.initiated' | 'settlement.completed' | 'settlement.failed' | 'permit.submitted' | 'permit.approved' | 'permit.rejected' | 'permit.issued' | 'permit.expired' | 'permit.revoked';
interface DomainEvent<T = unknown> {
    id: string;
    type: EventType;
    timestamp: number;
    version: string;
    source: string;
    correlationId?: string;
    causationId?: string;
    actor?: {
        id: string;
        type: string;
    };
    subject?: {
        id: string;
        type: string;
    };
    data: T;
    metadata?: Record<string, unknown>;
}
interface EventEnvelope {
    event: DomainEvent;
    partition?: string;
    key?: string;
    headers?: Record<string, string>;
}
interface EventHandler<T = unknown> {
    eventType: EventType | EventType[];
    handle(event: DomainEvent<T>): Promise<void>;
}
interface EventSubscription {
    id: string;
    eventTypes: EventType[];
    handler: string;
    filter?: Record<string, unknown>;
    active: boolean;
}

export { type AgxDiscoveryRequest, type AgxDiscoveryResponse, type AgxListing, type AgxRouteRequest, type AgxRouteResponse, type AnisaContextRequest, type AnisaContextResponse, type AnisaInsightRequest, type AnisaInsightResponse, type ApiError, type ApiResponse, type AssetLeg, type AtomicSwap, type BoundingBox, type CertificationType, type CommodityType$1 as CommodityType, type ComplianceAttestation, type ComplianceEvaluation, type ComplianceFlag, type CompliancePolicy, type ComplianceRule, type ComplianceScore, type ComplianceTier, type ConditionOperator, type ConsensusResult, type CortexAnalyticsQuery, type CortexAnalyticsResponse, type CortexAnomalyAlert, type CortexEvent, type CortexIngestRequest, type CortexIngestResponse, type CredentialIssuer, type CredentialProof$1 as CredentialProof, type CredentialSubject, type CrxComplianceCheckRequest, type CrxComplianceCheckResponse, type CrxPermitCreateRequest, type CrxPermitResponse, type CryptoAlgorithm, type CryptographicProof, type CulturalContext, type CulturalRecommendation, type CustodyAction, type CustodyChain, type CustodyEntry, type CustodyEvidence, type CustodyLocation, type CustodyStatus, type CustodyVerification, type DeliveryMethod, type DeviceAttestation, type DeviceIdentity, type DigitalIdentity, type DomainEvent, type EnhancedIdentity, type EntropyValidation, type EnvironmentalInfo, type ErrorCode, type EscrowAccount, type EscrowStatus, type EventEnvelope, type EventHandler, type EventSubscription, type EventType, type FacilityType, type FilterParams, type GeoCoordinates, type GeoPolygon, type GeoTagData, type GeoTagProof, type GeoTagProofType, type GeoTagSession, type GeologicalContext, type GeologicalInfo, type GtcxError, GtcxException, type HealthCheck, type HealthResponse, type IdentityMetadata, type IdentityVerificationResult, type InfrastructureInfo, type Insight, type KeyDerivationParams, type KeyPair, type LocationClaim, type LocationProof, type Lot, type LotCertification, type LotCompliance, type LotData, type LotOrigin, type LotPricing, type LotSpecifications, type LotStatus, type LotSummary, type LotVisibility, type MeasurementUnit, type MultiKeyPairs, type NotificationPreferences, type OrderStatus, type OrganizationRef, type OrganizationType, type OriginCertificate, type PaginatedResponse, type PaginationInfo, type PaginationParams, type PanxVerifyRequest, type PanxVerifyResponse, type PaymentLeg, type PaymentMethod, type Permit, type PermitAction, type PermitApplicant, type PermitCondition, type PermitDocument, type PermitFee, type PermitScope, type PermitStatus, type PermitType, type PermitWorkflow, type PhotoCategory, type PhotoEvidence, type PhotoMetadata, type PolicyMetadata, type PolicyRegistry, type PriceQuote, type PrivacyPreferences, type ProductionStats, type ProofMetadata, type QualityGrade, type QuantitySpec, type ReleaseCondition, type ResourceContext, type ResponseMeta, type RoleConstraints, type RoleDelegation, type RouteCosts, type RuleCondition, type RuleResult, type RuleType, type SealRecord, type SecurityLevel, type SettlementRecord, type SettlementStatus, type SettlementTimeline, type SettlementType, type SettlementVerification, type SgxListingCreateRequest, type SgxListingResponse, type SgxOrderRequest, type SgxOrderResponse, type SgxTradeResponse, type Site, type SiteCompliance, type SiteIssue, type SiteLocation, type SiteMetadata, type SiteOperator, type SiteReference, type SiteStatus, type SiteType, type SwapStatus, type TradeMatch, type TradeOrder, type TradePassDID, type TradePassIdentity, type TradePassRole, type TradePassRoleType, type TradeRoute, type TradeTerms, type UIAdaptation, type User, type UserPreferences, type UserProfile, type UserRole, type UserStatus, type VaultLot, type VerifiableCredential$1 as VerifiableCredential, type VerificationMethod, type VerifierSignature, type VerifierVote, type WeightRecord, type WorkflowApproval, type WorkflowEvent, type WorkflowStep, type WorkforceInfo, createResourceContext, migrateGeologicalContext };
