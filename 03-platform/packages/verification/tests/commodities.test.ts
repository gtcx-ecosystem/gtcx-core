import { describe, it, expect } from 'vitest';

import {
  getCommodityConfig,
  getCommodityCategory,
  getCredentialForRole,
  migrateLegacyLotData,
  migrateGoldLotData,
  COMMODITY_CONFIGS,
} from '../src/types/definitions/commodities';

describe('getCommodityConfig', () => {
  it('returns config for known commodity', () => {
    const config = getCommodityConfig('gold');
    expect(config.type).toBe('gold');
    expect(config.category).toBe('PreciousMetals');
    expect(config.hasPurity).toBe(true);
    expect(config.defaultUnit).toBe('troy_oz');
  });

  it('returns config for agricultural commodity', () => {
    const config = getCommodityConfig('coffee');
    expect(config.type).toBe('coffee');
    expect(config.category).toBe('Agricultural');
    expect(config.hasPurity).toBe(false);
  });

  it('returns config for gemstone', () => {
    const config = getCommodityConfig('diamond');
    expect(config.defaultUnit).toBe('ct');
    expect(config.category).toBe('Gemstones');
  });

  it('returns config for energy commodity', () => {
    const config = getCommodityConfig('crude_oil');
    expect(config.defaultUnit).toBe('barrel');
    expect(config.category).toBe('Energy');
  });

  it('falls back to "other" for unknown commodity type', () => {
    const config = getCommodityConfig('unknown_mineral' as never);
    expect(config.type).toBe('other');
    expect(config.category).toBe('IndustrialMinerals');
  });
});

describe('getCommodityCategory', () => {
  it('returns PreciousMetals for gold', () => {
    expect(getCommodityCategory('gold')).toBe('PreciousMetals');
  });

  it('returns Agricultural for cocoa', () => {
    expect(getCommodityCategory('cocoa')).toBe('Agricultural');
  });

  it('returns IndustrialMinerals for cobalt', () => {
    expect(getCommodityCategory('cobalt')).toBe('IndustrialMinerals');
  });

  it('returns Gemstones for ruby', () => {
    expect(getCommodityCategory('ruby')).toBe('Gemstones');
  });

  it('returns Energy for natural_gas', () => {
    expect(getCommodityCategory('natural_gas')).toBe('Energy');
  });
});

describe('getCredentialForRole', () => {
  it('maps producer to ProducerID', () => {
    expect(getCredentialForRole('producer')).toBe('ProducerID');
  });

  it('maps trader to TraderID', () => {
    expect(getCredentialForRole('trader')).toBe('TraderID');
  });

  it('maps authority to AuthorityID', () => {
    expect(getCredentialForRole('authority')).toBe('AuthorityID');
  });

  it('maps all 11 roles correctly', () => {
    const expected: Record<string, string> = {
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
    for (const [role, credential] of Object.entries(expected)) {
      expect(getCredentialForRole(role as never)).toBe(credential);
    }
  });
});

describe('migrateLegacyLotData', () => {
  it('converts GoldLotData to AssetLotData with gold defaults', () => {
    const legacy = {
      estimatedWeight: 500,
      quality: 'high' as const,
      purity: 0.995,
      miner: 'miner-001',
      discoveryDate: '2026-01-15',
    };
    const result = migrateLegacyLotData(legacy);
    expect(result.commodityType).toBe('gold');
    expect(result.category).toBe('PreciousMetals');
    expect(result.estimatedWeight).toBe(500);
    expect(result.unit).toBe('troy_oz');
    expect(result.quality).toBe('high');
    expect(result.purity).toBe(0.995);
    expect(result.producerId).toBe('miner-001');
    expect(result.operatorRole).toBe('producer');
    expect(result.state).toBe('RAW');
  });

  it('accepts explicit commodity type override', () => {
    const legacy = {
      estimatedWeight: 100,
      quality: 'medium' as const,
      miner: 'miner-002',
    };
    const result = migrateLegacyLotData(legacy, 'silver');
    expect(result.commodityType).toBe('silver');
    expect(result.category).toBe('PreciousMetals');
  });

  it('handles missing optional fields', () => {
    const legacy = {
      estimatedWeight: 10,
      miner: 'miner-003',
    };
    const result = migrateLegacyLotData(legacy);
    expect(result.purity).toBeUndefined();
    expect(result.quality).toBeUndefined();
    expect(result.discoveryDate).toBeUndefined();
  });
});

describe('migrateGoldLotData (deprecated alias)', () => {
  it('is the same function as migrateLegacyLotData', () => {
    expect(migrateGoldLotData).toBe(migrateLegacyLotData);
  });
});

describe('COMMODITY_CONFIGS', () => {
  it('has all commodity types configured', () => {
    expect(Object.keys(COMMODITY_CONFIGS).length).toBeGreaterThanOrEqual(25);
  });

  it('every config has required fields', () => {
    for (const [key, config] of Object.entries(COMMODITY_CONFIGS)) {
      expect(config.type).toBe(key);
      expect(config.displayName).toBeTruthy();
      expect(config.defaultUnit).toBeTruthy();
      expect(config.allowedUnits.length).toBeGreaterThan(0);
      expect(config.qualityGrades.length).toBeGreaterThan(0);
    }
  });
});
