import type { GoldLotData, AssetLotData } from './certificates';
import type {
  CommodityType,
  AssetCategory,
  MeasurementUnit,
  QualityGrade,
  OperatorRole,
  SiteType,
  CredentialType,
} from './primitives';
import { COMMODITY_CATEGORIES, ROLE_TO_CREDENTIAL } from './primitives';
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
export function migrateLegacyLotData(
  legacyData: GoldLotData,
  commodityType: CommodityType = 'gold'
): AssetLotData {
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

export * from '../schemas';
