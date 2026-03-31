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
 * @package @gtcx/services
 */

import { randomUUID } from 'node:crypto';

import {
  DomainEventFactory,
  ServiceMetrics,
  nullEventEmitter,
  nullMetricsCollector,
  nullOperationLogger,
  type IDomainEventEmitter,
  type IMetricsCollector,
  type IOperationLogger,
  TradeRequestSchema,
  TradingConfigSchema,
  TradingOpportunityFilterSchema,
  safeParse,
  type AssetLot,
  type Transaction,
  type Trader,
  type Location,
  type MarketPrice,
  type TradingOpportunity,
  type TradeAnalytics,
  type QualityGrade,
  type ICryptoService,
  type IStorageService,
  type IPriceService,
  type IComplianceService,
  type TradeRequestInput,
} from '@gtcx/domain';

import type { ITraderRepository, ITransactionRepository } from './repositories';

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class LicenseValidationError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'LicenseValidationError';
  }
}

export class ComplianceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ComplianceError';
  }
}

export class MaxValueError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'MaxValueError';
  }
}

function toErrorCause(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface TradingConfig {
  /** Default currency for trades */
  defaultCurrency: string;
  /** Default price spread percentage */
  defaultSpread: number;
  /** Default seller markup percentage */
  sellerMarkup: number;
  /** High value transaction threshold (requires enhanced KYC) */
  highValueThreshold: number;
  /** Maximum transaction value allowed */
  maxTransactionValue?: number;
  /** Allowed payment methods */
  allowedPaymentMethods?: string[];
  /** Market data sources */
  marketSources?: string[];
}

const DEFAULT_CONFIG: TradingConfig = {
  defaultCurrency: 'USD',
  defaultSpread: 2.5,
  sellerMarkup: 5,
  highValueThreshold: 10000,
};

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
  private traderRepo?: ITraderRepository;
  private transactionRepo?: ITransactionRepository;

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

    // Validate config at construction time
    const configResult = safeParse(TradingConfigSchema, config);
    if (!configResult.success) {
      const messages = configResult.error.errors.map((issue) => issue.message);
      throw new Error(`Invalid trading config: ${messages.join(', ')}`);
    }
    this.config = { ...DEFAULT_CONFIG, ...configResult.data };
  }

  // ==========================================================================
  // MARKET PRICES
  // ==========================================================================

  /**
   * Get current market prices for a commodity type
   */
  async getCurrentMarketPrices(commodityType: string, forms?: string[]): Promise<MarketPrice[]> {
    try {
      const basePrice = await this.priceService.getMarketPrice(commodityType);
      const prices: MarketPrice[] = [];

      // If no specific forms requested, return base price
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

      // Calculate form-specific prices
      for (const form of forms) {
        const adjustment = this.getFormPriceAdjustment(form);
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
      throw new Error('Failed to get market prices', { cause: toErrorCause(error) });
    }
  }

  /**
   * Get form-specific price adjustment
   * Override for commodity-specific adjustments
   */
  protected getFormPriceAdjustment(form: string): number {
    // Default adjustments - override in subclasses for commodity-specific logic
    const adjustments: Record<string, number> = {
      raw: 0.7,
      processed: 0.85,
      refined: 1.0,
      premium: 1.1,
    };
    return adjustments[form.toLowerCase()] ?? 0.8;
  }

  // ==========================================================================
  // FAIR PRICE CALCULATION
  // ==========================================================================

  /**
   * Calculate fair price for an asset lot
   */
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
      // Get base market price
      const basePrice = await this.priceService.getMarketPrice(assetLot.commodityType);

      // Calculate adjustments
      const formAdjustment = assetLot.form ? this.getFormPriceAdjustment(assetLot.form) : 1.0;

      const purityAdjustment = this.calculatePurityAdjustment(assetLot.purity);
      const qualityPremium = this.calculateQualityPremium(assetLot);
      const locationFactor = await this.calculateLocationFactor(assetLot.discoveryLocation);

      // Calculate total adjusted price per unit
      const pricePerUnit =
        basePrice * formAdjustment * purityAdjustment * locationFactor + qualityPremium;

      // Total price for the lot
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

      // Emit price calculation event
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
      throw new Error('Failed to calculate fair price', { cause: toErrorCause(error) });
    }
  }

  /**
   * Calculate purity adjustment factor
   */
  protected calculatePurityAdjustment(purity?: number): number {
    if (!purity) return 1.0;
    // Linear adjustment based on purity percentage
    return purity / 100;
  }

  /**
   * Calculate quality premium
   * Override for commodity-specific premiums
   */
  protected calculateQualityPremium(assetLot: AssetLot): number {
    const premiums: Record<QualityGrade, number> = {
      A: 50,
      B: 25,
      C: 0,
      D: -25,
      ungraded: 0,
    };
    return premiums[assetLot.qualityGrade ?? 'ungraded'] ?? 0;
  }

  /**
   * Calculate location-based price factor
   */
  protected async calculateLocationFactor(_location: Location): Promise<number> {
    // Default: no location adjustment
    // Override for region-specific factors (transport costs, local markets, etc.)
    return 1.0;
  }

  // ==========================================================================
  // TRADING OPPORTUNITIES
  // ==========================================================================

  /**
   * Find trading opportunities matching filter criteria
   */
  async findTradingOpportunities(filters: unknown): Promise<TradingOpportunity[]> {
    // Validate filters
    const filterResult = safeParse(TradingOpportunityFilterSchema, filters);
    if (!filterResult.success) {
      const messages = filterResult.error.errors.map((issue) => issue.message);
      throw new Error(`Invalid filter criteria: ${messages.join(', ')}`);
    }

    const validFilters = filterResult.data;

    try {
      // Get all available asset lots (this would come from storage)
      const availableLots = await this.getAvailableAssetLots();

      // Apply filters
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
        if (validFilters.minWeight && lot.weight < validFilters.minWeight) {
          return false;
        }
        if (validFilters.maxWeight && lot.weight > validFilters.maxWeight) {
          return false;
        }
        if (validFilters.forms && lot.form && !validFilters.forms.includes(lot.form)) {
          return false;
        }
        // Location filtering would require geo calculations
        return true;
      });

      // Convert to trading opportunities with pricing
      const opportunities: TradingOpportunity[] = await Promise.all(
        filtered.map(async (lot) => {
          const pricing = await this.calculateFairPrice(lot);
          const seller =
            (await this.getTraderInfo(lot.producerId)) ??
            this.createUnknownTrader(lot.producerId, lot.discoveryLocation);
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

      // Emit event
      this.eventEmitter.emit(
        this.eventFactory.trading('trading.opportunity_found', {
          count: opportunities.length,
          filters: validFilters,
        })
      );

      return opportunities;
    } catch (error) {
      throw new Error('Failed to find trading opportunities', { cause: toErrorCause(error) });
    }
  }

  // ==========================================================================
  // TRADE EXECUTION
  // ==========================================================================

  /**
   * Execute a trade
   */
  async executeTrade(request: unknown): Promise<Transaction> {
    const correlationId = this.generateTransactionId();
    const validRequest = this.validateTradeRequest(request, correlationId);

    // Emit initiation event
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
      await this.performTradeChecks(validRequest, correlationId);

      // Generate cryptographic proof for transaction
      const cryptoProof = await this.generateTradeProof(validRequest, correlationId);

      // Build, store, and emit
      const transaction = this.buildTransaction(validRequest, cryptoProof, correlationId);
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
      // Emit failure if not already emitted by a specific check
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

  /**
   * Validate and parse a trade request. Emits trade_failed on invalid input.
   */
  private validateTradeRequest(request: unknown, correlationId: string): TradeRequestInput {
    const requestResult = safeParse(TradeRequestSchema, request);
    if (!requestResult.success) {
      const messages = requestResult.error.errors.map((issue) => issue.message);
      const reqRecord =
        request != null && typeof request === 'object' ? (request as Record<string, unknown>) : {};
      this.eventEmitter.emit(
        this.eventFactory.trading(
          'trading.trade_failed',
          {
            assetLotId:
              typeof reqRecord['assetLotId'] === 'string' ? reqRecord['assetLotId'] : 'unknown',
            buyerId: typeof reqRecord['buyerId'] === 'string' ? reqRecord['buyerId'] : 'unknown',
            error: `Validation failed: ${messages.join(', ')}`,
            reason: 'validation',
          },
          correlationId
        )
      );
      throw new Error(`Invalid trade request: ${messages.join(', ')}`);
    }
    return requestResult.data;
  }

  /**
   * Run license validation, compliance, and max-value checks.
   * Each check emits trade_failed and throws on failure.
   */
  private async performTradeChecks(
    validRequest: TradeRequestInput,
    correlationId: string
  ): Promise<void> {
    // Validate licenses
    const buyerLicenseValid = await this.complianceService.validateLicenses(validRequest.buyerId);
    const sellerLicenseValid = await this.complianceService.validateLicenses(validRequest.sellerId);

    if (!buyerLicenseValid || !sellerLicenseValid) {
      this.eventEmitter.emit(
        this.eventFactory.trading(
          'trading.trade_failed',
          {
            assetLotId: validRequest.assetLotId,
            buyerId: validRequest.buyerId,
            error: 'License validation failed',
            reason: 'compliance',
          },
          correlationId
        )
      );
      throw new LicenseValidationError('License validation failed for one or more parties');
    }

    // Check for high-value transaction
    if (validRequest.agreedPrice > this.config.highValueThreshold) {
      const complianceCheck = await this.complianceService.checkCompliance(
        validRequest.buyerId,
        'trader'
      );
      if (!complianceCheck || complianceCheck.length > 0) {
        this.eventEmitter.emit(
          this.eventFactory.trading(
            'trading.trade_failed',
            {
              assetLotId: validRequest.assetLotId,
              buyerId: validRequest.buyerId,
              error: 'Enhanced compliance check failed for high-value transaction',
              reason: 'compliance',
            },
            correlationId
          )
        );
        throw new ComplianceError('Enhanced compliance check required for high-value transactions');
      }
    }

    // Check max transaction value
    if (
      this.config.maxTransactionValue &&
      validRequest.agreedPrice > this.config.maxTransactionValue
    ) {
      this.eventEmitter.emit(
        this.eventFactory.trading(
          'trading.trade_failed',
          {
            assetLotId: validRequest.assetLotId,
            buyerId: validRequest.buyerId,
            error: `Transaction exceeds maximum value of ${this.config.maxTransactionValue}`,
            reason: 'validation',
          },
          correlationId
        )
      );
      throw new MaxValueError(`Transaction exceeds maximum allowed value`);
    }
  }

  /**
   * Generate a cryptographic proof for the trade.
   */
  private async generateTradeProof(
    validRequest: TradeRequestInput,
    _correlationId: string
  ): Promise<string> {
    const transactionData = {
      assetLotId: validRequest.assetLotId,
      buyerId: validRequest.buyerId,
      sellerId: validRequest.sellerId,
      quantity: validRequest.quantity,
      price: validRequest.agreedPrice,
      currency: validRequest.currency,
      timestamp: Date.now(),
    };
    return this.cryptoService.signTransaction(transactionData);
  }

  /**
   * Construct a Transaction object from the validated request and crypto proof.
   */
  private buildTransaction(
    validRequest: TradeRequestInput,
    cryptoProof: string,
    correlationId: string
  ): Transaction {
    return {
      id: correlationId,
      assetLotId: validRequest.assetLotId,
      fromTraderId: validRequest.sellerId,
      toTraderId: validRequest.buyerId,
      quantity: validRequest.quantity,
      quantityUnit: 'unit',
      price: validRequest.agreedPrice,
      currency: validRequest.currency,
      timestamp: new Date().toISOString(),
      location: validRequest.location ?? {
        latitude: 0,
        longitude: 0,
        accuracy: 1,
        timestamp: Date.now(),
      },
      cryptoSignature: cryptoProof,
      status: 'pending',
      metadata: {
        paymentMethod: validRequest.paymentMethod,
        notes: validRequest.notes,
        requestId: validRequest.requestId,
      },
    };
  }

  // ==========================================================================
  // ANALYTICS
  // ==========================================================================

  /**
   * Get trade analytics for a commodity type
   */
  async getTradeAnalytics(
    commodityType: string,
    period: '24h' | '7d' | '30d' | '90d' = '7d'
  ): Promise<TradeAnalytics> {
    try {
      const transactions = await this.getTransactionHistory(commodityType, period);

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
      throw new Error('Failed to get trade analytics', { cause: toErrorCause(error) });
    }
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  protected createUnknownTrader(traderId: string, location: Location): Trader {
    return {
      id: traderId,
      licenseNumber: 'unknown',
      name: 'Unknown Trader',
      location,
      verificationLevel: 'basic',
      roles: ['producer'],
    };
  }

  protected generateTransactionId(): string {
    return `tx_${Date.now()}_${randomUUID()}`;
  }

  protected async getAvailableAssetLots(): Promise<AssetLot[]> {
    if (this.traderRepo) return this.traderRepo.getAvailableLots();
    return [];
  }

  protected async getTraderInfo(traderId: string): Promise<Trader | undefined> {
    if (this.traderRepo) return this.traderRepo.getTrader(traderId);
    return undefined;
  }

  protected async getTransactionHistory(
    commodityType: string,
    period: string
  ): Promise<Transaction[]> {
    if (this.transactionRepo) return this.transactionRepo.getHistory(commodityType, period);
    return [];
  }
}
