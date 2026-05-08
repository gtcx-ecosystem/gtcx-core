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

// Canonical types imported from @gtcx/types (single source of truth)
import type {
  CommodityType,
  ResourceContext,
  GeologicalContext,
  SiteReference,
  CustodyEntry,
  SettlementRecord,
} from '@gtcx/types';

// Re-export so downstream consumers of @gtcx/verification still get these types
export type {
  CommodityType,
  ResourceContext,
  GeologicalContext,
  SiteReference,
  CustodyEntry,
  SettlementRecord,
};

/**
 * Security levels for certificates
 */
export type CertificateSecurityLevel = 'standard' | 'enhanced' | 'military' | 'post-quantum';

/**
 * Certificate type discriminator - ROLE-BASED, not commodity-specific
 * These map to verification activities, not credential types
 */
export type CertificateType =
  | 'asset-origin' // Origin verification for any commodity
  | 'location' // Pure location verification
  | 'photo' // Photo evidence verification
  | 'work-site' // Site check-in verification
  | 'compliance' // Regulatory compliance verification
  | 'government-inspection' // Government inspector verification
  | 'custody-transfer' // VaultMark custody change
  | 'settlement' // PvP settlement verification
  | 'quality-assay' // Quality/purity certification
  | 'chain-of-custody'; // Provenance chain link

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
  | 'TradePass' // 01. Universal container
  | 'ProducerID' // 02. Extraction/harvesting authorization
  | 'SiteID' // 03. Location authorization
  | 'AggregatorID' // 04. Consolidation/buying authorization
  | 'ProcessorID' // 05. Transformation authorization
  | 'TraderID' // 06. Buying/selling authorization
  | 'CustodyID' // 07. Storage/security authorization
  | 'LogisticsID' // 08. Transport authorization
  | 'CertifierID' // 09. Testing/auditing authorization
  | 'BuyerID' // 10. End purchase authorization
  | 'AuthorityID' // 11. Government/regulatory
  | 'FinanceID' // 12. Financial services
  | 'SecurityID'; // 13. Physical security

/**
 * Credential subtypes - used as discriminators within each credential type
 */
export interface CredentialSubtypes {
  ProducerID: 'Individual' | 'Group' | 'Operation' | 'Industrial';
  SiteID:
    | 'ExtractionSite'
    | 'ProcessingFacility'
    | 'StorageFacility'
    | 'TransitPoint'
    | 'TradePremises'
    | 'Port'
    | 'BorderCrossing';
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

// CommodityType: imported from @gtcx/types (see top of file)

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
  | 'g'
  | 'kg'
  | 'oz'
  | 'troy_oz'
  | 'lb'
  | 'mt' // Weight
  | 'ct' // Carats (gemstones)
  | 'bag'
  | 'bale'
  | 'barrel' // Volume/container
  | 'l'
  | 'gal'; // Liquid

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
  | 'RAW' // Freshly extracted/harvested, unprocessed
  | 'PRIMARY_PROCESSED' // Initial beneficiation (washed, dried, sorted)
  | 'SECONDARY_PROCESSED' // Further transformation (smelted, concentrated)
  | 'REFINED' // Final purity achieved (refined bar, processed cocoa)
  | 'CERTIFIED' // Quality certified, ready for market
  | 'FINISHED' // Manufactured into final product
  | 'TRANSFERRED'; // Ownership transferred to end buyer

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
  | 'ExtractionSite' // Where commodities are extracted
  | 'ProcessingFacility' // Where commodities are transformed
  | 'StorageFacility' // Where commodities are stored
  | 'TransitPoint' // Intermediate handling locations
  | 'TradePremises' // Commercial trading locations
  | 'Port' // International transit points
  | 'BorderCrossing'; // Customs/border points

/**
 * Site types within each category
 */
export interface SiteTypes {
  ExtractionSite: 'Mine' | 'Farm' | 'Plantation' | 'Fishery' | 'Forest' | 'Quarry';
  ProcessingFacility:
    | 'Mill'
    | 'Refinery'
    | 'Smelter'
    | 'DryingFacility'
    | 'WashingPlant'
    | 'Factory';
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
  | 'mine'
  | 'farm'
  | 'plantation'
  | 'fishery'
  | 'forest'
  | 'quarry'
  // Processing
  | 'mill'
  | 'refinery'
  | 'smelter'
  | 'drying-facility'
  | 'washing-plant'
  | 'factory'
  // Storage
  | 'vault'
  | 'warehouse'
  | 'silo'
  | 'free-zone'
  | 'bonded-warehouse'
  // Transit
  | 'collection-center'
  | 'weighing-station'
  | 'checkpoint'
  | 'transfer-hub'
  // Trade
  | 'buying-center'
  | 'trading-office'
  | 'retail-shop'
  | 'auction-house'
  // Port/Border
  | 'seaport'
  | 'airport'
  | 'inland-port'
  | 'customs-post'
  | 'land-border';

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
  | 'producer' // ProducerID - Extraction (miner, farmer, harvester)
  | 'aggregator' // AggregatorID - Collection/consolidation
  | 'processor' // ProcessorID - Transformation (refiner, mill)
  | 'trader' // TraderID - Commercial trade
  | 'custodian' // CustodyID - Storage (vault operator)
  | 'transporter' // LogisticsID - Logistics
  | 'certifier' // CertifierID - Testing/auditing
  | 'buyer' // BuyerID - End purchaser
  | 'authority' // AuthorityID - Government/regulatory
  | 'financier' // FinanceID - Financial services
  | 'security'; // SecurityID - Physical security

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

