import { z } from 'zod';
export declare const CertificateSecurityLevelSchema: z.ZodEnum<["standard", "enhanced", "military", "quantum-resistant"]>;
export declare const CertificateTypeSchema: z.ZodEnum<["asset-origin", "location", "photo", "work-site", "compliance", "government-inspection", "custody-transfer", "settlement", "quality-assay", "chain-of-custody"]>;
export declare const QRCodeTypeSchema: z.ZodEnum<["location", "photo", "certificate", "asset-lot"]>;
export declare const CredentialTypeSchema: z.ZodEnum<["TradePass", "ProducerID", "SiteID", "AggregatorID", "ProcessorID", "TraderID", "CustodyID", "LogisticsID", "CertifierID", "BuyerID", "AuthorityID", "FinanceID", "SecurityID"]>;
export declare const OperatorTierSchema: z.ZodUnion<[z.ZodLiteral<1>, z.ZodLiteral<2>, z.ZodLiteral<3>]>;
export declare const AssetCategorySchema: z.ZodEnum<["PreciousMetals", "Agricultural", "IndustrialMinerals", "Gemstones", "Energy"]>;
export declare const CommodityTypeSchema: z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>;
export declare const MeasurementUnitSchema: z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>;
export declare const QualityGradeSchema: z.ZodEnum<["high", "medium", "low", "ungraded"]>;
export declare const AssetLifecycleStateSchema: z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>;
export declare const SiteCategorySchema: z.ZodEnum<["ExtractionSite", "ProcessingFacility", "StorageFacility", "TransitPoint", "TradePremises", "Port", "BorderCrossing"]>;
export declare const SiteTypeSchema: z.ZodEnum<["mine", "farm", "plantation", "fishery", "forest", "quarry", "mill", "refinery", "smelter", "drying-facility", "washing-plant", "factory", "vault", "warehouse", "silo", "free-zone", "bonded-warehouse", "collection-center", "weighing-station", "checkpoint", "transfer-hub", "buying-center", "trading-office", "retail-shop", "auction-house", "seaport", "airport", "inland-port", "customs-post", "land-border"]>;
export declare const OperatorRoleSchema: z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>;
export declare const PredicateDomainSchema: z.ZodEnum<["identity", "compliance", "asset", "location", "relationship", "temporal", "financial", "composite"]>;
export declare const EvidenceTypeSchema: z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>;
export declare const CertificateLocationSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
    altitude: z.ZodOptional<z.ZodNumber>;
    accuracy: z.ZodNumber;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    timestamp: number;
    accuracy: number;
    latitude: number;
    longitude: number;
    altitude?: number | undefined;
}, {
    timestamp: number;
    accuracy: number;
    latitude: number;
    longitude: number;
    altitude?: number | undefined;
}>;
export declare const EnvironmentalFactorsSchema: z.ZodObject<{
    satelliteCount: z.ZodNumber;
    signalStrength: z.ZodNumber;
    atmosphericConditions: z.ZodString;
    multipathIndicator: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    satelliteCount: number;
    signalStrength: number;
    atmosphericConditions: string;
    multipathIndicator: boolean;
}, {
    satelliteCount: number;
    signalStrength: number;
    atmosphericConditions: string;
    multipathIndicator: boolean;
}>;
export declare const ValidationMetricsSchema: z.ZodObject<{
    isJammed: z.ZodBoolean;
    isSpoofed: z.ZodBoolean;
    confidenceLevel: z.ZodNumber;
    integrityCheck: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    isJammed: boolean;
    isSpoofed: boolean;
    confidenceLevel: number;
    integrityCheck: boolean;
}, {
    isJammed: boolean;
    isSpoofed: boolean;
    confidenceLevel: number;
    integrityCheck: boolean;
}>;
export declare const ResourceContextSchema: z.ZodObject<{
    commodityPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
    commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
    formation: z.ZodOptional<z.ZodString>;
    confidence: z.ZodNumber;
    source: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    commodityPotential: "low" | "medium" | "high" | "none";
    formation?: string | undefined;
    source?: string | undefined;
    commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
}, {
    confidence: number;
    commodityPotential: "low" | "medium" | "high" | "none";
    formation?: string | undefined;
    source?: string | undefined;
    commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
}>;
export declare const SiteReferenceSchema: z.ZodObject<{
    siteId: z.ZodString;
    name: z.ZodString;
    category: z.ZodOptional<z.ZodEnum<["ExtractionSite", "ProcessingFacility", "StorageFacility", "TransitPoint", "TradePremises", "Port", "BorderCrossing"]>>;
    siteType: z.ZodOptional<z.ZodEnum<["mine", "farm", "plantation", "fishery", "forest", "quarry", "mill", "refinery", "smelter", "drying-facility", "washing-plant", "factory", "vault", "warehouse", "silo", "free-zone", "bonded-warehouse", "collection-center", "weighing-station", "checkpoint", "transfer-hub", "buying-center", "trading-office", "retail-shop", "auction-house", "seaport", "airport", "inland-port", "customs-post", "land-border"]>>;
    region: z.ZodString;
    country: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    siteId: string;
    region: string;
    country: string;
    category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
    siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
}, {
    name: string;
    siteId: string;
    region: string;
    country: string;
    category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
    siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
}>;
export declare const AssetLotDataSchema: z.ZodObject<{
    lotId: z.ZodOptional<z.ZodString>;
    commodityType: z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>;
    commoditySubtype: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["PreciousMetals", "Agricultural", "IndustrialMinerals", "Gemstones", "Energy"]>>;
    estimatedWeight: z.ZodNumber;
    unit: z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>;
    quality: z.ZodOptional<z.ZodEnum<["high", "medium", "low", "ungraded"]>>;
    purity: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
    previousState: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
    producerId: z.ZodOptional<z.ZodString>;
    operatorRole: z.ZodOptional<z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>>;
    discoveryDate: z.ZodOptional<z.ZodString>;
    siteId: z.ZodOptional<z.ZodString>;
    site: z.ZodOptional<z.ZodObject<{
        siteId: z.ZodString;
        name: z.ZodString;
        category: z.ZodOptional<z.ZodEnum<["ExtractionSite", "ProcessingFacility", "StorageFacility", "TransitPoint", "TradePremises", "Port", "BorderCrossing"]>>;
        siteType: z.ZodOptional<z.ZodEnum<["mine", "farm", "plantation", "fishery", "forest", "quarry", "mill", "refinery", "smelter", "drying-facility", "washing-plant", "factory", "vault", "warehouse", "silo", "free-zone", "bonded-warehouse", "collection-center", "weighing-station", "checkpoint", "transfer-hub", "buying-center", "trading-office", "retail-shop", "auction-house", "seaport", "airport", "inland-port", "customs-post", "land-border"]>>;
        region: z.ZodString;
        country: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        siteId: string;
        region: string;
        country: string;
        category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
        siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
    }, {
        name: string;
        siteId: string;
        region: string;
        country: string;
        category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
        siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
    }>>;
    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    commodityType: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
    estimatedWeight: number;
    unit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
    category?: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy" | undefined;
    site?: {
        name: string;
        siteId: string;
        region: string;
        country: string;
        category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
        siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
    } | undefined;
    quality?: "low" | "medium" | "high" | "ungraded" | undefined;
    siteId?: string | undefined;
    lotId?: string | undefined;
    commoditySubtype?: string | undefined;
    purity?: number | undefined;
    state?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
    previousState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
    producerId?: string | undefined;
    operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
    discoveryDate?: string | undefined;
    attributes?: Record<string, unknown> | undefined;
}, {
    commodityType: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
    estimatedWeight: number;
    unit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
    category?: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy" | undefined;
    site?: {
        name: string;
        siteId: string;
        region: string;
        country: string;
        category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
        siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
    } | undefined;
    quality?: "low" | "medium" | "high" | "ungraded" | undefined;
    siteId?: string | undefined;
    lotId?: string | undefined;
    commoditySubtype?: string | undefined;
    purity?: number | undefined;
    state?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
    previousState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
    producerId?: string | undefined;
    operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
    discoveryDate?: string | undefined;
    attributes?: Record<string, unknown> | undefined;
}>;
export declare const QRCodeMetadataSchema: z.ZodObject<{
    location: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
    }, {
        latitude: number;
        longitude: number;
    }>>;
    assetWeight: z.ZodOptional<z.ZodNumber>;
    assetUnit: z.ZodOptional<z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>>;
    commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
    assetState: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
    purity: z.ZodOptional<z.ZodNumber>;
    producerId: z.ZodOptional<z.ZodString>;
    operatorRole: z.ZodOptional<z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>>;
}, "strip", z.ZodTypeAny, {
    location?: {
        latitude: number;
        longitude: number;
    } | undefined;
    commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
    purity?: number | undefined;
    producerId?: string | undefined;
    operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
    assetWeight?: number | undefined;
    assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
    assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
}, {
    location?: {
        latitude: number;
        longitude: number;
    } | undefined;
    commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
    purity?: number | undefined;
    producerId?: string | undefined;
    operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
    assetWeight?: number | undefined;
    assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
    assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
}>;
export declare const QRCodeDataSchema: z.ZodObject<{
    certificateId: z.ZodString;
    verifyUrl: z.ZodString;
    hash: z.ZodString;
    timestamp: z.ZodNumber;
    type: z.ZodEnum<["location", "photo", "certificate", "asset-lot"]>;
    metadata: z.ZodOptional<z.ZodObject<{
        location: z.ZodOptional<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
        }, {
            latitude: number;
            longitude: number;
        }>>;
        assetWeight: z.ZodOptional<z.ZodNumber>;
        assetUnit: z.ZodOptional<z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>>;
        commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
        assetState: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
        purity: z.ZodOptional<z.ZodNumber>;
        producerId: z.ZodOptional<z.ZodString>;
        operatorRole: z.ZodOptional<z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>>;
    }, "strip", z.ZodTypeAny, {
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        purity?: number | undefined;
        producerId?: string | undefined;
        operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
        assetWeight?: number | undefined;
        assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
        assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
    }, {
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        purity?: number | undefined;
        producerId?: string | undefined;
        operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
        assetWeight?: number | undefined;
        assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
        assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "location" | "photo" | "certificate" | "asset-lot";
    timestamp: number;
    hash: string;
    certificateId: string;
    verifyUrl: string;
    metadata?: {
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        purity?: number | undefined;
        producerId?: string | undefined;
        operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
        assetWeight?: number | undefined;
        assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
        assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
    } | undefined;
}, {
    type: "location" | "photo" | "certificate" | "asset-lot";
    timestamp: number;
    hash: string;
    certificateId: string;
    verifyUrl: string;
    metadata?: {
        location?: {
            latitude: number;
            longitude: number;
        } | undefined;
        commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        purity?: number | undefined;
        producerId?: string | undefined;
        operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
        assetWeight?: number | undefined;
        assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
        assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
    } | undefined;
}>;
export declare const GeneratedQRCodeSchema: z.ZodObject<{
    id: z.ZodString;
    data: z.ZodObject<{
        certificateId: z.ZodString;
        verifyUrl: z.ZodString;
        hash: z.ZodString;
        timestamp: z.ZodNumber;
        type: z.ZodEnum<["location", "photo", "certificate", "asset-lot"]>;
        metadata: z.ZodOptional<z.ZodObject<{
            location: z.ZodOptional<z.ZodObject<{
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                latitude: number;
                longitude: number;
            }, {
                latitude: number;
                longitude: number;
            }>>;
            assetWeight: z.ZodOptional<z.ZodNumber>;
            assetUnit: z.ZodOptional<z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>>;
            commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
            assetState: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
            purity: z.ZodOptional<z.ZodNumber>;
            producerId: z.ZodOptional<z.ZodString>;
            operatorRole: z.ZodOptional<z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>>;
        }, "strip", z.ZodTypeAny, {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        }, {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "location" | "photo" | "certificate" | "asset-lot";
        timestamp: number;
        hash: string;
        certificateId: string;
        verifyUrl: string;
        metadata?: {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        } | undefined;
    }, {
        type: "location" | "photo" | "certificate" | "asset-lot";
        timestamp: number;
        hash: string;
        certificateId: string;
        verifyUrl: string;
        metadata?: {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        } | undefined;
    }>;
    qrCodeUri: z.ZodString;
    dataString: z.ZodString;
    size: z.ZodNumber;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    data: {
        type: "location" | "photo" | "certificate" | "asset-lot";
        timestamp: number;
        hash: string;
        certificateId: string;
        verifyUrl: string;
        metadata?: {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        } | undefined;
    };
    timestamp: number;
    qrCodeUri: string;
    dataString: string;
    size: number;
}, {
    id: string;
    data: {
        type: "location" | "photo" | "certificate" | "asset-lot";
        timestamp: number;
        hash: string;
        certificateId: string;
        verifyUrl: string;
        metadata?: {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        } | undefined;
    };
    timestamp: number;
    qrCodeUri: string;
    dataString: string;
    size: number;
}>;
export declare const QRCodeVerificationResultSchema: z.ZodObject<{
    isValid: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        certificateId: z.ZodString;
        verifyUrl: z.ZodString;
        hash: z.ZodString;
        timestamp: z.ZodNumber;
        type: z.ZodEnum<["location", "photo", "certificate", "asset-lot"]>;
        metadata: z.ZodOptional<z.ZodObject<{
            location: z.ZodOptional<z.ZodObject<{
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                latitude: number;
                longitude: number;
            }, {
                latitude: number;
                longitude: number;
            }>>;
            assetWeight: z.ZodOptional<z.ZodNumber>;
            assetUnit: z.ZodOptional<z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>>;
            commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
            assetState: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
            purity: z.ZodOptional<z.ZodNumber>;
            producerId: z.ZodOptional<z.ZodString>;
            operatorRole: z.ZodOptional<z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>>;
        }, "strip", z.ZodTypeAny, {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        }, {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "location" | "photo" | "certificate" | "asset-lot";
        timestamp: number;
        hash: string;
        certificateId: string;
        verifyUrl: string;
        metadata?: {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        } | undefined;
    }, {
        type: "location" | "photo" | "certificate" | "asset-lot";
        timestamp: number;
        hash: string;
        certificateId: string;
        verifyUrl: string;
        metadata?: {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        } | undefined;
    }>>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    isValid: boolean;
    error?: string | undefined;
    data?: {
        type: "location" | "photo" | "certificate" | "asset-lot";
        timestamp: number;
        hash: string;
        certificateId: string;
        verifyUrl: string;
        metadata?: {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        } | undefined;
    } | undefined;
}, {
    isValid: boolean;
    error?: string | undefined;
    data?: {
        type: "location" | "photo" | "certificate" | "asset-lot";
        timestamp: number;
        hash: string;
        certificateId: string;
        verifyUrl: string;
        metadata?: {
            location?: {
                latitude: number;
                longitude: number;
            } | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            purity?: number | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            assetWeight?: number | undefined;
            assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
            assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
        } | undefined;
    } | undefined;
}>;
export declare const PredicateURISchema: z.ZodString;
export declare const PredicateSchemaSchema: z.ZodType<any>;
export declare const AttestorPatternSchema: z.ZodObject<{
    type: z.ZodEnum<["exact", "pattern", "credential"]>;
    value: z.ZodString;
    credentialRequired: z.ZodOptional<z.ZodEnum<["TradePass", "ProducerID", "SiteID", "AggregatorID", "ProcessorID", "TraderID", "CustodyID", "LogisticsID", "CertifierID", "BuyerID", "AuthorityID", "FinanceID", "SecurityID"]>>;
}, "strip", z.ZodTypeAny, {
    type: "exact" | "pattern" | "credential";
    value: string;
    credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
}, {
    type: "exact" | "pattern" | "credential";
    value: string;
    credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
}>;
export declare const EvidenceRequirementsSchema: z.ZodObject<{
    required: z.ZodArray<z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>, "many">;
    optional: z.ZodOptional<z.ZodArray<z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>, "many">>;
    alternatives: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>, "many">, "many">>;
}, "strip", z.ZodTypeAny, {
    required: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[];
    optional?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[] | undefined;
    alternatives?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[][] | undefined;
}, {
    required: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[];
    optional?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[] | undefined;
    alternatives?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[][] | undefined;
}>;
export declare const AttestationRulesSchema: z.ZodObject<{
    allowedAttestors: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["exact", "pattern", "credential"]>;
        value: z.ZodString;
        credentialRequired: z.ZodOptional<z.ZodEnum<["TradePass", "ProducerID", "SiteID", "AggregatorID", "ProcessorID", "TraderID", "CustodyID", "LogisticsID", "CertifierID", "BuyerID", "AuthorityID", "FinanceID", "SecurityID"]>>;
    }, "strip", z.ZodTypeAny, {
        type: "exact" | "pattern" | "credential";
        value: string;
        credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
    }, {
        type: "exact" | "pattern" | "credential";
        value: string;
        credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
    }>, "many">;
    selfAttestation: z.ZodBoolean;
    multiSignatureRequired: z.ZodOptional<z.ZodBoolean>;
    minimumAttestors: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    allowedAttestors: {
        type: "exact" | "pattern" | "credential";
        value: string;
        credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
    }[];
    selfAttestation: boolean;
    multiSignatureRequired?: boolean | undefined;
    minimumAttestors?: number | undefined;
}, {
    allowedAttestors: {
        type: "exact" | "pattern" | "credential";
        value: string;
        credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
    }[];
    selfAttestation: boolean;
    multiSignatureRequired?: boolean | undefined;
    minimumAttestors?: number | undefined;
}>;
export declare const ConfidenceRulesSchema: z.ZodObject<{
    baseScore: z.ZodNumber;
    evidenceWeights: z.ZodRecord<z.ZodString, z.ZodNumber>;
    minimumThreshold: z.ZodNumber;
    decayModel: z.ZodOptional<z.ZodEnum<["linear", "exponential", "none"]>>;
    halfLife: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    baseScore: number;
    evidenceWeights: Record<string, number>;
    minimumThreshold: number;
    decayModel?: "none" | "linear" | "exponential" | undefined;
    halfLife?: number | undefined;
}, {
    baseScore: number;
    evidenceWeights: Record<string, number>;
    minimumThreshold: number;
    decayModel?: "none" | "linear" | "exponential" | undefined;
    halfLife?: number | undefined;
}>;
export declare const TemporalRulesSchema: z.ZodObject<{
    validDuration: z.ZodString;
    renewalRequired: z.ZodBoolean;
    monitoringType: z.ZodOptional<z.ZodEnum<["continuous", "periodic", "event_triggered"]>>;
    triggers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    validDuration: string;
    renewalRequired: boolean;
    monitoringType?: "continuous" | "periodic" | "event_triggered" | undefined;
    triggers?: string[] | undefined;
}, {
    validDuration: string;
    renewalRequired: boolean;
    monitoringType?: "continuous" | "periodic" | "event_triggered" | undefined;
    triggers?: string[] | undefined;
}>;
export declare const AIMetadataSchema: z.ZodObject<{
    embeddingModel: z.ZodString;
    reasoningHints: z.ZodArray<z.ZodString, "many">;
    relatedPredicates: z.ZodArray<z.ZodString, "many">;
    contradictoryPredicates: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    contextTemplate: z.ZodString;
}, "strip", z.ZodTypeAny, {
    embeddingModel: string;
    reasoningHints: string[];
    relatedPredicates: string[];
    contextTemplate: string;
    contradictoryPredicates?: string[] | undefined;
}, {
    embeddingModel: string;
    reasoningHints: string[];
    relatedPredicates: string[];
    contextTemplate: string;
    contradictoryPredicates?: string[] | undefined;
}>;
export declare const PredicateDefinitionSchema: z.ZodObject<{
    uri: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    domain: z.ZodEnum<["identity", "compliance", "asset", "location", "relationship", "temporal", "financial", "composite"]>;
    version: z.ZodString;
    schema: z.ZodType<any, z.ZodTypeDef, any>;
    evidence: z.ZodObject<{
        required: z.ZodArray<z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>, "many">;
        optional: z.ZodOptional<z.ZodArray<z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>, "many">>;
        alternatives: z.ZodOptional<z.ZodArray<z.ZodArray<z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>, "many">, "many">>;
    }, "strip", z.ZodTypeAny, {
        required: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[];
        optional?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[] | undefined;
        alternatives?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[][] | undefined;
    }, {
        required: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[];
        optional?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[] | undefined;
        alternatives?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[][] | undefined;
    }>;
    attestation: z.ZodObject<{
        allowedAttestors: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["exact", "pattern", "credential"]>;
            value: z.ZodString;
            credentialRequired: z.ZodOptional<z.ZodEnum<["TradePass", "ProducerID", "SiteID", "AggregatorID", "ProcessorID", "TraderID", "CustodyID", "LogisticsID", "CertifierID", "BuyerID", "AuthorityID", "FinanceID", "SecurityID"]>>;
        }, "strip", z.ZodTypeAny, {
            type: "exact" | "pattern" | "credential";
            value: string;
            credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
        }, {
            type: "exact" | "pattern" | "credential";
            value: string;
            credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
        }>, "many">;
        selfAttestation: z.ZodBoolean;
        multiSignatureRequired: z.ZodOptional<z.ZodBoolean>;
        minimumAttestors: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        allowedAttestors: {
            type: "exact" | "pattern" | "credential";
            value: string;
            credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
        }[];
        selfAttestation: boolean;
        multiSignatureRequired?: boolean | undefined;
        minimumAttestors?: number | undefined;
    }, {
        allowedAttestors: {
            type: "exact" | "pattern" | "credential";
            value: string;
            credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
        }[];
        selfAttestation: boolean;
        multiSignatureRequired?: boolean | undefined;
        minimumAttestors?: number | undefined;
    }>;
    confidence: z.ZodObject<{
        baseScore: z.ZodNumber;
        evidenceWeights: z.ZodRecord<z.ZodString, z.ZodNumber>;
        minimumThreshold: z.ZodNumber;
        decayModel: z.ZodOptional<z.ZodEnum<["linear", "exponential", "none"]>>;
        halfLife: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        baseScore: number;
        evidenceWeights: Record<string, number>;
        minimumThreshold: number;
        decayModel?: "none" | "linear" | "exponential" | undefined;
        halfLife?: number | undefined;
    }, {
        baseScore: number;
        evidenceWeights: Record<string, number>;
        minimumThreshold: number;
        decayModel?: "none" | "linear" | "exponential" | undefined;
        halfLife?: number | undefined;
    }>;
    temporal: z.ZodObject<{
        validDuration: z.ZodString;
        renewalRequired: z.ZodBoolean;
        monitoringType: z.ZodOptional<z.ZodEnum<["continuous", "periodic", "event_triggered"]>>;
        triggers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        validDuration: string;
        renewalRequired: boolean;
        monitoringType?: "continuous" | "periodic" | "event_triggered" | undefined;
        triggers?: string[] | undefined;
    }, {
        validDuration: string;
        renewalRequired: boolean;
        monitoringType?: "continuous" | "periodic" | "event_triggered" | undefined;
        triggers?: string[] | undefined;
    }>;
    ai: z.ZodObject<{
        embeddingModel: z.ZodString;
        reasoningHints: z.ZodArray<z.ZodString, "many">;
        relatedPredicates: z.ZodArray<z.ZodString, "many">;
        contradictoryPredicates: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        contextTemplate: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        embeddingModel: string;
        reasoningHints: string[];
        relatedPredicates: string[];
        contextTemplate: string;
        contradictoryPredicates?: string[] | undefined;
    }, {
        embeddingModel: string;
        reasoningHints: string[];
        relatedPredicates: string[];
        contextTemplate: string;
        contradictoryPredicates?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    domain: "compliance" | "identity" | "location" | "asset" | "relationship" | "temporal" | "financial" | "composite";
    name: string;
    version: string;
    confidence: {
        baseScore: number;
        evidenceWeights: Record<string, number>;
        minimumThreshold: number;
        decayModel?: "none" | "linear" | "exponential" | undefined;
        halfLife?: number | undefined;
    };
    description: string;
    uri: string;
    temporal: {
        validDuration: string;
        renewalRequired: boolean;
        monitoringType?: "continuous" | "periodic" | "event_triggered" | undefined;
        triggers?: string[] | undefined;
    };
    evidence: {
        required: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[];
        optional?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[] | undefined;
        alternatives?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[][] | undefined;
    };
    attestation: {
        allowedAttestors: {
            type: "exact" | "pattern" | "credential";
            value: string;
            credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
        }[];
        selfAttestation: boolean;
        multiSignatureRequired?: boolean | undefined;
        minimumAttestors?: number | undefined;
    };
    ai: {
        embeddingModel: string;
        reasoningHints: string[];
        relatedPredicates: string[];
        contextTemplate: string;
        contradictoryPredicates?: string[] | undefined;
    };
    schema?: any;
}, {
    domain: "compliance" | "identity" | "location" | "asset" | "relationship" | "temporal" | "financial" | "composite";
    name: string;
    version: string;
    confidence: {
        baseScore: number;
        evidenceWeights: Record<string, number>;
        minimumThreshold: number;
        decayModel?: "none" | "linear" | "exponential" | undefined;
        halfLife?: number | undefined;
    };
    description: string;
    uri: string;
    temporal: {
        validDuration: string;
        renewalRequired: boolean;
        monitoringType?: "continuous" | "periodic" | "event_triggered" | undefined;
        triggers?: string[] | undefined;
    };
    evidence: {
        required: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[];
        optional?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[] | undefined;
        alternatives?: ("government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation")[][] | undefined;
    };
    attestation: {
        allowedAttestors: {
            type: "exact" | "pattern" | "credential";
            value: string;
            credentialRequired?: "TradePass" | "ProducerID" | "SiteID" | "AggregatorID" | "ProcessorID" | "TraderID" | "CustodyID" | "LogisticsID" | "CertifierID" | "BuyerID" | "AuthorityID" | "FinanceID" | "SecurityID" | undefined;
        }[];
        selfAttestation: boolean;
        multiSignatureRequired?: boolean | undefined;
        minimumAttestors?: number | undefined;
    };
    ai: {
        embeddingModel: string;
        reasoningHints: string[];
        relatedPredicates: string[];
        contextTemplate: string;
        contradictoryPredicates?: string[] | undefined;
    };
    schema?: any;
}>;
export declare const ClaimProofSchema: z.ZodObject<{
    type: z.ZodEnum<["Ed25519Signature2020", "EcdsaSecp256k1Signature2019"]>;
    created: z.ZodString;
    verificationMethod: z.ZodString;
    proofValue: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
    created: string;
    verificationMethod: string;
    proofValue: string;
}, {
    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
    created: string;
    verificationMethod: string;
    proofValue: string;
}>;
export declare const ClaimEvidenceSchema: z.ZodObject<{
    type: z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>;
    hash: z.ZodString;
    timestamp: z.ZodNumber;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
    timestamp: number;
    hash: string;
    metadata?: Record<string, unknown> | undefined;
}, {
    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
    timestamp: number;
    hash: string;
    metadata?: Record<string, unknown> | undefined;
}>;
export declare const ClaimSchema: z.ZodObject<{
    id: z.ZodString;
    subject: z.ZodString;
    predicate: z.ZodString;
    value: z.ZodUnknown;
    evidence: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>;
        hash: z.ZodString;
        timestamp: z.ZodNumber;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
        timestamp: number;
        hash: string;
        metadata?: Record<string, unknown> | undefined;
    }, {
        type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
        timestamp: number;
        hash: string;
        metadata?: Record<string, unknown> | undefined;
    }>, "many">;
    attestor: z.ZodString;
    confidence: z.ZodNumber;
    issuedAt: z.ZodNumber;
    validUntil: z.ZodOptional<z.ZodNumber>;
    proof: z.ZodObject<{
        type: z.ZodEnum<["Ed25519Signature2020", "EcdsaSecp256k1Signature2019"]>;
        created: z.ZodString;
        verificationMethod: z.ZodString;
        proofValue: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
        created: string;
        verificationMethod: string;
        proofValue: string;
    }, {
        type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
        created: string;
        verificationMethod: string;
        proofValue: string;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    confidence: number;
    evidence: {
        type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
        timestamp: number;
        hash: string;
        metadata?: Record<string, unknown> | undefined;
    }[];
    subject: string;
    predicate: string;
    attestor: string;
    issuedAt: number;
    proof: {
        type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
        created: string;
        verificationMethod: string;
        proofValue: string;
    };
    value?: unknown;
    validUntil?: number | undefined;
}, {
    id: string;
    confidence: number;
    evidence: {
        type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
        timestamp: number;
        hash: string;
        metadata?: Record<string, unknown> | undefined;
    }[];
    subject: string;
    predicate: string;
    attestor: string;
    issuedAt: number;
    proof: {
        type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
        created: string;
        verificationMethod: string;
        proofValue: string;
    };
    value?: unknown;
    validUntil?: number | undefined;
}>;
export declare const CertificateMetadataSchema: z.ZodObject<{
    issuer: z.ZodString;
    issuedAt: z.ZodNumber;
    expiresAt: z.ZodOptional<z.ZodNumber>;
    userRole: z.ZodString;
    deviceId: z.ZodString;
    location: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        altitude: z.ZodOptional<z.ZodNumber>;
        accuracy: z.ZodNumber;
        timestamp: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        timestamp: number;
        accuracy: number;
        latitude: number;
        longitude: number;
        altitude?: number | undefined;
    }, {
        timestamp: number;
        accuracy: number;
        latitude: number;
        longitude: number;
        altitude?: number | undefined;
    }>;
    resourceContext: z.ZodOptional<z.ZodObject<{
        commodityPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
        commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
        formation: z.ZodOptional<z.ZodString>;
        confidence: z.ZodNumber;
        source: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        confidence: number;
        commodityPotential: "low" | "medium" | "high" | "none";
        formation?: string | undefined;
        source?: string | undefined;
        commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
    }, {
        confidence: number;
        commodityPotential: "low" | "medium" | "high" | "none";
        formation?: string | undefined;
        source?: string | undefined;
        commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
    }>>;
    geologicalContext: z.ZodOptional<z.ZodObject<{
        goldPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
        formation: z.ZodOptional<z.ZodString>;
        confidence: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        goldPotential: "low" | "medium" | "high" | "none";
        confidence: number;
        formation?: string | undefined;
    }, {
        goldPotential: "low" | "medium" | "high" | "none";
        confidence: number;
        formation?: string | undefined;
    }>>;
    environmentalFactors: z.ZodOptional<z.ZodObject<{
        satelliteCount: z.ZodNumber;
        signalStrength: z.ZodNumber;
        atmosphericConditions: z.ZodString;
        multipathIndicator: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        satelliteCount: number;
        signalStrength: number;
        atmosphericConditions: string;
        multipathIndicator: boolean;
    }, {
        satelliteCount: number;
        signalStrength: number;
        atmosphericConditions: string;
        multipathIndicator: boolean;
    }>>;
    validationMetrics: z.ZodOptional<z.ZodObject<{
        isJammed: z.ZodBoolean;
        isSpoofed: z.ZodBoolean;
        confidenceLevel: z.ZodNumber;
        integrityCheck: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        isJammed: boolean;
        isSpoofed: boolean;
        confidenceLevel: number;
        integrityCheck: boolean;
    }, {
        isJammed: boolean;
        isSpoofed: boolean;
        confidenceLevel: number;
        integrityCheck: boolean;
    }>>;
}, "strip", z.ZodTypeAny, {
    location: {
        timestamp: number;
        accuracy: number;
        latitude: number;
        longitude: number;
        altitude?: number | undefined;
    };
    deviceId: string;
    userRole: string;
    issuedAt: number;
    issuer: string;
    geologicalContext?: {
        goldPotential: "low" | "medium" | "high" | "none";
        confidence: number;
        formation?: string | undefined;
    } | undefined;
    resourceContext?: {
        confidence: number;
        commodityPotential: "low" | "medium" | "high" | "none";
        formation?: string | undefined;
        source?: string | undefined;
        commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
    } | undefined;
    expiresAt?: number | undefined;
    environmentalFactors?: {
        satelliteCount: number;
        signalStrength: number;
        atmosphericConditions: string;
        multipathIndicator: boolean;
    } | undefined;
    validationMetrics?: {
        isJammed: boolean;
        isSpoofed: boolean;
        confidenceLevel: number;
        integrityCheck: boolean;
    } | undefined;
}, {
    location: {
        timestamp: number;
        accuracy: number;
        latitude: number;
        longitude: number;
        altitude?: number | undefined;
    };
    deviceId: string;
    userRole: string;
    issuedAt: number;
    issuer: string;
    geologicalContext?: {
        goldPotential: "low" | "medium" | "high" | "none";
        confidence: number;
        formation?: string | undefined;
    } | undefined;
    resourceContext?: {
        confidence: number;
        commodityPotential: "low" | "medium" | "high" | "none";
        formation?: string | undefined;
        source?: string | undefined;
        commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
    } | undefined;
    expiresAt?: number | undefined;
    environmentalFactors?: {
        satelliteCount: number;
        signalStrength: number;
        atmosphericConditions: string;
        multipathIndicator: boolean;
    } | undefined;
    validationMetrics?: {
        isJammed: boolean;
        isSpoofed: boolean;
        confidenceLevel: number;
        integrityCheck: boolean;
    } | undefined;
}>;
export declare const MultiSignatureSchema: z.ZodObject<{
    ed25519: z.ZodString;
    secp256k1: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    ed25519: string;
    secp256k1?: string | undefined;
}, {
    ed25519: string;
    secp256k1?: string | undefined;
}>;
export declare const CertificateVerificationDataSchema: z.ZodObject<{
    publicKey: z.ZodString;
    signature: z.ZodString;
    timestamp: z.ZodNumber;
    entropyQuality: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    signature: string;
    publicKey: string;
    timestamp: number;
    entropyQuality?: number | undefined;
}, {
    signature: string;
    publicKey: string;
    timestamp: number;
    entropyQuality?: number | undefined;
}>;
export declare const BaseCertificateSchema: z.ZodObject<{
    certificateId: z.ZodString;
    version: z.ZodString;
    type: z.ZodEnum<["asset-origin", "location", "photo", "work-site", "compliance", "government-inspection", "custody-transfer", "settlement", "quality-assay", "chain-of-custody"]>;
    securityLevel: z.ZodEnum<["standard", "enhanced", "military", "quantum-resistant"]>;
    metadata: z.ZodObject<{
        issuer: z.ZodString;
        issuedAt: z.ZodNumber;
        expiresAt: z.ZodOptional<z.ZodNumber>;
        userRole: z.ZodString;
        deviceId: z.ZodString;
        location: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            altitude: z.ZodOptional<z.ZodNumber>;
            accuracy: z.ZodNumber;
            timestamp: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        }, {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        }>;
        resourceContext: z.ZodOptional<z.ZodObject<{
            commodityPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
            commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
            formation: z.ZodOptional<z.ZodString>;
            confidence: z.ZodNumber;
            source: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        }, {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        }>>;
        geologicalContext: z.ZodOptional<z.ZodObject<{
            goldPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
            formation: z.ZodOptional<z.ZodString>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        }, {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        }>>;
        environmentalFactors: z.ZodOptional<z.ZodObject<{
            satelliteCount: z.ZodNumber;
            signalStrength: z.ZodNumber;
            atmosphericConditions: z.ZodString;
            multipathIndicator: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        }, {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        }>>;
        validationMetrics: z.ZodOptional<z.ZodObject<{
            isJammed: z.ZodBoolean;
            isSpoofed: z.ZodBoolean;
            confidenceLevel: z.ZodNumber;
            integrityCheck: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        }, {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        }>>;
    }, "strip", z.ZodTypeAny, {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    }, {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    }>;
    verificationData: z.ZodObject<{
        publicKey: z.ZodString;
        signature: z.ZodString;
        timestamp: z.ZodNumber;
        entropyQuality: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    }, {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    }>;
    createdAt: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    metadata: {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    };
    createdAt: number;
    type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
    version: string;
    securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
    certificateId: string;
    verificationData: {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    };
}, {
    metadata: {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    };
    createdAt: number;
    type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
    version: string;
    securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
    certificateId: string;
    verificationData: {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    };
}>;
export declare const PhotoEvidenceRefSchema: z.ZodObject<{
    id: z.ZodString;
    hash: z.ZodString;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    timestamp: number;
    hash: string;
}, {
    id: string;
    timestamp: number;
    hash: string;
}>;
export declare const ComplianceDataSchema: z.ZodObject<{
    permitNumber: z.ZodOptional<z.ZodString>;
    inspectorId: z.ZodOptional<z.ZodString>;
    complianceLevel: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    gciScore: z.ZodOptional<z.ZodNumber>;
    claims: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        subject: z.ZodString;
        predicate: z.ZodString;
        value: z.ZodUnknown;
        evidence: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>;
            hash: z.ZodString;
            timestamp: z.ZodNumber;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }, {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }>, "many">;
        attestor: z.ZodString;
        confidence: z.ZodNumber;
        issuedAt: z.ZodNumber;
        validUntil: z.ZodOptional<z.ZodNumber>;
        proof: z.ZodObject<{
            type: z.ZodEnum<["Ed25519Signature2020", "EcdsaSecp256k1Signature2019"]>;
            created: z.ZodString;
            verificationMethod: z.ZodString;
            proofValue: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        }, {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        confidence: number;
        evidence: {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }[];
        subject: string;
        predicate: string;
        attestor: string;
        issuedAt: number;
        proof: {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        };
        value?: unknown;
        validUntil?: number | undefined;
    }, {
        id: string;
        confidence: number;
        evidence: {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }[];
        subject: string;
        predicate: string;
        attestor: string;
        issuedAt: number;
        proof: {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        };
        value?: unknown;
        validUntil?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    permitNumber?: string | undefined;
    inspectorId?: string | undefined;
    complianceLevel?: string | undefined;
    notes?: string | undefined;
    gciScore?: number | undefined;
    claims?: {
        id: string;
        confidence: number;
        evidence: {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }[];
        subject: string;
        predicate: string;
        attestor: string;
        issuedAt: number;
        proof: {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        };
        value?: unknown;
        validUntil?: number | undefined;
    }[] | undefined;
}, {
    permitNumber?: string | undefined;
    inspectorId?: string | undefined;
    complianceLevel?: string | undefined;
    notes?: string | undefined;
    gciScore?: number | undefined;
    claims?: {
        id: string;
        confidence: number;
        evidence: {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }[];
        subject: string;
        predicate: string;
        attestor: string;
        issuedAt: number;
        proof: {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        };
        value?: unknown;
        validUntil?: number | undefined;
    }[] | undefined;
}>;
export declare const StandardCertificateSchema: z.ZodObject<{
    certificateId: z.ZodString;
    version: z.ZodString;
    type: z.ZodEnum<["asset-origin", "location", "photo", "work-site", "compliance", "government-inspection", "custody-transfer", "settlement", "quality-assay", "chain-of-custody"]>;
    metadata: z.ZodObject<{
        issuer: z.ZodString;
        issuedAt: z.ZodNumber;
        expiresAt: z.ZodOptional<z.ZodNumber>;
        userRole: z.ZodString;
        deviceId: z.ZodString;
        location: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            altitude: z.ZodOptional<z.ZodNumber>;
            accuracy: z.ZodNumber;
            timestamp: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        }, {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        }>;
        resourceContext: z.ZodOptional<z.ZodObject<{
            commodityPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
            commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
            formation: z.ZodOptional<z.ZodString>;
            confidence: z.ZodNumber;
            source: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        }, {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        }>>;
        geologicalContext: z.ZodOptional<z.ZodObject<{
            goldPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
            formation: z.ZodOptional<z.ZodString>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        }, {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        }>>;
        environmentalFactors: z.ZodOptional<z.ZodObject<{
            satelliteCount: z.ZodNumber;
            signalStrength: z.ZodNumber;
            atmosphericConditions: z.ZodString;
            multipathIndicator: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        }, {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        }>>;
        validationMetrics: z.ZodOptional<z.ZodObject<{
            isJammed: z.ZodBoolean;
            isSpoofed: z.ZodBoolean;
            confidenceLevel: z.ZodNumber;
            integrityCheck: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        }, {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        }>>;
    }, "strip", z.ZodTypeAny, {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    }, {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    }>;
    verificationData: z.ZodObject<{
        publicKey: z.ZodString;
        signature: z.ZodString;
        timestamp: z.ZodNumber;
        entropyQuality: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    }, {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    }>;
    createdAt: z.ZodNumber;
} & {
    securityLevel: z.ZodEnum<["standard", "enhanced"]>;
    dataHash: z.ZodString;
    signature: z.ZodString;
}, "strip", z.ZodTypeAny, {
    metadata: {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    };
    createdAt: number;
    type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
    version: string;
    dataHash: string;
    signature: string;
    securityLevel: "standard" | "enhanced";
    certificateId: string;
    verificationData: {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    };
}, {
    metadata: {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    };
    createdAt: number;
    type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
    version: string;
    dataHash: string;
    signature: string;
    securityLevel: "standard" | "enhanced";
    certificateId: string;
    verificationData: {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    };
}>;
export declare const MilitaryGradeCertificateSchema: z.ZodObject<{
    certificateId: z.ZodString;
    version: z.ZodString;
    type: z.ZodEnum<["asset-origin", "location", "photo", "work-site", "compliance", "government-inspection", "custody-transfer", "settlement", "quality-assay", "chain-of-custody"]>;
    metadata: z.ZodObject<{
        issuer: z.ZodString;
        issuedAt: z.ZodNumber;
        expiresAt: z.ZodOptional<z.ZodNumber>;
        userRole: z.ZodString;
        deviceId: z.ZodString;
        location: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            altitude: z.ZodOptional<z.ZodNumber>;
            accuracy: z.ZodNumber;
            timestamp: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        }, {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        }>;
        resourceContext: z.ZodOptional<z.ZodObject<{
            commodityPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
            commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
            formation: z.ZodOptional<z.ZodString>;
            confidence: z.ZodNumber;
            source: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        }, {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        }>>;
        geologicalContext: z.ZodOptional<z.ZodObject<{
            goldPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
            formation: z.ZodOptional<z.ZodString>;
            confidence: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        }, {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        }>>;
        environmentalFactors: z.ZodOptional<z.ZodObject<{
            satelliteCount: z.ZodNumber;
            signalStrength: z.ZodNumber;
            atmosphericConditions: z.ZodString;
            multipathIndicator: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        }, {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        }>>;
        validationMetrics: z.ZodOptional<z.ZodObject<{
            isJammed: z.ZodBoolean;
            isSpoofed: z.ZodBoolean;
            confidenceLevel: z.ZodNumber;
            integrityCheck: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        }, {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        }>>;
    }, "strip", z.ZodTypeAny, {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    }, {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    }>;
    verificationData: z.ZodObject<{
        publicKey: z.ZodString;
        signature: z.ZodString;
        timestamp: z.ZodNumber;
        entropyQuality: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    }, {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    }>;
    createdAt: z.ZodNumber;
} & {
    securityLevel: z.ZodEnum<["military", "quantum-resistant"]>;
    quantumResistantHash: z.ZodString;
    multiSignature: z.ZodObject<{
        ed25519: z.ZodString;
        secp256k1: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        ed25519: string;
        secp256k1?: string | undefined;
    }, {
        ed25519: string;
        secp256k1?: string | undefined;
    }>;
    certificateData: z.ZodObject<{
        assetLotData: z.ZodOptional<z.ZodObject<{
            lotId: z.ZodOptional<z.ZodString>;
            commodityType: z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>;
            commoditySubtype: z.ZodOptional<z.ZodString>;
            category: z.ZodOptional<z.ZodEnum<["PreciousMetals", "Agricultural", "IndustrialMinerals", "Gemstones", "Energy"]>>;
            estimatedWeight: z.ZodNumber;
            unit: z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>;
            quality: z.ZodOptional<z.ZodEnum<["high", "medium", "low", "ungraded"]>>;
            purity: z.ZodOptional<z.ZodNumber>;
            state: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
            previousState: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
            producerId: z.ZodOptional<z.ZodString>;
            operatorRole: z.ZodOptional<z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>>;
            discoveryDate: z.ZodOptional<z.ZodString>;
            siteId: z.ZodOptional<z.ZodString>;
            site: z.ZodOptional<z.ZodObject<{
                siteId: z.ZodString;
                name: z.ZodString;
                category: z.ZodOptional<z.ZodEnum<["ExtractionSite", "ProcessingFacility", "StorageFacility", "TransitPoint", "TradePremises", "Port", "BorderCrossing"]>>;
                siteType: z.ZodOptional<z.ZodEnum<["mine", "farm", "plantation", "fishery", "forest", "quarry", "mill", "refinery", "smelter", "drying-facility", "washing-plant", "factory", "vault", "warehouse", "silo", "free-zone", "bonded-warehouse", "collection-center", "weighing-station", "checkpoint", "transfer-hub", "buying-center", "trading-office", "retail-shop", "auction-house", "seaport", "airport", "inland-port", "customs-post", "land-border"]>>;
                region: z.ZodString;
                country: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                name: string;
                siteId: string;
                region: string;
                country: string;
                category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
                siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
            }, {
                name: string;
                siteId: string;
                region: string;
                country: string;
                category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
                siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
            }>>;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            commodityType: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
            estimatedWeight: number;
            unit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
            category?: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy" | undefined;
            site?: {
                name: string;
                siteId: string;
                region: string;
                country: string;
                category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
                siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
            } | undefined;
            quality?: "low" | "medium" | "high" | "ungraded" | undefined;
            siteId?: string | undefined;
            lotId?: string | undefined;
            commoditySubtype?: string | undefined;
            purity?: number | undefined;
            state?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            previousState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            discoveryDate?: string | undefined;
            attributes?: Record<string, unknown> | undefined;
        }, {
            commodityType: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
            estimatedWeight: number;
            unit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
            category?: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy" | undefined;
            site?: {
                name: string;
                siteId: string;
                region: string;
                country: string;
                category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
                siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
            } | undefined;
            quality?: "low" | "medium" | "high" | "ungraded" | undefined;
            siteId?: string | undefined;
            lotId?: string | undefined;
            commoditySubtype?: string | undefined;
            purity?: number | undefined;
            state?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            previousState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            discoveryDate?: string | undefined;
            attributes?: Record<string, unknown> | undefined;
        }>>;
        goldLotData: z.ZodOptional<z.ZodObject<{
            estimatedWeight: z.ZodNumber;
            quality: z.ZodOptional<z.ZodEnum<["high", "medium", "low"]>>;
            purity: z.ZodOptional<z.ZodNumber>;
            miner: z.ZodOptional<z.ZodString>;
            discoveryDate: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            estimatedWeight: number;
            quality?: "low" | "medium" | "high" | undefined;
            purity?: number | undefined;
            discoveryDate?: string | undefined;
            miner?: string | undefined;
        }, {
            estimatedWeight: number;
            quality?: "low" | "medium" | "high" | undefined;
            purity?: number | undefined;
            discoveryDate?: string | undefined;
            miner?: string | undefined;
        }>>;
        photoEvidence: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            hash: z.ZodString;
            timestamp: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            timestamp: number;
            hash: string;
        }, {
            id: string;
            timestamp: number;
            hash: string;
        }>, "many">>;
        workflowContext: z.ZodOptional<z.ZodString>;
        complianceData: z.ZodOptional<z.ZodObject<{
            permitNumber: z.ZodOptional<z.ZodString>;
            inspectorId: z.ZodOptional<z.ZodString>;
            complianceLevel: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodString>;
            gciScore: z.ZodOptional<z.ZodNumber>;
            claims: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                subject: z.ZodString;
                predicate: z.ZodString;
                value: z.ZodUnknown;
                evidence: z.ZodArray<z.ZodObject<{
                    type: z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>;
                    hash: z.ZodString;
                    timestamp: z.ZodNumber;
                    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
                }, "strip", z.ZodTypeAny, {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }, {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }>, "many">;
                attestor: z.ZodString;
                confidence: z.ZodNumber;
                issuedAt: z.ZodNumber;
                validUntil: z.ZodOptional<z.ZodNumber>;
                proof: z.ZodObject<{
                    type: z.ZodEnum<["Ed25519Signature2020", "EcdsaSecp256k1Signature2019"]>;
                    created: z.ZodString;
                    verificationMethod: z.ZodString;
                    proofValue: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                }, {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                id: string;
                confidence: number;
                evidence: {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }[];
                subject: string;
                predicate: string;
                attestor: string;
                issuedAt: number;
                proof: {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                };
                value?: unknown;
                validUntil?: number | undefined;
            }, {
                id: string;
                confidence: number;
                evidence: {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }[];
                subject: string;
                predicate: string;
                attestor: string;
                issuedAt: number;
                proof: {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                };
                value?: unknown;
                validUntil?: number | undefined;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            permitNumber?: string | undefined;
            inspectorId?: string | undefined;
            complianceLevel?: string | undefined;
            notes?: string | undefined;
            gciScore?: number | undefined;
            claims?: {
                id: string;
                confidence: number;
                evidence: {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }[];
                subject: string;
                predicate: string;
                attestor: string;
                issuedAt: number;
                proof: {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                };
                value?: unknown;
                validUntil?: number | undefined;
            }[] | undefined;
        }, {
            permitNumber?: string | undefined;
            inspectorId?: string | undefined;
            complianceLevel?: string | undefined;
            notes?: string | undefined;
            gciScore?: number | undefined;
            claims?: {
                id: string;
                confidence: number;
                evidence: {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }[];
                subject: string;
                predicate: string;
                attestor: string;
                issuedAt: number;
                proof: {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                };
                value?: unknown;
                validUntil?: number | undefined;
            }[] | undefined;
        }>>;
        claims: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            subject: z.ZodString;
            predicate: z.ZodString;
            value: z.ZodUnknown;
            evidence: z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>;
                hash: z.ZodString;
                timestamp: z.ZodNumber;
                metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            }, "strip", z.ZodTypeAny, {
                type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                timestamp: number;
                hash: string;
                metadata?: Record<string, unknown> | undefined;
            }, {
                type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                timestamp: number;
                hash: string;
                metadata?: Record<string, unknown> | undefined;
            }>, "many">;
            attestor: z.ZodString;
            confidence: z.ZodNumber;
            issuedAt: z.ZodNumber;
            validUntil: z.ZodOptional<z.ZodNumber>;
            proof: z.ZodObject<{
                type: z.ZodEnum<["Ed25519Signature2020", "EcdsaSecp256k1Signature2019"]>;
                created: z.ZodString;
                verificationMethod: z.ZodString;
                proofValue: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                created: string;
                verificationMethod: string;
                proofValue: string;
            }, {
                type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                created: string;
                verificationMethod: string;
                proofValue: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            confidence: number;
            evidence: {
                type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                timestamp: number;
                hash: string;
                metadata?: Record<string, unknown> | undefined;
            }[];
            subject: string;
            predicate: string;
            attestor: string;
            issuedAt: number;
            proof: {
                type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                created: string;
                verificationMethod: string;
                proofValue: string;
            };
            value?: unknown;
            validUntil?: number | undefined;
        }, {
            id: string;
            confidence: number;
            evidence: {
                type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                timestamp: number;
                hash: string;
                metadata?: Record<string, unknown> | undefined;
            }[];
            subject: string;
            predicate: string;
            attestor: string;
            issuedAt: number;
            proof: {
                type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                created: string;
                verificationMethod: string;
                proofValue: string;
            };
            value?: unknown;
            validUntil?: number | undefined;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        workflowContext?: string | undefined;
        claims?: {
            id: string;
            confidence: number;
            evidence: {
                type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                timestamp: number;
                hash: string;
                metadata?: Record<string, unknown> | undefined;
            }[];
            subject: string;
            predicate: string;
            attestor: string;
            issuedAt: number;
            proof: {
                type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                created: string;
                verificationMethod: string;
                proofValue: string;
            };
            value?: unknown;
            validUntil?: number | undefined;
        }[] | undefined;
        assetLotData?: {
            commodityType: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
            estimatedWeight: number;
            unit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
            category?: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy" | undefined;
            site?: {
                name: string;
                siteId: string;
                region: string;
                country: string;
                category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
                siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
            } | undefined;
            quality?: "low" | "medium" | "high" | "ungraded" | undefined;
            siteId?: string | undefined;
            lotId?: string | undefined;
            commoditySubtype?: string | undefined;
            purity?: number | undefined;
            state?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            previousState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            discoveryDate?: string | undefined;
            attributes?: Record<string, unknown> | undefined;
        } | undefined;
        goldLotData?: {
            estimatedWeight: number;
            quality?: "low" | "medium" | "high" | undefined;
            purity?: number | undefined;
            discoveryDate?: string | undefined;
            miner?: string | undefined;
        } | undefined;
        photoEvidence?: {
            id: string;
            timestamp: number;
            hash: string;
        }[] | undefined;
        complianceData?: {
            permitNumber?: string | undefined;
            inspectorId?: string | undefined;
            complianceLevel?: string | undefined;
            notes?: string | undefined;
            gciScore?: number | undefined;
            claims?: {
                id: string;
                confidence: number;
                evidence: {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }[];
                subject: string;
                predicate: string;
                attestor: string;
                issuedAt: number;
                proof: {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                };
                value?: unknown;
                validUntil?: number | undefined;
            }[] | undefined;
        } | undefined;
    }, {
        workflowContext?: string | undefined;
        claims?: {
            id: string;
            confidence: number;
            evidence: {
                type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                timestamp: number;
                hash: string;
                metadata?: Record<string, unknown> | undefined;
            }[];
            subject: string;
            predicate: string;
            attestor: string;
            issuedAt: number;
            proof: {
                type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                created: string;
                verificationMethod: string;
                proofValue: string;
            };
            value?: unknown;
            validUntil?: number | undefined;
        }[] | undefined;
        assetLotData?: {
            commodityType: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
            estimatedWeight: number;
            unit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
            category?: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy" | undefined;
            site?: {
                name: string;
                siteId: string;
                region: string;
                country: string;
                category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
                siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
            } | undefined;
            quality?: "low" | "medium" | "high" | "ungraded" | undefined;
            siteId?: string | undefined;
            lotId?: string | undefined;
            commoditySubtype?: string | undefined;
            purity?: number | undefined;
            state?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            previousState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            discoveryDate?: string | undefined;
            attributes?: Record<string, unknown> | undefined;
        } | undefined;
        goldLotData?: {
            estimatedWeight: number;
            quality?: "low" | "medium" | "high" | undefined;
            purity?: number | undefined;
            discoveryDate?: string | undefined;
            miner?: string | undefined;
        } | undefined;
        photoEvidence?: {
            id: string;
            timestamp: number;
            hash: string;
        }[] | undefined;
        complianceData?: {
            permitNumber?: string | undefined;
            inspectorId?: string | undefined;
            complianceLevel?: string | undefined;
            notes?: string | undefined;
            gciScore?: number | undefined;
            claims?: {
                id: string;
                confidence: number;
                evidence: {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }[];
                subject: string;
                predicate: string;
                attestor: string;
                issuedAt: number;
                proof: {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                };
                value?: unknown;
                validUntil?: number | undefined;
            }[] | undefined;
        } | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    metadata: {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    };
    createdAt: number;
    type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
    version: string;
    multiSignature: {
        ed25519: string;
        secp256k1?: string | undefined;
    };
    securityLevel: "military" | "quantum-resistant";
    certificateId: string;
    verificationData: {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    };
    quantumResistantHash: string;
    certificateData: {
        workflowContext?: string | undefined;
        claims?: {
            id: string;
            confidence: number;
            evidence: {
                type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                timestamp: number;
                hash: string;
                metadata?: Record<string, unknown> | undefined;
            }[];
            subject: string;
            predicate: string;
            attestor: string;
            issuedAt: number;
            proof: {
                type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                created: string;
                verificationMethod: string;
                proofValue: string;
            };
            value?: unknown;
            validUntil?: number | undefined;
        }[] | undefined;
        assetLotData?: {
            commodityType: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
            estimatedWeight: number;
            unit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
            category?: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy" | undefined;
            site?: {
                name: string;
                siteId: string;
                region: string;
                country: string;
                category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
                siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
            } | undefined;
            quality?: "low" | "medium" | "high" | "ungraded" | undefined;
            siteId?: string | undefined;
            lotId?: string | undefined;
            commoditySubtype?: string | undefined;
            purity?: number | undefined;
            state?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            previousState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            discoveryDate?: string | undefined;
            attributes?: Record<string, unknown> | undefined;
        } | undefined;
        goldLotData?: {
            estimatedWeight: number;
            quality?: "low" | "medium" | "high" | undefined;
            purity?: number | undefined;
            discoveryDate?: string | undefined;
            miner?: string | undefined;
        } | undefined;
        photoEvidence?: {
            id: string;
            timestamp: number;
            hash: string;
        }[] | undefined;
        complianceData?: {
            permitNumber?: string | undefined;
            inspectorId?: string | undefined;
            complianceLevel?: string | undefined;
            notes?: string | undefined;
            gciScore?: number | undefined;
            claims?: {
                id: string;
                confidence: number;
                evidence: {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }[];
                subject: string;
                predicate: string;
                attestor: string;
                issuedAt: number;
                proof: {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                };
                value?: unknown;
                validUntil?: number | undefined;
            }[] | undefined;
        } | undefined;
    };
}, {
    metadata: {
        location: {
            timestamp: number;
            accuracy: number;
            latitude: number;
            longitude: number;
            altitude?: number | undefined;
        };
        deviceId: string;
        userRole: string;
        issuedAt: number;
        issuer: string;
        geologicalContext?: {
            goldPotential: "low" | "medium" | "high" | "none";
            confidence: number;
            formation?: string | undefined;
        } | undefined;
        resourceContext?: {
            confidence: number;
            commodityPotential: "low" | "medium" | "high" | "none";
            formation?: string | undefined;
            source?: string | undefined;
            commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
        } | undefined;
        expiresAt?: number | undefined;
        environmentalFactors?: {
            satelliteCount: number;
            signalStrength: number;
            atmosphericConditions: string;
            multipathIndicator: boolean;
        } | undefined;
        validationMetrics?: {
            isJammed: boolean;
            isSpoofed: boolean;
            confidenceLevel: number;
            integrityCheck: boolean;
        } | undefined;
    };
    createdAt: number;
    type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
    version: string;
    multiSignature: {
        ed25519: string;
        secp256k1?: string | undefined;
    };
    securityLevel: "military" | "quantum-resistant";
    certificateId: string;
    verificationData: {
        signature: string;
        publicKey: string;
        timestamp: number;
        entropyQuality?: number | undefined;
    };
    quantumResistantHash: string;
    certificateData: {
        workflowContext?: string | undefined;
        claims?: {
            id: string;
            confidence: number;
            evidence: {
                type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                timestamp: number;
                hash: string;
                metadata?: Record<string, unknown> | undefined;
            }[];
            subject: string;
            predicate: string;
            attestor: string;
            issuedAt: number;
            proof: {
                type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                created: string;
                verificationMethod: string;
                proofValue: string;
            };
            value?: unknown;
            validUntil?: number | undefined;
        }[] | undefined;
        assetLotData?: {
            commodityType: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
            estimatedWeight: number;
            unit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
            category?: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy" | undefined;
            site?: {
                name: string;
                siteId: string;
                region: string;
                country: string;
                category?: "ExtractionSite" | "ProcessingFacility" | "StorageFacility" | "TransitPoint" | "TradePremises" | "Port" | "BorderCrossing" | undefined;
                siteType?: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border" | undefined;
            } | undefined;
            quality?: "low" | "medium" | "high" | "ungraded" | undefined;
            siteId?: string | undefined;
            lotId?: string | undefined;
            commoditySubtype?: string | undefined;
            purity?: number | undefined;
            state?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            previousState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            producerId?: string | undefined;
            operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
            discoveryDate?: string | undefined;
            attributes?: Record<string, unknown> | undefined;
        } | undefined;
        goldLotData?: {
            estimatedWeight: number;
            quality?: "low" | "medium" | "high" | undefined;
            purity?: number | undefined;
            discoveryDate?: string | undefined;
            miner?: string | undefined;
        } | undefined;
        photoEvidence?: {
            id: string;
            timestamp: number;
            hash: string;
        }[] | undefined;
        complianceData?: {
            permitNumber?: string | undefined;
            inspectorId?: string | undefined;
            complianceLevel?: string | undefined;
            notes?: string | undefined;
            gciScore?: number | undefined;
            claims?: {
                id: string;
                confidence: number;
                evidence: {
                    type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
                    timestamp: number;
                    hash: string;
                    metadata?: Record<string, unknown> | undefined;
                }[];
                subject: string;
                predicate: string;
                attestor: string;
                issuedAt: number;
                proof: {
                    type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
                    created: string;
                    verificationMethod: string;
                    proofValue: string;
                };
                value?: unknown;
                validUntil?: number | undefined;
            }[] | undefined;
        } | undefined;
    };
}>;
export declare const CertificateVerificationResultSchema: z.ZodObject<{
    isValid: z.ZodBoolean;
    certificate: z.ZodOptional<z.ZodObject<{
        certificateId: z.ZodString;
        version: z.ZodString;
        type: z.ZodEnum<["asset-origin", "location", "photo", "work-site", "compliance", "government-inspection", "custody-transfer", "settlement", "quality-assay", "chain-of-custody"]>;
        securityLevel: z.ZodEnum<["standard", "enhanced", "military", "quantum-resistant"]>;
        metadata: z.ZodObject<{
            issuer: z.ZodString;
            issuedAt: z.ZodNumber;
            expiresAt: z.ZodOptional<z.ZodNumber>;
            userRole: z.ZodString;
            deviceId: z.ZodString;
            location: z.ZodObject<{
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
                altitude: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodNumber;
                timestamp: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            }, {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            }>;
            resourceContext: z.ZodOptional<z.ZodObject<{
                commodityPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
                commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
                formation: z.ZodOptional<z.ZodString>;
                confidence: z.ZodNumber;
                source: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            }, {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            }>>;
            geologicalContext: z.ZodOptional<z.ZodObject<{
                goldPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
                formation: z.ZodOptional<z.ZodString>;
                confidence: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            }, {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            }>>;
            environmentalFactors: z.ZodOptional<z.ZodObject<{
                satelliteCount: z.ZodNumber;
                signalStrength: z.ZodNumber;
                atmosphericConditions: z.ZodString;
                multipathIndicator: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            }, {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            }>>;
            validationMetrics: z.ZodOptional<z.ZodObject<{
                isJammed: z.ZodBoolean;
                isSpoofed: z.ZodBoolean;
                confidenceLevel: z.ZodNumber;
                integrityCheck: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            }, {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            }>>;
        }, "strip", z.ZodTypeAny, {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        }, {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        }>;
        verificationData: z.ZodObject<{
            publicKey: z.ZodString;
            signature: z.ZodString;
            timestamp: z.ZodNumber;
            entropyQuality: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        }, {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        }>;
        createdAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        metadata: {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        };
        createdAt: number;
        type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
        version: string;
        securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
        certificateId: string;
        verificationData: {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        };
    }, {
        metadata: {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        };
        createdAt: number;
        type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
        version: string;
        securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
        certificateId: string;
        verificationData: {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        };
    }>>;
    confidence: z.ZodNumber;
    details: z.ZodString;
    checks: z.ZodObject<{
        hashValid: z.ZodBoolean;
        signatureValid: z.ZodBoolean;
        timestampValid: z.ZodBoolean;
        notExpired: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        hashValid: boolean;
        signatureValid: boolean;
        timestampValid: boolean;
        notExpired: boolean;
    }, {
        hashValid: boolean;
        signatureValid: boolean;
        timestampValid: boolean;
        notExpired: boolean;
    }>;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    isValid: boolean;
    details: string;
    checks: {
        hashValid: boolean;
        signatureValid: boolean;
        timestampValid: boolean;
        notExpired: boolean;
    };
    certificate?: {
        metadata: {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        };
        createdAt: number;
        type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
        version: string;
        securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
        certificateId: string;
        verificationData: {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        };
    } | undefined;
}, {
    confidence: number;
    isValid: boolean;
    details: string;
    checks: {
        hashValid: boolean;
        signatureValid: boolean;
        timestampValid: boolean;
        notExpired: boolean;
    };
    certificate?: {
        metadata: {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        };
        createdAt: number;
        type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
        version: string;
        securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
        certificateId: string;
        verificationData: {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        };
    } | undefined;
}>;
export declare const ValidationRuleSchema: z.ZodObject<{
    field: z.ZodString;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    value: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    field: string;
    value?: string | number | boolean | undefined;
    min?: number | undefined;
    max?: number | undefined;
}, {
    message: string;
    field: string;
    value?: string | number | boolean | undefined;
    min?: number | undefined;
    max?: number | undefined;
}>;
export declare const CertificateTemplateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["asset-origin", "location", "photo", "work-site", "compliance", "government-inspection", "custody-transfer", "settlement", "quality-assay", "chain-of-custody"]>;
    securityLevel: z.ZodEnum<["standard", "enhanced", "military", "quantum-resistant"]>;
    requiredFields: z.ZodArray<z.ZodString, "many">;
    optionalFields: z.ZodArray<z.ZodString, "many">;
    validationRules: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString, z.ZodNumber]>>;
        message: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        message: string;
        field: string;
        value?: string | number | boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
    }, {
        message: string;
        field: string;
        value?: string | number | boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
    }>, "many">;
    requiredPredicates: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
    description: string;
    securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
    requiredFields: string[];
    optionalFields: string[];
    validationRules: {
        message: string;
        field: string;
        value?: string | number | boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
    }[];
    requiredPredicates?: string[] | undefined;
}, {
    id: string;
    name: string;
    type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
    description: string;
    securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
    requiredFields: string[];
    optionalFields: string[];
    validationRules: {
        message: string;
        field: string;
        value?: string | number | boolean | undefined;
        min?: number | undefined;
        max?: number | undefined;
    }[];
    requiredPredicates?: string[] | undefined;
}>;
export declare const CryptographicProofRefSchema: z.ZodObject<{
    algorithm: z.ZodString;
    dataHash: z.ZodString;
    signature: z.ZodString;
    publicKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    algorithm: string;
    dataHash: string;
    signature: string;
    publicKey: string;
}, {
    algorithm: string;
    dataHash: string;
    signature: string;
    publicKey: string;
}>;
export declare const LocationProofRefSchema: z.ZodObject<{
    id: z.ZodString;
    coordinates: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
        altitude: z.ZodOptional<z.ZodNumber>;
        accuracy: z.ZodNumber;
        timestamp: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        timestamp: number;
        accuracy: number;
        latitude: number;
        longitude: number;
        altitude?: number | undefined;
    }, {
        timestamp: number;
        accuracy: number;
        latitude: number;
        longitude: number;
        altitude?: number | undefined;
    }>;
    hash: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    coordinates: {
        timestamp: number;
        accuracy: number;
        latitude: number;
        longitude: number;
        altitude?: number | undefined;
    };
    hash: string;
}, {
    id: string;
    coordinates: {
        timestamp: number;
        accuracy: number;
        latitude: number;
        longitude: number;
        altitude?: number | undefined;
    };
    hash: string;
}>;
export declare const PhotoProofRefSchema: z.ZodObject<{
    id: z.ZodString;
    uri: z.ZodString;
    hash: z.ZodString;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    timestamp: number;
    uri: string;
    hash: string;
}, {
    id: string;
    timestamp: number;
    uri: string;
    hash: string;
}>;
export declare const ProofBundleSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["location", "photo", "workflow", "certificate"]>;
    timestamp: z.ZodNumber;
    proofs: z.ZodObject<{
        cryptographicProof: z.ZodObject<{
            algorithm: z.ZodString;
            dataHash: z.ZodString;
            signature: z.ZodString;
            publicKey: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            algorithm: string;
            dataHash: string;
            signature: string;
            publicKey: string;
        }, {
            algorithm: string;
            dataHash: string;
            signature: string;
            publicKey: string;
        }>;
        locationProof: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            coordinates: z.ZodObject<{
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
                altitude: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodNumber;
                timestamp: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            }, {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            }>;
            hash: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            coordinates: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            hash: string;
        }, {
            id: string;
            coordinates: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            hash: string;
        }>>;
        photoProofs: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            uri: z.ZodString;
            hash: z.ZodString;
            timestamp: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            id: string;
            timestamp: number;
            uri: string;
            hash: string;
        }, {
            id: string;
            timestamp: number;
            uri: string;
            hash: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        cryptographicProof: {
            algorithm: string;
            dataHash: string;
            signature: string;
            publicKey: string;
        };
        locationProof?: {
            id: string;
            coordinates: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            hash: string;
        } | undefined;
        photoProofs?: {
            id: string;
            timestamp: number;
            uri: string;
            hash: string;
        }[] | undefined;
    }, {
        cryptographicProof: {
            algorithm: string;
            dataHash: string;
            signature: string;
            publicKey: string;
        };
        locationProof?: {
            id: string;
            coordinates: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            hash: string;
        } | undefined;
        photoProofs?: {
            id: string;
            timestamp: number;
            uri: string;
            hash: string;
        }[] | undefined;
    }>;
    certificate: z.ZodOptional<z.ZodObject<{
        certificateId: z.ZodString;
        version: z.ZodString;
        type: z.ZodEnum<["asset-origin", "location", "photo", "work-site", "compliance", "government-inspection", "custody-transfer", "settlement", "quality-assay", "chain-of-custody"]>;
        securityLevel: z.ZodEnum<["standard", "enhanced", "military", "quantum-resistant"]>;
        metadata: z.ZodObject<{
            issuer: z.ZodString;
            issuedAt: z.ZodNumber;
            expiresAt: z.ZodOptional<z.ZodNumber>;
            userRole: z.ZodString;
            deviceId: z.ZodString;
            location: z.ZodObject<{
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
                altitude: z.ZodOptional<z.ZodNumber>;
                accuracy: z.ZodNumber;
                timestamp: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            }, {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            }>;
            resourceContext: z.ZodOptional<z.ZodObject<{
                commodityPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
                commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
                formation: z.ZodOptional<z.ZodString>;
                confidence: z.ZodNumber;
                source: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            }, {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            }>>;
            geologicalContext: z.ZodOptional<z.ZodObject<{
                goldPotential: z.ZodEnum<["high", "medium", "low", "none"]>;
                formation: z.ZodOptional<z.ZodString>;
                confidence: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            }, {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            }>>;
            environmentalFactors: z.ZodOptional<z.ZodObject<{
                satelliteCount: z.ZodNumber;
                signalStrength: z.ZodNumber;
                atmosphericConditions: z.ZodString;
                multipathIndicator: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            }, {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            }>>;
            validationMetrics: z.ZodOptional<z.ZodObject<{
                isJammed: z.ZodBoolean;
                isSpoofed: z.ZodBoolean;
                confidenceLevel: z.ZodNumber;
                integrityCheck: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            }, {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            }>>;
        }, "strip", z.ZodTypeAny, {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        }, {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        }>;
        verificationData: z.ZodObject<{
            publicKey: z.ZodString;
            signature: z.ZodString;
            timestamp: z.ZodNumber;
            entropyQuality: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        }, {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        }>;
        createdAt: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        metadata: {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        };
        createdAt: number;
        type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
        version: string;
        securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
        certificateId: string;
        verificationData: {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        };
    }, {
        metadata: {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        };
        createdAt: number;
        type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
        version: string;
        securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
        certificateId: string;
        verificationData: {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        };
    }>>;
    qrCode: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        data: z.ZodObject<{
            certificateId: z.ZodString;
            verifyUrl: z.ZodString;
            hash: z.ZodString;
            timestamp: z.ZodNumber;
            type: z.ZodEnum<["location", "photo", "certificate", "asset-lot"]>;
            metadata: z.ZodOptional<z.ZodObject<{
                location: z.ZodOptional<z.ZodObject<{
                    latitude: z.ZodNumber;
                    longitude: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    latitude: number;
                    longitude: number;
                }, {
                    latitude: number;
                    longitude: number;
                }>>;
                assetWeight: z.ZodOptional<z.ZodNumber>;
                assetUnit: z.ZodOptional<z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>>;
                commodityType: z.ZodOptional<z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>>;
                assetState: z.ZodOptional<z.ZodEnum<["RAW", "PRIMARY_PROCESSED", "SECONDARY_PROCESSED", "REFINED", "CERTIFIED", "FINISHED", "TRANSFERRED"]>>;
                purity: z.ZodOptional<z.ZodNumber>;
                producerId: z.ZodOptional<z.ZodString>;
                operatorRole: z.ZodOptional<z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>>;
            }, "strip", z.ZodTypeAny, {
                location?: {
                    latitude: number;
                    longitude: number;
                } | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
                purity?: number | undefined;
                producerId?: string | undefined;
                operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
                assetWeight?: number | undefined;
                assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
                assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            }, {
                location?: {
                    latitude: number;
                    longitude: number;
                } | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
                purity?: number | undefined;
                producerId?: string | undefined;
                operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
                assetWeight?: number | undefined;
                assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
                assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            type: "location" | "photo" | "certificate" | "asset-lot";
            timestamp: number;
            hash: string;
            certificateId: string;
            verifyUrl: string;
            metadata?: {
                location?: {
                    latitude: number;
                    longitude: number;
                } | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
                purity?: number | undefined;
                producerId?: string | undefined;
                operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
                assetWeight?: number | undefined;
                assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
                assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            } | undefined;
        }, {
            type: "location" | "photo" | "certificate" | "asset-lot";
            timestamp: number;
            hash: string;
            certificateId: string;
            verifyUrl: string;
            metadata?: {
                location?: {
                    latitude: number;
                    longitude: number;
                } | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
                purity?: number | undefined;
                producerId?: string | undefined;
                operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
                assetWeight?: number | undefined;
                assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
                assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            } | undefined;
        }>;
        qrCodeUri: z.ZodString;
        dataString: z.ZodString;
        size: z.ZodNumber;
        timestamp: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        id: string;
        data: {
            type: "location" | "photo" | "certificate" | "asset-lot";
            timestamp: number;
            hash: string;
            certificateId: string;
            verifyUrl: string;
            metadata?: {
                location?: {
                    latitude: number;
                    longitude: number;
                } | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
                purity?: number | undefined;
                producerId?: string | undefined;
                operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
                assetWeight?: number | undefined;
                assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
                assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            } | undefined;
        };
        timestamp: number;
        qrCodeUri: string;
        dataString: string;
        size: number;
    }, {
        id: string;
        data: {
            type: "location" | "photo" | "certificate" | "asset-lot";
            timestamp: number;
            hash: string;
            certificateId: string;
            verifyUrl: string;
            metadata?: {
                location?: {
                    latitude: number;
                    longitude: number;
                } | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
                purity?: number | undefined;
                producerId?: string | undefined;
                operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
                assetWeight?: number | undefined;
                assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
                assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            } | undefined;
        };
        timestamp: number;
        qrCodeUri: string;
        dataString: string;
        size: number;
    }>>;
    claims: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        subject: z.ZodString;
        predicate: z.ZodString;
        value: z.ZodUnknown;
        evidence: z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["government_id", "biometric_face", "biometric_fingerprint", "corporate_registry", "sanctions_screening", "site_audit", "assay_report", "photo_evidence", "gps_location", "document_hash", "witness_attestation"]>;
            hash: z.ZodString;
            timestamp: z.ZodNumber;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }, {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }>, "many">;
        attestor: z.ZodString;
        confidence: z.ZodNumber;
        issuedAt: z.ZodNumber;
        validUntil: z.ZodOptional<z.ZodNumber>;
        proof: z.ZodObject<{
            type: z.ZodEnum<["Ed25519Signature2020", "EcdsaSecp256k1Signature2019"]>;
            created: z.ZodString;
            verificationMethod: z.ZodString;
            proofValue: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        }, {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        confidence: number;
        evidence: {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }[];
        subject: string;
        predicate: string;
        attestor: string;
        issuedAt: number;
        proof: {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        };
        value?: unknown;
        validUntil?: number | undefined;
    }, {
        id: string;
        confidence: number;
        evidence: {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }[];
        subject: string;
        predicate: string;
        attestor: string;
        issuedAt: number;
        proof: {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        };
        value?: unknown;
        validUntil?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "location" | "photo" | "workflow" | "certificate";
    timestamp: number;
    proofs: {
        cryptographicProof: {
            algorithm: string;
            dataHash: string;
            signature: string;
            publicKey: string;
        };
        locationProof?: {
            id: string;
            coordinates: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            hash: string;
        } | undefined;
        photoProofs?: {
            id: string;
            timestamp: number;
            uri: string;
            hash: string;
        }[] | undefined;
    };
    certificate?: {
        metadata: {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        };
        createdAt: number;
        type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
        version: string;
        securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
        certificateId: string;
        verificationData: {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        };
    } | undefined;
    claims?: {
        id: string;
        confidence: number;
        evidence: {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }[];
        subject: string;
        predicate: string;
        attestor: string;
        issuedAt: number;
        proof: {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        };
        value?: unknown;
        validUntil?: number | undefined;
    }[] | undefined;
    qrCode?: {
        id: string;
        data: {
            type: "location" | "photo" | "certificate" | "asset-lot";
            timestamp: number;
            hash: string;
            certificateId: string;
            verifyUrl: string;
            metadata?: {
                location?: {
                    latitude: number;
                    longitude: number;
                } | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
                purity?: number | undefined;
                producerId?: string | undefined;
                operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
                assetWeight?: number | undefined;
                assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
                assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            } | undefined;
        };
        timestamp: number;
        qrCodeUri: string;
        dataString: string;
        size: number;
    } | undefined;
}, {
    id: string;
    type: "location" | "photo" | "workflow" | "certificate";
    timestamp: number;
    proofs: {
        cryptographicProof: {
            algorithm: string;
            dataHash: string;
            signature: string;
            publicKey: string;
        };
        locationProof?: {
            id: string;
            coordinates: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            hash: string;
        } | undefined;
        photoProofs?: {
            id: string;
            timestamp: number;
            uri: string;
            hash: string;
        }[] | undefined;
    };
    certificate?: {
        metadata: {
            location: {
                timestamp: number;
                accuracy: number;
                latitude: number;
                longitude: number;
                altitude?: number | undefined;
            };
            deviceId: string;
            userRole: string;
            issuedAt: number;
            issuer: string;
            geologicalContext?: {
                goldPotential: "low" | "medium" | "high" | "none";
                confidence: number;
                formation?: string | undefined;
            } | undefined;
            resourceContext?: {
                confidence: number;
                commodityPotential: "low" | "medium" | "high" | "none";
                formation?: string | undefined;
                source?: string | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
            } | undefined;
            expiresAt?: number | undefined;
            environmentalFactors?: {
                satelliteCount: number;
                signalStrength: number;
                atmosphericConditions: string;
                multipathIndicator: boolean;
            } | undefined;
            validationMetrics?: {
                isJammed: boolean;
                isSpoofed: boolean;
                confidenceLevel: number;
                integrityCheck: boolean;
            } | undefined;
        };
        createdAt: number;
        type: "compliance" | "location" | "photo" | "asset-origin" | "work-site" | "government-inspection" | "custody-transfer" | "settlement" | "quality-assay" | "chain-of-custody";
        version: string;
        securityLevel: "standard" | "enhanced" | "military" | "quantum-resistant";
        certificateId: string;
        verificationData: {
            signature: string;
            publicKey: string;
            timestamp: number;
            entropyQuality?: number | undefined;
        };
    } | undefined;
    claims?: {
        id: string;
        confidence: number;
        evidence: {
            type: "government_id" | "biometric_face" | "biometric_fingerprint" | "corporate_registry" | "sanctions_screening" | "site_audit" | "assay_report" | "photo_evidence" | "gps_location" | "document_hash" | "witness_attestation";
            timestamp: number;
            hash: string;
            metadata?: Record<string, unknown> | undefined;
        }[];
        subject: string;
        predicate: string;
        attestor: string;
        issuedAt: number;
        proof: {
            type: "Ed25519Signature2020" | "EcdsaSecp256k1Signature2019";
            created: string;
            verificationMethod: string;
            proofValue: string;
        };
        value?: unknown;
        validUntil?: number | undefined;
    }[] | undefined;
    qrCode?: {
        id: string;
        data: {
            type: "location" | "photo" | "certificate" | "asset-lot";
            timestamp: number;
            hash: string;
            certificateId: string;
            verifyUrl: string;
            metadata?: {
                location?: {
                    latitude: number;
                    longitude: number;
                } | undefined;
                commodityType?: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other" | undefined;
                purity?: number | undefined;
                producerId?: string | undefined;
                operatorRole?: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier" | undefined;
                assetWeight?: number | undefined;
                assetUnit?: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal" | undefined;
                assetState?: "RAW" | "PRIMARY_PROCESSED" | "SECONDARY_PROCESSED" | "REFINED" | "CERTIFIED" | "FINISHED" | "TRANSFERRED" | undefined;
            } | undefined;
        };
        timestamp: number;
        qrCodeUri: string;
        dataString: string;
        size: number;
    } | undefined;
}>;
export declare const CommodityConfigSchema: z.ZodObject<{
    type: z.ZodEnum<["gold", "silver", "platinum", "palladium", "rhodium", "cocoa", "coffee", "cotton", "sugar", "vanilla", "palm_oil", "rubber", "cobalt", "lithium", "copper", "tin", "tantalum", "tungsten", "diamond", "ruby", "emerald", "sapphire", "crude_oil", "natural_gas", "lng", "other"]>;
    category: z.ZodEnum<["PreciousMetals", "Agricultural", "IndustrialMinerals", "Gemstones", "Energy"]>;
    displayName: z.ZodString;
    defaultUnit: z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>;
    allowedUnits: z.ZodArray<z.ZodEnum<["g", "kg", "oz", "troy_oz", "lb", "mt", "ct", "bag", "bale", "barrel", "l", "gal"]>, "many">;
    hasPurity: z.ZodBoolean;
    qualityGrades: z.ZodArray<z.ZodEnum<["high", "medium", "low", "ungraded"]>, "many">;
    primaryProducerRole: z.ZodEnum<["producer", "aggregator", "processor", "trader", "custodian", "transporter", "certifier", "buyer", "authority", "financier", "security"]>;
    primarySiteType: z.ZodEnum<["mine", "farm", "plantation", "fishery", "forest", "quarry", "mill", "refinery", "smelter", "drying-facility", "washing-plant", "factory", "vault", "warehouse", "silo", "free-zone", "bonded-warehouse", "collection-center", "weighing-station", "checkpoint", "transfer-hub", "buying-center", "trading-office", "retail-shop", "auction-house", "seaport", "airport", "inland-port", "customs-post", "land-border"]>;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
    category: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy";
    displayName: string;
    defaultUnit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
    allowedUnits: ("g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal")[];
    hasPurity: boolean;
    qualityGrades: ("low" | "medium" | "high" | "ungraded")[];
    primaryProducerRole: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier";
    primarySiteType: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border";
    settings?: Record<string, unknown> | undefined;
}, {
    type: "gold" | "silver" | "platinum" | "palladium" | "rhodium" | "cocoa" | "coffee" | "cotton" | "sugar" | "vanilla" | "palm_oil" | "rubber" | "cobalt" | "lithium" | "copper" | "tin" | "tantalum" | "tungsten" | "diamond" | "ruby" | "emerald" | "sapphire" | "crude_oil" | "natural_gas" | "lng" | "other";
    category: "PreciousMetals" | "Agricultural" | "IndustrialMinerals" | "Gemstones" | "Energy";
    displayName: string;
    defaultUnit: "g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal";
    allowedUnits: ("g" | "kg" | "oz" | "troy_oz" | "lb" | "mt" | "ct" | "bag" | "bale" | "barrel" | "l" | "gal")[];
    hasPurity: boolean;
    qualityGrades: ("low" | "medium" | "high" | "ungraded")[];
    primaryProducerRole: "security" | "producer" | "aggregator" | "processor" | "trader" | "custodian" | "transporter" | "certifier" | "buyer" | "authority" | "financier";
    primarySiteType: "mine" | "farm" | "plantation" | "fishery" | "forest" | "quarry" | "mill" | "refinery" | "smelter" | "drying-facility" | "washing-plant" | "factory" | "vault" | "warehouse" | "silo" | "free-zone" | "bonded-warehouse" | "collection-center" | "weighing-station" | "checkpoint" | "transfer-hub" | "buying-center" | "trading-office" | "retail-shop" | "auction-house" | "seaport" | "airport" | "inland-port" | "customs-post" | "land-border";
    settings?: Record<string, unknown> | undefined;
}>;
//# sourceMappingURL=schemas.d.ts.map