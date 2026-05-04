/**
 * TradingService Tests
 *
 * Tests for commodity-agnostic trading operations including
 * market pricing, fair price calculation, opportunity discovery,
 * trade execution, and analytics.
 */

import type {
  ICryptoService,
  IStorageService,
  IPriceService,
  IComplianceService,
  AssetLot,
  Trader,
} from '@gtcx/domain';
import { describe, expect, it, vi } from 'vitest';

import type { ITraderRepository } from '../src/repositories';
import { TradingService } from '../src/trading';

// ============================================================================
// HELPERS
// ============================================================================

function createMockCryptoService(): ICryptoService {
  return {
    createHash: vi.fn().mockResolvedValue('mock-hash'),
    sign: vi.fn().mockResolvedValue('mock-signature'),
    verify: vi.fn().mockResolvedValue(true),
    signTransaction: vi.fn().mockResolvedValue('mock-tx-signature'),
  };
}

function createMockStorageService(): IStorageService {
  return {
    saveAssetLot: vi.fn().mockResolvedValue(undefined),
    getAssetLot: vi.fn().mockResolvedValue(null),
    saveCertificate: vi.fn().mockResolvedValue(undefined),
    saveTransaction: vi.fn().mockResolvedValue(undefined),
  };
}

function createMockPriceService(basePrice = 1800): IPriceService {
  return {
    getMarketPrice: vi.fn().mockResolvedValue(basePrice),
    getExchangeRate: vi.fn().mockResolvedValue(1.0),
  };
}

function createMockComplianceService(
  opts: {
    licensesValid?: boolean;
    complianceIssues?: unknown[];
  } = {}
): IComplianceService {
  return {
    validateLicenses: vi.fn().mockResolvedValue(opts.licensesValid ?? true),
    checkCompliance: vi.fn().mockResolvedValue(opts.complianceIssues ?? []),
  };
}

function createMockEventEmitter() {
  return {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };
}

function createService(
  overrides: {
    priceService?: IPriceService;
    complianceService?: IComplianceService;
    cryptoService?: ICryptoService;
    storageService?: IStorageService;
    eventEmitter?: ReturnType<typeof createMockEventEmitter>;
    config?: Record<string, unknown>;
  } = {}
) {
  return new TradingService(
    {
      priceService: overrides.priceService ?? createMockPriceService(),
      complianceService: overrides.complianceService ?? createMockComplianceService(),
      cryptoService: overrides.cryptoService ?? createMockCryptoService(),
      storageService: overrides.storageService ?? createMockStorageService(),
      eventEmitter: overrides.eventEmitter as never,
    },
    overrides.config ?? {}
  );
}

function createMockAssetLot(overrides: Partial<AssetLot> = {}): AssetLot {
  return {
    id: 'GOL-560-018-TEST-ABCD',
    commodityType: 'gold',
    producerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    discoveryLocation: {
      latitude: 5.6037,
      longitude: -0.187,
      accuracy: 5,
      timestamp: Date.now(),
    },
    discoveryDate: new Date().toISOString(),
    weight: 100,
    weightUnit: 'g',
    purity: 90,
    form: 'refined',
    qualityGrade: 'A',
    status: 'registered',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createValidTradeRequest(overrides: Record<string, unknown> = {}) {
  return {
    assetLotId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    sellerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    buyerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    quantity: 100,
    agreedPrice: 5000,
    currency: 'USD',
    paymentMethod: 'bank_transfer' as const,
    ...overrides,
  };
}

// ============================================================================
// TESTS
// ============================================================================

describe('TradingService', () => {
  // --------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------

  describe('constructor', () => {
    it('accepts valid config and creates service', () => {
      const service = createService();
      expect(service).toBeInstanceOf(TradingService);
    });

    it('accepts partial config and merges with defaults', () => {
      const service = createService({ config: { defaultCurrency: 'EUR' } });
      expect(service).toBeInstanceOf(TradingService);
    });

    it('accepts empty config', () => {
      const service = createService({ config: {} });
      expect(service).toBeInstanceOf(TradingService);
    });

    it('throws on invalid config: negative spread', () => {
      expect(() => createService({ config: { defaultSpread: -1 } })).toThrow(
        /Invalid trading config/
      );
    });

    it('throws on invalid config: spread over 100', () => {
      expect(() => createService({ config: { defaultSpread: 150 } })).toThrow(
        /Invalid trading config/
      );
    });

    it('throws on invalid config: negative highValueThreshold', () => {
      expect(() => createService({ config: { highValueThreshold: -500 } })).toThrow(
        /Invalid trading config/
      );
    });
  });

  // --------------------------------------------------------------------------
  // getCurrentMarketPrices
  // --------------------------------------------------------------------------

  describe('getCurrentMarketPrices()', () => {
    it('returns base price when no forms specified', async () => {
      const mockPrice = createMockPriceService(1800);
      const service = createService({ priceService: mockPrice });

      const prices = await service.getCurrentMarketPrices('gold');

      expect(prices).toHaveLength(1);
      expect(prices[0]!.basePrice).toBe(1800);
      expect(prices[0]!.commodityType).toBe('gold');
      expect(prices[0]!.currency).toBe('USD');
      expect(prices[0]!.source).toBe('market');
    });

    it('returns base price when forms array is empty', async () => {
      const service = createService({ priceService: createMockPriceService(2000) });

      const prices = await service.getCurrentMarketPrices('gold', []);

      expect(prices).toHaveLength(1);
      expect(prices[0]!.basePrice).toBe(2000);
    });

    it('returns form-specific prices with adjustments', async () => {
      const service = createService({ priceService: createMockPriceService(1000) });

      const prices = await service.getCurrentMarketPrices('gold', ['raw', 'refined', 'premium']);

      expect(prices).toHaveLength(3);

      // raw: 1000 * 0.7 = 700
      expect(prices[0]!.assetForm).toBe('raw');
      expect(prices[0]!.basePrice).toBe(700);

      // refined: 1000 * 1.0 = 1000
      expect(prices[1]!.assetForm).toBe('refined');
      expect(prices[1]!.basePrice).toBe(1000);

      // premium: 1000 * 1.1 = 1100
      expect(prices[2]!.assetForm).toBe('premium');
      expect(prices[2]!.basePrice).toBe(1100);
    });

    it('uses default adjustment of 0.8 for unknown forms', async () => {
      const service = createService({ priceService: createMockPriceService(1000) });

      const prices = await service.getCurrentMarketPrices('gold', ['unknown_form']);

      expect(prices[0]!.basePrice).toBe(800);
    });

    it('includes spread from config', async () => {
      const service = createService({
        priceService: createMockPriceService(1000),
        config: { defaultSpread: 3.5 },
      });

      const prices = await service.getCurrentMarketPrices('gold');
      expect(prices[0]!.spread).toBe(3.5);
    });

    it('throws when price service fails', async () => {
      const failingPriceService = createMockPriceService();
      (failingPriceService.getMarketPrice as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Service unavailable')
      );
      const service = createService({ priceService: failingPriceService });

      await expect(service.getCurrentMarketPrices('gold')).rejects.toThrow(
        /Failed to get market prices/
      );
    });
  });

  // --------------------------------------------------------------------------
  // calculateFairPrice
  // --------------------------------------------------------------------------

  describe('calculateFairPrice()', () => {
    it('calculates price with all adjustments', async () => {
      const service = createService({ priceService: createMockPriceService(1000) });
      const lot = createMockAssetLot({
        weight: 10,
        purity: 90,
        form: 'refined',
        qualityGrade: 'A',
      });

      const result = await service.calculateFairPrice(lot);

      // basePrice=1000, form=1.0 (refined), purity=0.9, location=1.0, quality=+50
      // pricePerUnit = 1000 * 1.0 * 0.9 * 1.0 + 50 = 950
      // total = 950 * 10 = 9500
      expect(result.basePrice).toBe(1000);
      expect(result.breakdown.formAdjustment).toBe(1.0);
      expect(result.breakdown.purityAdjustment).toBe(0.9);
      expect(result.breakdown.qualityPremium).toBe(50);
      expect(result.breakdown.locationFactor).toBe(1.0);
      expect(result.adjustedPrice).toBe(9500);
      expect(result.currency).toBe('USD');
    });

    it('applies raw form adjustment correctly', async () => {
      const service = createService({ priceService: createMockPriceService(1000) });
      const lot = createMockAssetLot({ weight: 1, form: 'raw', purity: 100, qualityGrade: 'A' });

      const result = await service.calculateFairPrice(lot);

      // 1000 * 0.7 * 1.0 * 1.0 + 50 = 750
      expect(result.breakdown.formAdjustment).toBe(0.7);
      expect(result.adjustedPrice).toBe(750);
    });

    it('handles no purity (defaults to 1.0)', async () => {
      const service = createService({ priceService: createMockPriceService(1000) });
      const lot = createMockAssetLot({
        weight: 1,
        purity: undefined,
        form: 'refined',
        qualityGrade: 'ungraded',
      });

      const result = await service.calculateFairPrice(lot);

      expect(result.breakdown.purityAdjustment).toBe(1.0);
      // 1000 * 1.0 * 1.0 * 1.0 + 0 = 1000
      expect(result.adjustedPrice).toBe(1000);
    });

    it('handles no form (defaults to 1.0)', async () => {
      const service = createService({ priceService: createMockPriceService(1000) });
      const lot = createMockAssetLot({
        weight: 1,
        form: undefined,
        purity: 100,
        qualityGrade: 'ungraded',
      });

      const result = await service.calculateFairPrice(lot);

      expect(result.breakdown.formAdjustment).toBe(1.0);
    });

    it('applies quality premiums correctly for each grade', async () => {
      const service = createService({ priceService: createMockPriceService(1000) });

      const gradeTests: Array<{ grade: AssetLot['qualityGrade']; premium: number }> = [
        { grade: 'A', premium: 50 },
        { grade: 'B', premium: 25 },
        { grade: 'C', premium: 0 },
        { grade: 'D', premium: -25 },
        { grade: 'ungraded', premium: 0 },
      ];

      for (const { grade, premium } of gradeTests) {
        const lot = createMockAssetLot({
          weight: 1,
          qualityGrade: grade,
          purity: 100,
          form: 'refined',
        });
        const result = await service.calculateFairPrice(lot);
        expect(result.breakdown.qualityPremium).toBe(premium);
      }
    });

    it('emits trading.price_calculated event', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });
      const lot = createMockAssetLot();

      await service.calculateFairPrice(lot);

      const events = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls;
      const priceEvent = events.find((call) => call[0].type === 'trading.price_calculated');
      expect(priceEvent).toBeDefined();
      expect(priceEvent![0].payload.assetLotId).toBe(lot.id);
    });
  });

  // --------------------------------------------------------------------------
  // findTradingOpportunities
  // --------------------------------------------------------------------------

  describe('findTradingOpportunities()', () => {
    it('validates filter schema and throws on invalid filters', async () => {
      const service = createService();

      await expect(service.findTradingOpportunities({ minPurity: -10 })).rejects.toThrow(
        /Invalid filter criteria/
      );
    });

    it('accepts valid empty filter object', async () => {
      const service = createService();

      const result = await service.findTradingOpportunities({});
      expect(result).toEqual([]);
    });

    it('accepts valid filter with commodity type', async () => {
      const service = createService();

      const result = await service.findTradingOpportunities({ commodityType: 'gold' });
      expect(result).toEqual([]);
    });

    it('accepts filter with multiple criteria', async () => {
      const service = createService();

      const result = await service.findTradingOpportunities({
        commodityType: 'gold',
        minPurity: 50,
        maxPurity: 99,
        minWeight: 10,
        maxWeight: 1000,
        forms: ['nugget', 'dust'],
      });
      expect(result).toEqual([]);
    });

    it('throws on invalid commodity type format in filter', async () => {
      const service = createService();

      await expect(
        service.findTradingOpportunities({ commodityType: 'INVALID-TYPE!' })
      ).rejects.toThrow(/Invalid filter criteria/);
    });
  });

  // --------------------------------------------------------------------------
  // executeTrade
  // --------------------------------------------------------------------------

  describe('executeTrade()', () => {
    it('successfully executes a valid trade', async () => {
      const mockStorage = createMockStorageService();
      const mockCrypto = createMockCryptoService();
      const mockCompliance = createMockComplianceService({ licensesValid: true });
      const service = createService({
        storageService: mockStorage,
        cryptoService: mockCrypto,
        complianceService: mockCompliance,
      });

      const request = createValidTradeRequest();
      const result = await service.executeTrade(request);

      expect(result).toBeDefined();
      expect(result.id).toBeTruthy();
      expect(result.assetLotId).toBe(request.assetLotId);
      expect(result.fromTraderId).toBe(request.sellerId);
      expect(result.toTraderId).toBe(request.buyerId);
      expect(result.quantity).toBe(100);
      expect(result.price).toBe(5000);
      expect(result.currency).toBe('USD');
      expect(result.status).toBe('pending');
      expect(result.cryptoSignature).toBe('mock-tx-signature');
    });

    it('stores the transaction via storage service', async () => {
      const mockStorage = createMockStorageService();
      const service = createService({ storageService: mockStorage });

      await service.executeTrade(createValidTradeRequest());

      expect(mockStorage.saveTransaction).toHaveBeenCalledTimes(1);
    });

    it('calls signTransaction on crypto service', async () => {
      const mockCrypto = createMockCryptoService();
      const service = createService({ cryptoService: mockCrypto });

      await service.executeTrade(createValidTradeRequest());

      expect(mockCrypto.signTransaction).toHaveBeenCalledTimes(1);
      const signedData = (mockCrypto.signTransaction as ReturnType<typeof vi.fn>).mock.calls[0]![0];
      expect(signedData.buyerId).toBeDefined();
      expect(signedData.sellerId).toBeDefined();
      expect(signedData.price).toBe(5000);
    });

    it('throws on invalid request (missing required fields)', async () => {
      const service = createService();

      await expect(service.executeTrade({})).rejects.toThrow(/Invalid trade request/);
    });

    it('throws on invalid request (bad UUID)', async () => {
      const service = createService();

      await expect(
        service.executeTrade(createValidTradeRequest({ buyerId: 'not-uuid' }))
      ).rejects.toThrow(/Invalid trade request/);
    });

    it('checks buyer and seller licenses', async () => {
      const mockCompliance = createMockComplianceService({ licensesValid: true });
      const service = createService({ complianceService: mockCompliance });
      const request = createValidTradeRequest();

      await service.executeTrade(request);

      expect(mockCompliance.validateLicenses).toHaveBeenCalledTimes(2);
      expect(mockCompliance.validateLicenses).toHaveBeenCalledWith(request.buyerId);
      expect(mockCompliance.validateLicenses).toHaveBeenCalledWith(request.sellerId);
    });

    it('throws when buyer license is invalid', async () => {
      const mockCompliance = createMockComplianceService({ licensesValid: false });
      const service = createService({ complianceService: mockCompliance });

      await expect(service.executeTrade(createValidTradeRequest())).rejects.toThrow(
        /License validation failed/
      );
    });

    it('performs enhanced compliance check for high-value transactions', async () => {
      const mockCompliance = createMockComplianceService({
        licensesValid: true,
        complianceIssues: [],
      });
      const service = createService({
        complianceService: mockCompliance,
        config: { highValueThreshold: 1000 },
      });

      const request = createValidTradeRequest({ agreedPrice: 5000 });
      await service.executeTrade(request);

      expect(mockCompliance.checkCompliance).toHaveBeenCalledWith(request.buyerId, 'trader');
    });

    it('does not call checkCompliance for low-value transactions', async () => {
      const mockCompliance = createMockComplianceService({ licensesValid: true });
      const service = createService({
        complianceService: mockCompliance,
        config: { highValueThreshold: 100000 },
      });

      await service.executeTrade(createValidTradeRequest({ agreedPrice: 500 }));

      expect(mockCompliance.checkCompliance).not.toHaveBeenCalled();
    });

    it('throws when high-value compliance check returns issues', async () => {
      const mockCompliance: IComplianceService = {
        validateLicenses: vi.fn().mockResolvedValue(true),
        checkCompliance: vi.fn().mockResolvedValue([{ id: 'issue-1', status: 'violation' }]),
      };
      const service = createService({
        complianceService: mockCompliance,
        config: { highValueThreshold: 1000 },
      });

      await expect(
        service.executeTrade(createValidTradeRequest({ agreedPrice: 5000 }))
      ).rejects.toThrow(/Enhanced compliance check/);
    });

    it('throws when transaction exceeds max value', async () => {
      const service = createService({
        config: { maxTransactionValue: 10000 },
      });

      await expect(
        service.executeTrade(createValidTradeRequest({ agreedPrice: 15000 }))
      ).rejects.toThrow(/exceeds maximum/);
    });

    it('emits trade_initiated and trade_executed events on success', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });

      await service.executeTrade(createValidTradeRequest());

      const eventTypes = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.map(
        (call) => call[0].type
      );
      expect(eventTypes).toContain('trading.trade_initiated');
      expect(eventTypes).toContain('trading.trade_executed');
    });

    it('emits trade_failed event on validation failure', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });

      await expect(service.executeTrade({})).rejects.toThrow();

      const eventTypes = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.map(
        (call) => call[0].type
      );
      expect(eventTypes).toContain('trading.trade_failed');
    });

    it('emits trade_failed event on license failure', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({
        eventEmitter: emitter,
        complianceService: createMockComplianceService({ licensesValid: false }),
      });

      await expect(service.executeTrade(createValidTradeRequest())).rejects.toThrow();

      const eventTypes = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.map(
        (call) => call[0].type
      );
      expect(eventTypes).toContain('trading.trade_failed');
    });

    it('includes payment method and notes in transaction metadata', async () => {
      const mockStorage = createMockStorageService();
      const service = createService({ storageService: mockStorage });

      await service.executeTrade(
        createValidTradeRequest({
          paymentMethod: 'mobile_money',
          notes: 'Urgent delivery',
        })
      );

      const savedTx = (mockStorage.saveTransaction as ReturnType<typeof vi.fn>).mock.calls[0]![0];
      expect(savedTx.metadata.paymentMethod).toBe('mobile_money');
      expect(savedTx.metadata.notes).toBe('Urgent delivery');
    });
  });

  // --------------------------------------------------------------------------
  // getTradeAnalytics
  // --------------------------------------------------------------------------

  describe('getTradeAnalytics()', () => {
    it('returns analytics structure with default period', async () => {
      const service = createService();

      const analytics = await service.getTradeAnalytics('gold');

      expect(analytics).toBeDefined();
      expect(analytics.totalVolume).toBe(0);
      expect(analytics.averagePrice).toBe(0);
      expect(analytics.currency).toBe('USD');
      expect(analytics.marketTrend).toBe('neutral');
      expect(analytics.riskAssessment).toBe('medium');
      expect(analytics.recommendations).toEqual([]);
    });

    it('returns analytics for specified period', async () => {
      const service = createService();

      const analytics = await service.getTradeAnalytics('gold', '30d');

      expect(analytics).toBeDefined();
      expect(analytics.priceChangePeriod).toBe('30d');
    });

    it('uses configured currency', async () => {
      const service = createService({ config: { defaultCurrency: 'EUR' } });

      const analytics = await service.getTradeAnalytics('gold');

      expect(analytics.currency).toBe('EUR');
    });

    it('returns volumeUnit as "unit" when no transactions', async () => {
      const service = createService();

      const analytics = await service.getTradeAnalytics('gold');

      expect(analytics.volumeUnit).toBe('unit');
    });
  });

  // --------------------------------------------------------------------------
  // null-object defaults
  // --------------------------------------------------------------------------

  describe('null-object defaults', () => {
    it('works without eventEmitter, metricsCollector, operationLogger, traderRepository, or transactionRepository', async () => {
      const service = new TradingService(
        {
          priceService: createMockPriceService(),
          complianceService: createMockComplianceService(),
          cryptoService: createMockCryptoService(),
          storageService: createMockStorageService(),
        },
        {}
      );

      const prices = await service.getCurrentMarketPrices('gold');

      expect(prices).toHaveLength(1);
      expect(prices[0]!.basePrice).toBe(1800);
    });
  });

  // --------------------------------------------------------------------------
  // event payload verification
  // --------------------------------------------------------------------------

  describe('event payload verification', () => {
    it('trading.trade_executed event has transactionId, quantity, and price', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });

      await service.executeTrade(createValidTradeRequest());

      const executedEvent = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0].type === 'trading.trade_executed'
      );
      expect(executedEvent).toBeDefined();

      const payload = executedEvent![0].payload;
      expect(payload).toHaveProperty('transactionId');
      expect(payload).toHaveProperty('quantity');
      expect(payload).toHaveProperty('price');
    });
  });

  // --------------------------------------------------------------------------
  // Crypto failure paths
  // --------------------------------------------------------------------------

  describe('Crypto failure paths', () => {
    it('signTransaction throwing propagates error from executeTrade', async () => {
      const crypto = createMockCryptoService();
      (crypto.signTransaction as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('HSM unavailable')
      );

      const service = createService({ cryptoService: crypto });

      await expect(service.executeTrade(createValidTradeRequest())).rejects.toThrow(
        'HSM unavailable'
      );
      expect(crypto.signTransaction).toHaveBeenCalled();
    });

    it('verify returning false rejects trade when used in compliance check', async () => {
      const crypto = createMockCryptoService();
      (crypto.verify as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      // Compliance service that uses crypto.verify to validate licenses
      const compliance = createMockComplianceService();
      (compliance.validateLicenses as ReturnType<typeof vi.fn>).mockImplementation(
        async (_traderId: string) => {
          const valid = await crypto.verify('license-data', 'sig');
          return valid;
        }
      );

      const service = createService({
        cryptoService: crypto,
        complianceService: compliance,
      });

      await expect(service.executeTrade(createValidTradeRequest())).rejects.toThrow(
        'License validation failed'
      );
      expect(crypto.verify).toHaveBeenCalled();
    });

    it('createHash returning unexpected value does not affect executeTrade', async () => {
      const crypto = createMockCryptoService();
      (crypto.createHash as ReturnType<typeof vi.fn>).mockResolvedValue('unexpected-hash-value');

      const service = createService({ cryptoService: crypto });
      const request = createValidTradeRequest();

      // executeTrade does not call createHash directly; signTransaction is the crypto entry point
      // So an unexpected hash should not interfere with trade execution
      const result = await service.executeTrade(request);

      expect(result).toBeDefined();
      expect(result.cryptoSignature).toBe('mock-tx-signature');
    });
  });
});

// ============================================================================
// REPOSITORY DI
// ============================================================================

describe('Repository DI: ITraderRepository + ITransactionRepository', () => {
  it('getTraderInfo delegates to trader repository when provided', async () => {
    const mockTrader: Trader = {
      id: 't1',
      licenseNumber: 'LIC-001',
      name: 'Test Trader',
      location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
      verificationLevel: 'enhanced',
    };

    const traderRepo: ITraderRepository = {
      getTrader: vi.fn().mockResolvedValue(mockTrader),
      getAvailableLots: vi.fn().mockResolvedValue([]),
    };

    const service = new TradingService(
      {
        priceService: createMockPriceService(),
        complianceService: createMockComplianceService(),
        cryptoService: createMockCryptoService(),
        storageService: createMockStorageService(),
        traderRepository: traderRepo,
      },
      {}
    );

    // findTradingOpportunities calls getAvailableAssetLots, which delegates to repo
    await service.findTradingOpportunities({
      commodityType: 'gold',
      traderId: 't1',
    });
    // The repo was called for available lots
    expect(traderRepo.getAvailableLots).toHaveBeenCalled();
  });

  it('falls back to empty when no trader repository', async () => {
    const service = createService();
    const opportunities = await service.findTradingOpportunities({
      commodityType: 'gold',
      traderId: 't1',
    });
    expect(opportunities).toEqual([]);
  });

  describe('no-repository fallback behavior', () => {
    it('returns zero-volume analytics when no transaction repo', async () => {
      const service = createService();
      const analytics = await service.getTradeAnalytics('gold', '7d');
      expect(analytics.totalVolume).toBe(0);
      expect(analytics.averagePrice).toBe(0);
      expect(analytics.marketTrend).toBe('neutral');
    });

    it('returns zero-volume analytics for all period options', async () => {
      const service = createService();
      for (const period of ['24h', '7d', '30d', '90d'] as const) {
        const analytics = await service.getTradeAnalytics('gold', period);
        expect(analytics.totalVolume).toBe(0);
        expect(analytics.priceChangePeriod).toBe(period);
      }
    });

    it('executes trade using unknown trader fallback when no trader repo', async () => {
      const storage = createMockStorageService();
      storage.getAssetLot = vi.fn().mockResolvedValue(createMockAssetLot());
      const service = createService({ storageService: storage });
      const request = {
        assetLotId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        buyerId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
        sellerId: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
        quantity: 50,
        agreedPrice: 5000,
        currency: 'USD',
        paymentMethod: 'bank_transfer' as const,
        location: {
          latitude: 5.6037,
          longitude: -0.187,
          accuracy: 5,
          timestamp: Date.now(),
        },
      };
      const tx = await service.executeTrade(request);
      expect(tx.id).toBeDefined();
      expect(tx.status).toBe('pending');
    });
  });
});
