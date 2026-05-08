/**
 * Trading Service
 *
 * Commodity-agnostic business logic for trading operations and market analysis.
 * Supports any commodity type with configurable market sources and currencies.
 *
 * Features:
 * - Runtime validation via Zod schemas (P2, P9)
 * - Event emission for observability (P12)
 * - Dependency injection for all externals (P4)
 * - Offline-first compatible (P8)
 *
 * Package: @gtcx/services
 */

import {
  DomainEventFactory,
  ServiceMetrics,
  nullEventEmitter,
  nullMetricsCollector,
  nullOperationLogger,
  type IDomainEventEmitter,
  type IMetricsCollector,
  type IOperationLogger,
  TradingConfigSchema,
  TradingOpportunityFilterSchema,
  safeParse,
  type AssetLot,
  type Transaction,
  type MarketPrice,
  type TradingOpportunity,
  type TradeAnalytics,
  type ICryptoService,
  type IStorageService,
  type IPriceService,
  type IComplianceService,
} from '@gtcx/domain';

import type { ITraderRepository, ITransactionRepository } from './repositories';
import { DEFAULT_CONFIG, type TradingConfig } from './trading/config';
import {
  LicenseValidationError,
  ComplianceError,
  MaxValueError,
  ValidationError,
  TradingError,
  toErrorCause,
} from './trading/errors';
import { generateTradeProof, buildTransaction, generateTransactionId } from './trading/execution';
import {
  createUnknownTrader,
  getAvailableAssetLots,
  getTraderInfo,
  getTransactionHistory,
} from './trading/helpers';
import {
  getFormPriceAdjustment,
  calculatePurityAdjustment,
  calculateQualityPremium,
  calculateLocationFactor,
} from './trading/pricing';
import { validateTradeRequest, performTradeChecks } from './trading/validation';

export { LicenseValidationError, ComplianceError, MaxValueError };
export type { TradingConfig };

// ============================================================================
// TRADING SERVICE
// ============================================================================

export class TradingService {
  private priceService: IPriceService;
  private complianceService: IComplianceService;
  private cryptoService: ICryptoService;
  private storageService: IStorageService;
  private eventEmitter: IDomainEventEmitter;
  private metrics: ServiceMetrics;
  private operationLogger: IOperationLogger;
  private eventFactory: DomainEventFactory;
  private config: TradingConfig;
  private traderRepo?: ITraderRepository | undefined;
  private transactionRepo?: ITransactionRepository | undefined;

  constructor(
    dependencies: {
      priceService: IPriceService;
      complianceService: IComplianceService;
      cryptoService: ICryptoService;
      storageService: IStorageService;
      eventEmitter?: IDomainEventEmitter;
      metricsCollector?: IMetricsCollector;
      operationLogger?: IOperationLogger;
      traderRepository?: ITraderRepository;
      transactionRepository?: ITransactionRepository;
    },
    config: Partial<TradingConfig> = {}
  ) {
    this.priceService = dependencies.priceService;
    this.complianceService = dependencies.complianceService;
    this.cryptoService = dependencies.cryptoService;
    this.storageService = dependencies.storageService;
    this.eventEmitter = dependencies.eventEmitter || nullEventEmitter;
    this.metrics = new ServiceMetrics(
      dependencies.metricsCollector || nullMetricsCollector,
      'trading'
    );
    this.operationLogger = dependencies.operationLogger || nullOperationLogger;
    this.eventFactory = new DomainEventFactory();
    this.traderRepo = dependencies.traderRepository;
    this.transactionRepo = dependencies.transactionRepository;

    const configResult = safeParse(TradingConfigSchema, config);
    if (!configResult.success) {
      const messages = configResult.error.errors.map((issue) => issue.message);
      throw new ValidationError(`Invalid trading config: ${messages.join(', ')}`);
    }
    this.config = { ...DEFAULT_CONFIG, ...configResult.data } as TradingConfig;
  }

  // ==========================================================================
  // MARKET PRICES
  // ==========================================================================

  async getCurrentMarketPrices(commodityType: string, forms?: string[]): Promise<MarketPrice[]> {
    try {
      const basePrice = await this.priceService.getMarketPrice(commodityType);
      const prices: MarketPrice[] = [];

      if (!forms || forms.length === 0) {
        prices.push({
          commodityType,
          basePrice,
          currency: this.config.defaultCurrency,
          timestamp: new Date().toISOString(),
          source: 'market',
          spread: this.config.defaultSpread,
        });
        return prices;
      }

      for (const form of forms) {
        const adjustment = getFormPriceAdjustment(form);
        prices.push({
          commodityType,
          assetForm: form,
          basePrice: basePrice * adjustment,
          currency: this.config.defaultCurrency,
          timestamp: new Date().toISOString(),
          source: 'market',
          spread: this.config.defaultSpread,
        });
      }

      return prices;
    } catch (error) {
      throw new TradingError('Failed to get market prices', { cause: toErrorCause(error) });
    }
  }

  // ==========================================================================
  // FAIR PRICE CALCULATION
  // ==========================================================================

  async calculateFairPrice(assetLot: AssetLot): Promise<{
    basePrice: number;
    adjustedPrice: number;
    currency: string;
    breakdown: {
      formAdjustment: number;
      purityAdjustment: number;
      qualityPremium: number;
      locationFactor: number;
      total: number;
    };
  }> {
    try {
      const basePrice = await this.priceService.getMarketPrice(assetLot.commodityType);
      const formAdjustment = assetLot.form ? getFormPriceAdjustment(assetLot.form) : 1.0;
      const purityAdjustment = calculatePurityAdjustment(assetLot.purity);
      const qualityPremium = calculateQualityPremium(assetLot);
      const locationFactor = await calculateLocationFactor(assetLot.discoveryLocation);

      const pricePerUnit =
        basePrice * formAdjustment * purityAdjustment * locationFactor + qualityPremium;
      const totalPrice = pricePerUnit * assetLot.weight;

      const result = {
        basePrice,
        adjustedPrice: totalPrice,
        currency: this.config.defaultCurrency,
        breakdown: {
          formAdjustment,
          purityAdjustment,
          qualityPremium,
          locationFactor,
          total: totalPrice,
        },
      };

      this.eventEmitter.emit(
        this.eventFactory.trading('trading.price_calculated', {
          assetLotId: assetLot.id,
          commodityType: assetLot.commodityType,
          basePrice,
          adjustedPrice: totalPrice,
          currency: this.config.defaultCurrency,
          adjustments: {
            form: formAdjustment,
            purity: purityAdjustment,
            quality: qualityPremium,
            location: locationFactor,
          },
        })
      );

      return result;
    } catch (error) {
      throw new TradingError('Failed to calculate fair price', { cause: toErrorCause(error) });
    }
  }

  // ==========================================================================
  // TRADING OPPORTUNITIES
  // ==========================================================================

  async findTradingOpportunities(filters: unknown): Promise<TradingOpportunity[]> {
    const filterResult = safeParse(TradingOpportunityFilterSchema, filters);
    if (!filterResult.success) {
      const messages = filterResult.error.errors.map((issue) => issue.message);
      throw new ValidationError(`Invalid filter criteria: ${messages.join(', ')}`);
    }

    const validFilters = filterResult.data;

    try {
      const availableLots = await getAvailableAssetLots(this.traderRepo);

      const filtered = availableLots.filter((lot) => {
        if (validFilters.commodityType && lot.commodityType !== validFilters.commodityType) {
          return false;
        }
        if (validFilters.minPurity && (!lot.purity || lot.purity < validFilters.minPurity)) {
          return false;
        }
        if (validFilters.maxPurity && lot.purity && lot.purity > validFilters.maxPurity) {
          return false;
        }
        if (validFilters.minWeight && lot.weight < validFilters.minWeight) return false;
        if (validFilters.maxWeight && lot.weight > validFilters.maxWeight) return false;
        if (validFilters.forms && lot.form && !validFilters.forms.includes(lot.form)) {
          return false;
        }
        return true;
      });

      const opportunities: TradingOpportunity[] = await Promise.all(
        filtered.map(async (lot) => {
          const pricing = await this.calculateFairPrice(lot);
          const seller =
            (await getTraderInfo(lot.producerId, this.traderRepo)) ??
            createUnknownTrader(lot.producerId, lot.discoveryLocation);
          return {
            id: `opp_${lot.id}`,
            assetLotId: lot.id,
            assetLot: lot,
            seller,
            askPrice: pricing.adjustedPrice * (1 + this.config.sellerMarkup / 100),
            currency: this.config.defaultCurrency,
            location: lot.discoveryLocation,
            availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            minQuantity: lot.weight,
            maxQuantity: lot.weight,
            qualityGrade: lot.qualityGrade ?? 'ungraded',
            verificationLevel: seller.verificationLevel,
            complianceStatus: 'pending',
          };
        })
      );

      this.eventEmitter.emit(
        this.eventFactory.trading('trading.opportunity_found', {
          count: opportunities.length,
          filters: validFilters,
        })
      );

      return opportunities;
    } catch (error) {
      throw new TradingError('Failed to find trading opportunities', {
        cause: toErrorCause(error),
      });
    }
  }

  // ==========================================================================
  // TRADE EXECUTION
  // ==========================================================================

  async executeTrade(request: unknown): Promise<Transaction> {
    const correlationId = generateTransactionId();
    const validRequest = validateTradeRequest(
      request,
      correlationId,
      this.eventEmitter,
      this.eventFactory
    );

    this.eventEmitter.emit(
      this.eventFactory.trading(
        'trading.trade_initiated',
        {
          assetLotId: validRequest.assetLotId,
          buyerId: validRequest.buyerId,
          amount: validRequest.agreedPrice,
        },
        correlationId
      )
    );

    try {
      await performTradeChecks(
        validRequest,
        correlationId,
        this.config,
        this.complianceService,
        this.eventEmitter,
        this.eventFactory
      );

      const cryptoProof = await generateTradeProof(validRequest, this.cryptoService);
      const transaction = buildTransaction(validRequest, cryptoProof, correlationId);
      await this.storageService.saveTransaction(transaction);

      this.eventEmitter.emit(
        this.eventFactory.trading(
          'trading.trade_executed',
          {
            transactionId: transaction.id,
            assetLotId: transaction.assetLotId,
            buyerId: transaction.toTraderId,
            sellerId: transaction.fromTraderId,
            quantity: transaction.quantity,
            price: transaction.price,
            currency: transaction.currency,
            paymentMethod: validRequest.paymentMethod,
          },
          correlationId
        )
      );

      return transaction;
    } catch (error: unknown) {
      if (
        !(error instanceof LicenseValidationError) &&
        !(error instanceof ComplianceError) &&
        !(error instanceof MaxValueError)
      ) {
        this.eventEmitter.emit(
          this.eventFactory.trading(
            'trading.trade_failed',
            {
              assetLotId: validRequest.assetLotId,
              buyerId: validRequest.buyerId,
              error: error instanceof Error ? error.message : 'Unknown error',
              reason: 'system_error',
            },
            correlationId
          )
        );
      }
      throw error;
    }
  }

  // ==========================================================================
  // ANALYTICS
  // ==========================================================================

  async getTradeAnalytics(
    commodityType: string,
    period: '24h' | '7d' | '30d' | '90d' = '7d'
  ): Promise<TradeAnalytics> {
    try {
      const transactions = await getTransactionHistory(commodityType, period, this.transactionRepo);

      const totalVolume = transactions.reduce((sum, tx) => sum + tx.quantity, 0);
      const totalValue = transactions.reduce((sum, tx) => sum + tx.price, 0);
      const avgPrice = transactions.length > 0 ? totalValue / totalVolume : 0;

      const volumeUnit = transactions[0]?.quantityUnit ?? 'unit';
      return {
        totalVolume,
        volumeUnit,
        averagePrice: avgPrice,
        currency: this.config.defaultCurrency,
        priceChange: 0,
        priceChangePeriod: period,
        marketTrend: 'neutral',
        liquidityScore: 0,
        riskAssessment: 'medium',
        recommendations: [],
      };
    } catch (error) {
      throw new TradingError('Failed to get trade analytics', { cause: toErrorCause(error) });
    }
  }
}
