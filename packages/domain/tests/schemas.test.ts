import { describe, expect, it } from 'vitest';

import {
  AssetRegistrationDataSchema,
  TradeRequestSchema,
  TradingOpportunityFilterSchema,
  ComplianceReportOptionsSchema,
} from '../src/schemas';

describe('Domain schemas', () => {
  it('accepts valid asset registration data', () => {
    const result = AssetRegistrationDataSchema.safeParse({
      commodityType: 'gold',
      producerId: '11111111-1111-4111-8111-111111111111',
      discoveryLocation: {
        latitude: 1,
        longitude: 2,
        accuracy: 5,
        timestamp: Date.now(),
      },
      photos: [
        {
          uri: 'file://photo.jpg',
          timestamp: Date.now(),
        },
      ],
      estimatedWeight: 10,
      weightUnit: 'kg',
    });

    expect(result.success).toBe(true);
  });

  it('accepts valid trade request data', () => {
    const result = TradeRequestSchema.safeParse({
      assetLotId: '11111111-1111-4111-8111-111111111111',
      sellerId: '22222222-2222-4222-8222-222222222222',
      buyerId: '33333333-3333-4333-8333-333333333333',
      quantity: 5,
      agreedPrice: 500,
      currency: 'USD',
      paymentMethod: 'cash',
    });

    expect(result.success).toBe(true);
  });

  it('accepts trading opportunity filters', () => {
    const result = TradingOpportunityFilterSchema.safeParse({
      commodityType: 'gold',
      minWeight: 1,
      maxWeight: 100,
      forms: ['raw'],
    });

    expect(result.success).toBe(true);
  });

  it('accepts compliance report options with labor category', () => {
    const result = ComplianceReportOptionsSchema.safeParse({
      dateRange: {
        start: '2024-01-01T00:00:00Z',
        end: '2024-12-31T00:00:00Z',
      },
      format: 'summary',
      categories: ['labor'],
    });

    expect(result.success).toBe(true);
  });
});
