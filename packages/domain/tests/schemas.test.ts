import { describe, expect, it } from 'vitest';

import {
  AssetRegistrationDataSchema,
  TradeRequestSchema,
  TradingOpportunityFilterSchema,
  ComplianceReportOptionsSchema,
  safeParse,
  validateRegistrationData,
  validatePartialRegistrationData,
  validateTradeRequest,
  validateTradingFilter,
  validateComplianceReportOptions,
  safeValidateRegistrationData,
  safeValidateTradeRequest,
} from '../src/schemas';

// ---------------------------------------------------------------------------
// AssetRegistrationDataSchema
// ---------------------------------------------------------------------------

describe('AssetRegistrationDataSchema', () => {
  const validData = {
    commodityType: 'gold',
    producerId: '11111111-1111-4111-8111-111111111111',
    discoveryLocation: {
      latitude: 1,
      longitude: 2,
      accuracy: 5,
      timestamp: Date.now(),
    },
    photos: [{ uri: 'file://photo.jpg', timestamp: Date.now() }],
    estimatedWeight: 10,
    weightUnit: 'kg' as const,
  };

  it('accepts valid data and returns correct fields', () => {
    const result = AssetRegistrationDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.commodityType).toBe('gold');
    expect(result.data.producerId).toBe(validData.producerId);
    expect(result.data.estimatedWeight).toBe(10);
    expect(result.data.weightUnit).toBe('kg');
    expect(result.data.discoveryLocation.latitude).toBe(1);
    expect(result.data.photos).toHaveLength(1);
  });

  it('populates optional fields as undefined when omitted', () => {
    const result = AssetRegistrationDataSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.form).toBeUndefined();
    expect(result.data.quality).toBeUndefined();
    expect(result.data.purity).toBeUndefined();
    expect(result.data.notes).toBeUndefined();
  });

  it('rejects missing required fields', () => {
    const result = AssetRegistrationDataSchema.safeParse({});
    expect(result.success).toBe(false);
    if (result.success) return;
    const paths = result.error.issues.map((i) => i.path[0]);
    expect(paths).toContain('commodityType');
    expect(paths).toContain('producerId');
    expect(paths).toContain('estimatedWeight');
  });

  it('rejects invalid producerId (not UUID)', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      ...validData,
      producerId: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative weight', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      ...validData,
      estimatedWeight: -5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects weight exceeding max (1M)', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      ...validData,
      estimatedWeight: 1000001,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid weightUnit', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      ...validData,
      weightUnit: 'stones',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty photos array', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      ...validData,
      photos: [],
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// TradeRequestSchema
// ---------------------------------------------------------------------------

describe('TradeRequestSchema', () => {
  const validTrade = {
    assetLotId: '11111111-1111-4111-8111-111111111111',
    sellerId: '22222222-2222-4222-8222-222222222222',
    buyerId: '33333333-3333-4333-8333-333333333333',
    quantity: 5,
    agreedPrice: 500,
    currency: 'USD',
    paymentMethod: 'cash' as const,
  };

  it('accepts valid data and returns correct fields', () => {
    const result = TradeRequestSchema.safeParse(validTrade);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.assetLotId).toBe(validTrade.assetLotId);
    expect(result.data.sellerId).toBe(validTrade.sellerId);
    expect(result.data.buyerId).toBe(validTrade.buyerId);
    expect(result.data.quantity).toBe(5);
    expect(result.data.agreedPrice).toBe(500);
    expect(result.data.currency).toBe('USD');
    expect(result.data.paymentMethod).toBe('cash');
  });

  it('rejects zero quantity', () => {
    const result = TradeRequestSchema.safeParse({ ...validTrade, quantity: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = TradeRequestSchema.safeParse({ ...validTrade, agreedPrice: -10 });
    expect(result.success).toBe(false);
  });

  it('rejects invalid payment method', () => {
    const result = TradeRequestSchema.safeParse({ ...validTrade, paymentMethod: 'bitcoin' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid seller UUID', () => {
    const result = TradeRequestSchema.safeParse({ ...validTrade, sellerId: 'bad' });
    expect(result.success).toBe(false);
  });

  it('accepts optional notes within limit', () => {
    const result = TradeRequestSchema.safeParse({ ...validTrade, notes: 'Quick trade' });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.notes).toBe('Quick trade');
  });

  it('rejects notes exceeding 1000 chars', () => {
    const result = TradeRequestSchema.safeParse({ ...validTrade, notes: 'x'.repeat(1001) });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// TradingOpportunityFilterSchema
// ---------------------------------------------------------------------------

describe('TradingOpportunityFilterSchema', () => {
  it('accepts valid filters and returns correct fields', () => {
    const result = TradingOpportunityFilterSchema.safeParse({
      commodityType: 'gold',
      minWeight: 1,
      maxWeight: 100,
      forms: ['raw'],
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.commodityType).toBe('gold');
    expect(result.data.minWeight).toBe(1);
    expect(result.data.maxWeight).toBe(100);
    expect(result.data.forms).toEqual(['raw']);
  });

  it('accepts empty filter (all optional)', () => {
    const result = TradingOpportunityFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('rejects radiusKm exceeding 500', () => {
    const result = TradingOpportunityFilterSchema.safeParse({ radiusKm: 501 });
    expect(result.success).toBe(false);
  });

  it('rejects forms array exceeding 10 items', () => {
    const result = TradingOpportunityFilterSchema.safeParse({
      forms: Array.from({ length: 11 }, (_, i) => `form${i}`),
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ComplianceReportOptionsSchema
// ---------------------------------------------------------------------------

describe('ComplianceReportOptionsSchema', () => {
  const validOptions = {
    dateRange: {
      start: '2024-01-01T00:00:00.000Z',
      end: '2024-12-31T00:00:00.000Z',
    },
    format: 'summary' as const,
    categories: ['labor' as const],
  };

  it('accepts valid options and returns correct fields', () => {
    const result = ComplianceReportOptionsSchema.safeParse(validOptions);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.format).toBe('summary');
    expect(result.data.categories).toEqual(['labor']);
    expect(result.data.dateRange.start).toBe('2024-01-01T00:00:00.000Z');
  });

  it('rejects start date after end date', () => {
    const result = ComplianceReportOptionsSchema.safeParse({
      ...validOptions,
      dateRange: {
        start: '2025-01-01T00:00:00.000Z',
        end: '2024-01-01T00:00:00.000Z',
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid format', () => {
    const result = ComplianceReportOptionsSchema.safeParse({
      ...validOptions,
      format: 'csv',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid compliance category', () => {
    const result = ComplianceReportOptionsSchema.safeParse({
      ...validOptions,
      categories: ['hacking'],
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing format', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { format: _f, ...noFormat } = validOptions;
    const result = ComplianceReportOptionsSchema.safeParse(noFormat);
    expect(result.success).toBe(false);
  });

  it('rejects missing dateRange', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dateRange: _d, ...noRange } = validOptions;
    const result = ComplianceReportOptionsSchema.safeParse(noRange);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// safeParse
// ---------------------------------------------------------------------------

describe('safeParse', () => {
  it('returns success for valid data', () => {
    const result = safeParse(AssetRegistrationDataSchema, {
      commodityType: 'gold',
      producerId: '11111111-1111-4111-8111-111111111111',
      discoveryLocation: { latitude: 1, longitude: 2, accuracy: 5, timestamp: Date.now() },
      photos: [{ uri: 'file://photo.jpg', timestamp: Date.now() }],
      estimatedWeight: 10,
      weightUnit: 'kg',
    });
    expect(result.success).toBe(true);
  });

  it('returns error for invalid data', () => {
    const result = safeParse(AssetRegistrationDataSchema, {});
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// AssetRegistrationDataSchema assetDetails
// ---------------------------------------------------------------------------

describe('AssetRegistrationDataSchema assetDetails', () => {
  const baseData = {
    commodityType: 'gold',
    producerId: '11111111-1111-4111-8111-111111111111',
    discoveryLocation: { latitude: 1, longitude: 2, accuracy: 5, timestamp: Date.now() },
    photos: [{ uri: 'file://photo.jpg', timestamp: Date.now() }],
    estimatedWeight: 10,
    weightUnit: 'kg',
  };

  it('rejects assetDetails with dangerous keys', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      ...baseData,
      assetDetails: { constructor: 'bad' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects assetDetails with nested dangerous keys', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      ...baseData,
      assetDetails: { nested: { constructor: 'bad' } },
    });
    expect(result.success).toBe(false);
  });

  it('accepts assetDetails with safe keys', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      ...baseData,
      assetDetails: { color: 'yellow', purity: 99 },
    });
    expect(result.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

describe('validation helpers', () => {
  const validRegistration = {
    commodityType: 'gold',
    producerId: '11111111-1111-4111-8111-111111111111',
    discoveryLocation: { latitude: 1, longitude: 2, accuracy: 5, timestamp: Date.now() },
    photos: [{ uri: 'file://photo.jpg', timestamp: Date.now() }],
    estimatedWeight: 10,
    weightUnit: 'kg',
  };

  const validTrade = {
    assetLotId: '11111111-1111-4111-8111-111111111111',
    sellerId: '22222222-2222-4222-8222-222222222222',
    buyerId: '33333333-3333-4333-8333-333333333333',
    quantity: 5,
    agreedPrice: 500,
    currency: 'USD',
    paymentMethod: 'cash',
  };

  it('validateRegistrationData returns valid data', () => {
    const result = validateRegistrationData(validRegistration);
    expect(result.commodityType).toBe('gold');
  });

  it('validateRegistrationData throws on invalid data', () => {
    expect(() => validateRegistrationData({})).toThrow();
  });

  it('validatePartialRegistrationData returns partial data', () => {
    const result = validatePartialRegistrationData({ commodityType: 'gold' });
    expect(result.commodityType).toBe('gold');
  });

  it('validateTradeRequest returns valid trade', () => {
    const result = validateTradeRequest(validTrade);
    expect(result.quantity).toBe(5);
  });

  it('validateTradeRequest throws on invalid data', () => {
    expect(() => validateTradeRequest({})).toThrow();
  });

  it('validateTradingFilter returns valid filter', () => {
    const result = validateTradingFilter({ commodityType: 'gold' });
    expect(result.commodityType).toBe('gold');
  });

  it('validateComplianceReportOptions returns valid options', () => {
    const result = validateComplianceReportOptions({
      dateRange: {
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-12-31T00:00:00.000Z',
      },
      format: 'summary',
    });
    expect(result.format).toBe('summary');
  });

  it('safeValidateRegistrationData returns success for valid data', () => {
    const result = safeValidateRegistrationData(validRegistration);
    expect(result.success).toBe(true);
  });

  it('safeValidateRegistrationData returns error for invalid data', () => {
    const result = safeValidateRegistrationData({});
    expect(result.success).toBe(false);
  });

  it('safeValidateTradeRequest returns success for valid data', () => {
    const result = safeValidateTradeRequest(validTrade);
    expect(result.success).toBe(true);
  });

  it('safeValidateTradeRequest returns error for invalid data', () => {
    const result = safeValidateTradeRequest({});
    expect(result.success).toBe(false);
  });
});
