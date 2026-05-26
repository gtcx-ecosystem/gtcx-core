// ============================================================================
// ENUM SCHEMAS
// Basic Zod enum schemas used across the verification type system.
// ============================================================================

import { z } from 'zod';

export const CertificateSecurityLevelSchema = z.enum([
  'standard',
  'enhanced',
  'military',
  'post-quantum',
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
  'gold',
  'silver',
  'platinum',
  'palladium',
  'rhodium',
  // Agricultural
  'cocoa',
  'coffee',
  'cotton',
  'sugar',
  'vanilla',
  'palm_oil',
  'rubber',
  // Industrial Minerals
  'cobalt',
  'lithium',
  'copper',
  'tin',
  'tantalum',
  'tungsten',
  // Gemstones
  'diamond',
  'ruby',
  'emerald',
  'sapphire',
  // Energy
  'crude_oil',
  'natural_gas',
  'lng',
  // Fallback
  'other',
]);

export const MeasurementUnitSchema = z.enum([
  'g',
  'kg',
  'oz',
  'troy_oz',
  'lb',
  'mt',
  'ct',
  'bag',
  'bale',
  'barrel',
  'l',
  'gal',
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
  'mine',
  'farm',
  'plantation',
  'fishery',
  'forest',
  'quarry',
  // Processing
  'mill',
  'refinery',
  'smelter',
  'drying-facility',
  'washing-plant',
  'factory',
  // Storage
  'vault',
  'warehouse',
  'silo',
  'free-zone',
  'bonded-warehouse',
  // Transit
  'collection-center',
  'weighing-station',
  'checkpoint',
  'transfer-hub',
  // Trade
  'buying-center',
  'trading-office',
  'retail-shop',
  'auction-house',
  // Port/Border
  'seaport',
  'airport',
  'inland-port',
  'customs-post',
  'land-border',
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
  'entity',
  'composite',
]);

export const EvidenceTypeSchema = z.enum([
  'government_id',
  'biometric_face',
  'biometric_fingerprint',
  'corporate_registry',
  'trade_license',
  'export_permit',
  'origin_certificate',
  'lab_assay',
  'insurance_bond',
  'bank_guarantee',
  'shipping_manifest',
  'customs_declaration',
  'warehouse_receipt',
  'quality_certificate',
  'chain_of_custody',
  'environmental_audit',
  'social_audit',
  'sanctions_screening',
  'site_audit',
  'assay_report',
  'photo_evidence',
  'gps_location',
  'document_hash',
  'witness_attestation',
  'biometric_attestation',
  'mining_license',
  'sovereign_registry_record',
  'cooperative_registry_record',
  'traceability_record',
  'regional_certification_record',
  'protocol_signatory_record',
  'price_feed_record',
  'conflict_screening_record',
  'satellite_imagery_record',
  'hardware_seal_record',
]);
