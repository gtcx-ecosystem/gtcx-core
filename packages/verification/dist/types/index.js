"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateGoldLotData = exports.COMMODITY_CONFIGS = exports.ROLE_TO_CREDENTIAL = exports.COMMODITY_CATEGORIES = void 0;
exports.getCommodityConfig = getCommodityConfig;
exports.getCommodityCategory = getCommodityCategory;
exports.getCredentialForRole = getCredentialForRole;
exports.migrateLegacyLotData = migrateLegacyLotData;
/**
 * Commodity category mapping
 */
exports.COMMODITY_CATEGORIES = {
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
 * Map operator roles to credential types
 */
exports.ROLE_TO_CREDENTIAL = {
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
/**
 * Pre-defined commodity configurations
 */
exports.COMMODITY_CONFIGS = {
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
function getCommodityConfig(type) {
    var _a;
    return (_a = exports.COMMODITY_CONFIGS[type]) !== null && _a !== void 0 ? _a : exports.COMMODITY_CONFIGS.other;
}
/**
 * Get category for a commodity
 */
function getCommodityCategory(type) {
    return exports.COMMODITY_CATEGORIES[type];
}
/**
 * Get credential type for an operator role
 */
function getCredentialForRole(role) {
    return exports.ROLE_TO_CREDENTIAL[role];
}
/**
 * Convert legacy lot data format to universal AssetLotData
 * @deprecated The GoldLotData type itself is deprecated - use AssetLotData directly
 */
function migrateLegacyLotData(legacyData, commodityType = 'gold') {
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
exports.migrateGoldLotData = migrateLegacyLotData;
// ============================================================================
// RE-EXPORT ZOD SCHEMAS
// ============================================================================
__exportStar(require("./schemas"), exports);
//# sourceMappingURL=index.js.map