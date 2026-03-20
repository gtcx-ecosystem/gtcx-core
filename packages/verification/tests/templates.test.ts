import { describe, it, expect } from 'vitest';

import {
  ASSET_ORIGIN_TEMPLATE,
  WORK_SITE_TEMPLATE,
  GOVERNMENT_INSPECTOR_TEMPLATE,
  LOCATION_TEMPLATE,
  PHOTO_TEMPLATE,
  COMPLIANCE_TEMPLATE,
  CUSTODY_TRANSFER_TEMPLATE,
  SETTLEMENT_TEMPLATE,
  GOLD_ORIGIN_TEMPLATE,
  CERTIFICATE_TEMPLATES,
  getTemplate,
  getTemplatesBySecurityLevel,
  getTemplatesByType,
  listTemplateIds,
  getCommodityCertificateConfig,
  createCommodityCertificateConfig,
  getEffectiveTemplate,
} from '../src/certificates/templates';
import type { CommodityConfig } from '../src/types';

// ---------------------------------------------------------------------------
// Template constants are defined
// ---------------------------------------------------------------------------

describe('template constants', () => {
  it('ASSET_ORIGIN_TEMPLATE is defined with correct id and type', () => {
    expect(ASSET_ORIGIN_TEMPLATE).toBeDefined();
    expect(ASSET_ORIGIN_TEMPLATE.id).toBe('asset-origin');
    expect(ASSET_ORIGIN_TEMPLATE.type).toBe('asset-origin');
    expect(ASSET_ORIGIN_TEMPLATE.securityLevel).toBe('quantum-resistant');
  });

  it('WORK_SITE_TEMPLATE is defined with correct id and type', () => {
    expect(WORK_SITE_TEMPLATE).toBeDefined();
    expect(WORK_SITE_TEMPLATE.id).toBe('work-site');
    expect(WORK_SITE_TEMPLATE.type).toBe('work-site');
    expect(WORK_SITE_TEMPLATE.securityLevel).toBe('enhanced');
  });

  it('GOVERNMENT_INSPECTOR_TEMPLATE is defined with correct id and type', () => {
    expect(GOVERNMENT_INSPECTOR_TEMPLATE).toBeDefined();
    expect(GOVERNMENT_INSPECTOR_TEMPLATE.id).toBe('government-inspection');
    expect(GOVERNMENT_INSPECTOR_TEMPLATE.type).toBe('government-inspection');
    expect(GOVERNMENT_INSPECTOR_TEMPLATE.securityLevel).toBe('quantum-resistant');
  });

  it('LOCATION_TEMPLATE is defined with correct id and type', () => {
    expect(LOCATION_TEMPLATE).toBeDefined();
    expect(LOCATION_TEMPLATE.id).toBe('location');
    expect(LOCATION_TEMPLATE.type).toBe('location');
    expect(LOCATION_TEMPLATE.securityLevel).toBe('standard');
  });

  it('PHOTO_TEMPLATE is defined with correct id and type', () => {
    expect(PHOTO_TEMPLATE).toBeDefined();
    expect(PHOTO_TEMPLATE.id).toBe('photo');
    expect(PHOTO_TEMPLATE.type).toBe('photo');
    expect(PHOTO_TEMPLATE.securityLevel).toBe('standard');
  });

  it('COMPLIANCE_TEMPLATE is defined with correct id and type', () => {
    expect(COMPLIANCE_TEMPLATE).toBeDefined();
    expect(COMPLIANCE_TEMPLATE.id).toBe('compliance');
    expect(COMPLIANCE_TEMPLATE.type).toBe('compliance');
    expect(COMPLIANCE_TEMPLATE.securityLevel).toBe('enhanced');
  });

  it('CUSTODY_TRANSFER_TEMPLATE is defined with correct id and type', () => {
    expect(CUSTODY_TRANSFER_TEMPLATE).toBeDefined();
    expect(CUSTODY_TRANSFER_TEMPLATE.id).toBe('custody-transfer');
    expect(CUSTODY_TRANSFER_TEMPLATE.type).toBe('custody-transfer');
    expect(CUSTODY_TRANSFER_TEMPLATE.securityLevel).toBe('military');
  });

  it('SETTLEMENT_TEMPLATE is defined with correct id and type', () => {
    expect(SETTLEMENT_TEMPLATE).toBeDefined();
    expect(SETTLEMENT_TEMPLATE.id).toBe('settlement');
    expect(SETTLEMENT_TEMPLATE.type).toBe('settlement');
    expect(SETTLEMENT_TEMPLATE.securityLevel).toBe('quantum-resistant');
  });

  it('GOLD_ORIGIN_TEMPLATE is an alias for ASSET_ORIGIN_TEMPLATE', () => {
    expect(GOLD_ORIGIN_TEMPLATE).toBe(ASSET_ORIGIN_TEMPLATE);
  });

  it('all templates have requiredFields, optionalFields, and validationRules arrays', () => {
    const allTemplates = [
      ASSET_ORIGIN_TEMPLATE,
      WORK_SITE_TEMPLATE,
      GOVERNMENT_INSPECTOR_TEMPLATE,
      LOCATION_TEMPLATE,
      PHOTO_TEMPLATE,
      COMPLIANCE_TEMPLATE,
      CUSTODY_TRANSFER_TEMPLATE,
      SETTLEMENT_TEMPLATE,
    ];
    for (const template of allTemplates) {
      expect(Array.isArray(template.requiredFields)).toBe(true);
      expect(Array.isArray(template.optionalFields)).toBe(true);
      expect(Array.isArray(template.validationRules)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// CERTIFICATE_TEMPLATES record
// ---------------------------------------------------------------------------

describe('CERTIFICATE_TEMPLATES', () => {
  it('contains all primary template IDs', () => {
    const expectedIds = [
      'asset-origin',
      'work-site',
      'government-inspection',
      'location',
      'photo',
      'compliance',
      'custody-transfer',
      'settlement',
    ];
    for (const id of expectedIds) {
      expect(CERTIFICATE_TEMPLATES[id]).toBeDefined();
    }
  });

  it('contains legacy gold-origin alias', () => {
    expect(CERTIFICATE_TEMPLATES['gold-origin']).toBe(ASSET_ORIGIN_TEMPLATE);
  });
});

// ---------------------------------------------------------------------------
// getTemplate
// ---------------------------------------------------------------------------

describe('getTemplate', () => {
  it('returns template by ID', () => {
    const template = getTemplate('location');
    expect(template).toBe(LOCATION_TEMPLATE);
  });

  it('returns template for each registered ID', () => {
    const ids = listTemplateIds();
    for (const id of ids) {
      expect(getTemplate(id)).toBeDefined();
    }
  });

  it('returns undefined for unknown ID', () => {
    expect(getTemplate('does-not-exist')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getTemplatesBySecurityLevel
// ---------------------------------------------------------------------------

describe('getTemplatesBySecurityLevel', () => {
  it('filters templates by "standard" level', () => {
    const results = getTemplatesBySecurityLevel('standard');
    expect(results.length).toBeGreaterThan(0);
    for (const t of results) {
      expect(t.securityLevel).toBe('standard');
    }
  });

  it('filters templates by "quantum-resistant" level', () => {
    const results = getTemplatesBySecurityLevel('quantum-resistant');
    expect(results.length).toBeGreaterThan(0);
    for (const t of results) {
      expect(t.securityLevel).toBe('quantum-resistant');
    }
  });

  it('filters templates by "enhanced" level', () => {
    const results = getTemplatesBySecurityLevel('enhanced');
    expect(results.length).toBeGreaterThan(0);
    for (const t of results) {
      expect(t.securityLevel).toBe('enhanced');
    }
  });

  it('filters templates by "military" level', () => {
    const results = getTemplatesBySecurityLevel('military');
    expect(results.length).toBeGreaterThan(0);
    for (const t of results) {
      expect(t.securityLevel).toBe('military');
    }
  });
});

// ---------------------------------------------------------------------------
// getTemplatesByType
// ---------------------------------------------------------------------------

describe('getTemplatesByType', () => {
  it('returns templates matching the given type', () => {
    const results = getTemplatesByType('location');
    expect(results.length).toBeGreaterThan(0);
    for (const t of results) {
      expect(t.type).toBe('location');
    }
  });

  it('returns multiple results for asset-origin (includes gold-origin alias)', () => {
    const results = getTemplatesByType('asset-origin');
    // asset-origin key + gold-origin alias both point to the same template
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('returns empty array for unused type', () => {
    const results = getTemplatesByType('chain-of-custody');
    expect(results).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// listTemplateIds
// ---------------------------------------------------------------------------

describe('listTemplateIds', () => {
  it('returns all registered template IDs including legacy alias', () => {
    const ids = listTemplateIds();
    expect(ids).toContain('asset-origin');
    expect(ids).toContain('location');
    expect(ids).toContain('gold-origin');
    expect(ids.length).toBeGreaterThanOrEqual(9);
  });
});

// ---------------------------------------------------------------------------
// getCommodityCertificateConfig
// ---------------------------------------------------------------------------

describe('getCommodityCertificateConfig', () => {
  it('retrieves gold-origin config', () => {
    const config = getCommodityCertificateConfig('gold-origin');
    expect(config).toBeDefined();
    expect(config?.commodityType).toBe('gold');
    expect(config?.defaultUnit).toBe('troy_oz');
    expect(config?.templateId).toBe('asset-origin');
  });

  it('retrieves cocoa-origin config', () => {
    const config = getCommodityCertificateConfig('cocoa-origin');
    expect(config).toBeDefined();
    expect(config?.commodityType).toBe('cocoa');
    expect(config?.defaultUnit).toBe('kg');
  });

  it('returns undefined for unknown config', () => {
    expect(getCommodityCertificateConfig('unknown-origin')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// createCommodityCertificateConfig
// ---------------------------------------------------------------------------

describe('createCommodityCertificateConfig', () => {
  it('creates a valid config for a commodity with purity', () => {
    const commodityConfig: CommodityConfig = {
      type: 'platinum',
      category: 'PreciousMetals',
      displayName: 'Platinum',
      defaultUnit: 'troy_oz',
      allowedUnits: ['g', 'kg', 'oz', 'troy_oz'],
      hasPurity: true,
      qualityGrades: ['high', 'medium', 'low'],
      primaryProducerRole: 'producer',
      primarySiteType: 'mine',
    };

    const config = createCommodityCertificateConfig('platinum', commodityConfig);

    expect(config.commodityType).toBe('platinum');
    expect(config.templateId).toBe('asset-origin');
    expect(config.defaultUnit).toBe('troy_oz');
    expect(config.displayName).toBe('Platinum Origin Certificate');
    expect(config.additionalValidation).toBeDefined();
    expect(config.additionalValidation!.length).toBeGreaterThan(0);
    expect(config.additionalValidation![0]!.field).toContain('purity');
  });

  it('creates a config without purity validation for non-purity commodity', () => {
    const commodityConfig: CommodityConfig = {
      type: 'cocoa',
      category: 'Agricultural',
      displayName: 'Cocoa',
      defaultUnit: 'kg',
      allowedUnits: ['kg', 'mt', 'bag'],
      hasPurity: false,
      qualityGrades: ['high', 'medium', 'low'],
      primaryProducerRole: 'producer',
      primarySiteType: 'farm',
    };

    const config = createCommodityCertificateConfig('cocoa', commodityConfig);
    expect(config.additionalValidation).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getEffectiveTemplate
// ---------------------------------------------------------------------------

describe('getEffectiveTemplate', () => {
  it('returns base template when no commodity type is provided', () => {
    const template = getEffectiveTemplate('location');
    expect(template).toEqual(LOCATION_TEMPLATE);
  });

  it('returns base template when commodity has no specific config', () => {
    const template = getEffectiveTemplate('asset-origin', 'diamond');
    // diamond-origin is not in COMMODITY_CERTIFICATE_CONFIGS, so base template is returned
    expect(template.id).toBe('asset-origin');
    expect(template.name).toBe(ASSET_ORIGIN_TEMPLATE.name);
  });

  it('merges commodity-specific rules for gold', () => {
    const template = getEffectiveTemplate('asset-origin', 'gold');
    // Should have gold-specific validation for purity
    expect(template.name).toBe('Gold Origin Certificate');
    expect(template.validationRules.length).toBeGreaterThan(
      ASSET_ORIGIN_TEMPLATE.validationRules.length
    );
    const purityRule = template.validationRules.find((r) => r.field === 'assetLotData.purity');
    expect(purityRule).toBeDefined();
  });

  it('merges additional required fields for cobalt', () => {
    const template = getEffectiveTemplate('asset-origin', 'cobalt');
    expect(template.requiredFields).toContain('resourceContext');
  });

  it('throws for unknown template ID', () => {
    expect(() => getEffectiveTemplate('nonexistent')).toThrow(/not found/);
  });
});
