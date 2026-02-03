import type { CertificateTemplate, CertificateType, CertificateSecurityLevel, CommodityType, CommodityConfig, MeasurementUnit } from '../types';
/**
 * Asset Origin Certificate Template - UNIVERSAL
 * Military-grade security for tracking ANY commodity from source to market
 *
 * Use: Gold, silver, cobalt, cocoa, coffee, etc.
 */
export declare const ASSET_ORIGIN_TEMPLATE: CertificateTemplate;
/**
 * Work Site Verification Template
 * Daily check-in verification for producers at extraction sites
 */
export declare const WORK_SITE_TEMPLATE: CertificateTemplate;
/**
 * Government Inspector Template
 * Highest security for government inspection activities
 */
export declare const GOVERNMENT_INSPECTOR_TEMPLATE: CertificateTemplate;
/**
 * Location Certificate Template
 * Standard location verification
 */
export declare const LOCATION_TEMPLATE: CertificateTemplate;
/**
 * Photo Evidence Template
 * Photo with location binding
 */
export declare const PHOTO_TEMPLATE: CertificateTemplate;
/**
 * Compliance Certificate Template
 * For regulatory compliance verification
 */
export declare const COMPLIANCE_TEMPLATE: CertificateTemplate;
/**
 * Custody Transfer Template - NEW
 * For VaultMark custody change verification
 */
export declare const CUSTODY_TRANSFER_TEMPLATE: CertificateTemplate;
/**
 * Settlement Template - NEW
 * For PvP settlement verification
 */
export declare const SETTLEMENT_TEMPLATE: CertificateTemplate;
/**
 * @deprecated Use ASSET_ORIGIN_TEMPLATE instead
 * This alias exists only for backwards compatibility during migration
 */
export declare const GOLD_ORIGIN_TEMPLATE: CertificateTemplate;
/**
 * All available certificate templates
 */
export declare const CERTIFICATE_TEMPLATES: Record<string, CertificateTemplate>;
/**
 * Configuration overlay for commodity-specific certificate behavior
 */
export interface CommodityCertificateConfig {
    /** Which template to use */
    templateId: string;
    /** Commodity type */
    commodityType: CommodityType;
    /** Default measurement unit */
    defaultUnit: MeasurementUnit;
    /** Display name for UI */
    displayName: string;
    /** Additional validation rules specific to this commodity */
    additionalValidation?: Array<{
        field: string;
        min?: number;
        max?: number;
        value?: boolean | string | number;
        message: string;
    }>;
    /** Custom required fields beyond template defaults */
    additionalRequiredFields?: string[];
}
/**
 * Pre-defined commodity configurations
 */
export declare const COMMODITY_CERTIFICATE_CONFIGS: Record<string, CommodityCertificateConfig>;
/**
 * Get template by ID
 */
export declare function getTemplate(templateId: string): CertificateTemplate | undefined;
/**
 * Get templates by security level
 */
export declare function getTemplatesBySecurityLevel(level: CertificateSecurityLevel): CertificateTemplate[];
/**
 * Get templates by type
 */
export declare function getTemplatesByType(type: CertificateType): CertificateTemplate[];
/**
 * List all template IDs
 */
export declare function listTemplateIds(): string[];
/**
 * Get commodity-specific certificate configuration
 */
export declare function getCommodityCertificateConfig(configId: string): CommodityCertificateConfig | undefined;
/**
 * Create a commodity-specific certificate configuration dynamically
 */
export declare function createCommodityCertificateConfig(commodityType: CommodityType, config: CommodityConfig): CommodityCertificateConfig;
/**
 * Get effective template with commodity-specific overrides
 */
export declare function getEffectiveTemplate(templateId: string, commodityType?: CommodityType): CertificateTemplate;
//# sourceMappingURL=templates.d.ts.map