/**
 * @gtcx/domain - Core Domain Types
 * 
 * Commodity-agnostic type definitions for GTCX domain services.
 * These types support any commodity type (gold, cocoa, minerals, etc.)
 * and any jurisdiction's regulatory framework.
 */

// ============================================================================
// LOCATION & GEOGRAPHY
// ============================================================================

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: number;
}

export interface LocationWithAddress extends Location {
  address: string;
  region?: string;
  country?: string;
}

// ============================================================================
// ASSET LOT - Commodity-Agnostic Asset Unit
// ============================================================================

/**
 * Physical form classifications for commodities
 * Extensible per commodity type via configuration
 */
export type AssetForm = string; // e.g., 'nugget', 'dust', 'ore', 'refined', 'raw'

/**
 * Asset quality/purity grade
 */
export type QualityGrade = 'A' | 'B' | 'C' | 'D' | 'ungraded';

/**
 * Status of an asset lot in the supply chain
 */
export type AssetLotStatus = 
  | 'discovered'
  | 'registered'
  | 'verified'
  | 'in_transit'
  | 'at_aggregator'
  | 'at_refiner'
  | 'exported'
  | 'settled';

/**
 * Core asset lot entity - represents a unit of commodity
 */
export interface AssetLot {
  id: string;
  commodityType: string; // e.g., 'gold', 'cocoa', 'coltan'
  discoveryLocation: Location;
  discoveryDate: string;
  producerId: string; // Generic term for miner/farmer/extractor
  
  // Physical characteristics
  weight: number;
  weightUnit: string; // 'g', 'kg', 'oz', 'lb'
  purity?: number; // 0-100 percentage
  form?: AssetForm;
  qualityGrade?: QualityGrade;
  
  // Verification
  cryptoProof?: string;
  certificateId?: string;
  geoTagId?: string;
  
  status: AssetLotStatus;
  
  // Metadata
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ASSET REGISTRATION
// ============================================================================

/**
 * Data required to register an asset lot
 */
export interface AssetRegistrationData {
  commodityType: string;
  discoveryDate: string;
  location: LocationWithAddress;
  assetDetails: {
    estimatedQuantity: number;
    weightUnit: string;
    purity?: number;
    form?: AssetForm;
    characteristics?: Record<string, unknown>; // Commodity-specific attributes
  };
  photos: string[];
  notes?: string;
  producerId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Registration workflow step
 */
export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
  isRequired: boolean;
  isCompleted: boolean;
  order: number;
}

/**
 * Registration progress tracking
 */
export interface RegistrationProgress {
  percentage: number;
  completedSteps: string[];
  nextStep: string | null;
  estimatedTimeRemaining?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Cryptographic proof for asset verification
 */
export interface CryptographicProof {
  hash: string;
  signature: string;
  certificate: AssetCertificate;
}

/**
 * Asset certificate
 */
export interface AssetCertificate {
  id: string;
  lotId: string;
  hash: string;
  signature: string;
  timestamp: string;
  producerLicense: string;
  location: Location;
  assetCharacteristics: Record<string, unknown>;
  verificationLevel: 'preliminary' | 'standard' | 'enhanced' | 'premium';
  issuedBy: string;
  expiresAt?: string;
}

// ============================================================================
// TRADING
// ============================================================================

/**
 * Market participant
 */
export interface Trader {
  id: string;
  licenseNumber: string;
  name: string;
  location: Location;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  roles?: ('producer' | 'aggregator' | 'trader' | 'refiner' | 'exporter')[];
}

/**
 * Transaction record
 */
export interface Transaction {
  id: string;
  assetLotId: string;
  fromTraderId: string;
  toTraderId: string;
  quantity: number;
  quantityUnit: string;
  price: number;
  currency: string;
  timestamp: string;
  location: Location;
  cryptoSignature: string;
  status: 'pending' | 'confirmed' | 'completed' | 'disputed' | 'cancelled';
  metadata?: Record<string, unknown>;
}

/**
 * Market price information
 */
export interface MarketPrice {
  commodityType: string;
  assetForm?: AssetForm;
  purity?: number;
  basePrice: number;
  currency: string;
  timestamp: string;
  source: string;
  spread?: number;
}

/**
 * Trading opportunity
 */
export interface TradingOpportunity {
  id: string;
  assetLotId: string;
  assetLot: AssetLot;
  seller: Trader;
  askPrice: number;
  currency: string;
  location: Location;
  availableUntil: string;
  minQuantity: number;
  maxQuantity: number;
  qualityGrade: QualityGrade;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  complianceStatus: 'pending' | 'verified' | 'approved';
}

/**
 * Trade execution request
 */
export interface TradeRequest {
  opportunityId: string;
  buyerId: string;
  quantity: number;
  agreedPrice: number;
  paymentMethod: string;
  deliveryLocation?: Location;
}

/**
 * Trade analytics
 */
export interface TradeAnalytics {
  totalVolume: number;
  volumeUnit: string;
  averagePrice: number;
  currency: string;
  priceChange: number;
  priceChangePeriod: string;
  marketTrend: 'bullish' | 'bearish' | 'neutral';
  liquidityScore: number;
  riskAssessment: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// ============================================================================
// COMPLIANCE
// ============================================================================

/**
 * Regulatory authority
 */
export type RegulatoryAuthority = string; // e.g., 'minerals_commission', 'epa', 'customs'

/**
 * Compliance category
 */
export type ComplianceCategory = 
  | 'licensing'
  | 'environmental'
  | 'financial'
  | 'operational'
  | 'export'
  | 'labor'
  | 'safety';

/**
 * Compliance status
 */
export type ComplianceStatus = 'compliant' | 'warning' | 'violation' | 'pending_review';

/**
 * Compliance severity
 */
export type ComplianceSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Compliance record
 */
export interface ComplianceRecord {
  id: string;
  type: string;
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  
  sourceApp: string;
  sourceEntityId: string;
  sourceEntityType: 'asset_lot' | 'transaction' | 'trader' | 'producer';
  
  regulation: {
    code: string;
    title: string;
    description: string;
    authority: RegulatoryAuthority;
    category: ComplianceCategory;
    jurisdiction?: string;
  };
  
  finding: {
    description: string;
    evidence?: string[];
    location?: Location;
    timestamp: string;
    reportedBy: string;
    verifiedBy?: string;
  };
  
  resolution?: {
    status: 'pending' | 'in_progress' | 'resolved' | 'escalated';
    actions: string[];
    assignedTo: string;
    dueDate: string;
    completedDate?: string;
    cost?: number;
  };
  
  metadata: {
    createdAt: string;
    updatedAt: string;
    tags: string[];
    priority: number;
    references: string[];
  };
}

/**
 * Regulatory requirement
 */
export interface RegulatoryRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  mandatory: boolean;
  applicableTo: string[]; // roles
  verificationMethod: string;
  renewalPeriod?: string;
  jurisdiction: string;
}

/**
 * Regulatory framework
 */
export interface RegulatoryFramework {
  code: string;
  title: string;
  description: string;
  authority: RegulatoryAuthority;
  category: ComplianceCategory;
  jurisdiction: string;
  commodityTypes?: string[]; // If specific to certain commodities
  requirements: RegulatoryRequirement[];
  penalties: {
    violation: string;
    penalty: string;
    fine?: string;
  }[];
  effectiveDate: string;
  lastUpdated: string;
}

/**
 * Compliance dashboard
 */
export interface ComplianceDashboard {
  overview: {
    totalRecords: number;
    compliantPercentage: number;
    pendingIssues: number;
    criticalViolations: number;
    complianceScore: number;
    trendDirection: 'improving' | 'declining' | 'stable';
  };
  
  byCategory: Record<string, {
    total: number;
    compliant: number;
    violations: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  
  urgentActions: ComplianceRecord[];
  recentActivity: ComplianceRecord[];
  upcomingDeadlines: {
    record: ComplianceRecord;
    daysRemaining: number;
  }[];
}

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

/**
 * Crypto service interface for dependency injection
 */
export interface ICryptoService {
  createHash(data: string): Promise<string>;
  sign(data: string): Promise<string>;
  verify(data: string, signature: string): Promise<boolean>;
  signTransaction(data: Record<string, unknown>): Promise<string>;
}

/**
 * Location service interface
 */
export interface ILocationService {
  getCurrentLocation(options: { accuracy: string; timeout: number; maximumAge: number }): Promise<Location>;
  reverseGeocode(latitude: number, longitude: number): Promise<{ formattedAddress: string }>;
}

/**
 * Storage service interface
 */
export interface IStorageService {
  saveAssetLot(lot: AssetLot): Promise<void>;
  getAssetLot(id: string): Promise<AssetLot | null>;
  saveCertificate(cert: AssetCertificate): Promise<void>;
  saveTransaction(tx: Transaction): Promise<void>;
}

/**
 * Price service interface
 */
export interface IPriceService {
  getMarketPrice(commodityType: string, source?: string): Promise<number>;
  getExchangeRate(from: string, to: string): Promise<number>;
}

/**
 * Compliance service interface
 */
export interface IComplianceService {
  validateLicenses(traderId: string): Promise<boolean>;
  checkCompliance(entityId: string, entityType: string): Promise<ComplianceRecord[]>;
}
