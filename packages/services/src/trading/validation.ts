/**
 * Trade request validation and compliance checks.
 */

import {
  DomainEventFactory,
  TradeRequestSchema,
  safeParse,
  type IDomainEventEmitter,
  type IComplianceService,
  type TradeRequestInput,
} from '@gtcx/domain';

import type { TradingConfig } from './config';
import { LicenseValidationError, ComplianceError, MaxValueError, ValidationError } from './errors';

/** Validate and parse a trade request. Emits trade_failed on invalid input. */
export function validateTradeRequest(
  request: unknown,
  correlationId: string,
  eventEmitter: IDomainEventEmitter,
  eventFactory: DomainEventFactory
): TradeRequestInput {
  const requestResult = safeParse(TradeRequestSchema, request);
  if (!requestResult.success) {
    const messages = requestResult.error.errors.map((issue) => issue.message);
    const reqRecord =
      request != null && typeof request === 'object' ? (request as Record<string, unknown>) : {};
    eventEmitter.emit(
      eventFactory.trading(
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
    throw new ValidationError(`Invalid trade request: ${messages.join(', ')}`);
  }
  return requestResult.data;
}

/** Run license validation, compliance, and max-value checks. */
export async function performTradeChecks(
  validRequest: TradeRequestInput,
  correlationId: string,
  config: TradingConfig,
  complianceService: IComplianceService,
  eventEmitter: IDomainEventEmitter,
  eventFactory: DomainEventFactory
): Promise<void> {
  const buyerLicenseValid = await complianceService.validateLicenses(validRequest.buyerId);
  const sellerLicenseValid = await complianceService.validateLicenses(validRequest.sellerId);

  if (!buyerLicenseValid || !sellerLicenseValid) {
    eventEmitter.emit(
      eventFactory.trading(
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

  if (validRequest.agreedPrice > config.highValueThreshold) {
    const complianceCheck = await complianceService.checkCompliance(validRequest.buyerId, 'trader');
    if (!complianceCheck || complianceCheck.length > 0) {
      eventEmitter.emit(
        eventFactory.trading(
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

  if (config.maxTransactionValue && validRequest.agreedPrice > config.maxTransactionValue) {
    eventEmitter.emit(
      eventFactory.trading(
        'trading.trade_failed',
        {
          assetLotId: validRequest.assetLotId,
          buyerId: validRequest.buyerId,
          error: `Transaction exceeds maximum value of ${config.maxTransactionValue}`,
          reason: 'validation',
        },
        correlationId
      )
    );
    throw new MaxValueError('Transaction exceeds maximum allowed value');
  }
}
