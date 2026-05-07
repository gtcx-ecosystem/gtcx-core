/**
 * Trade execution helpers — proof generation and transaction building.
 */

import { randomUUID } from 'node:crypto';

import type { ICryptoService, TradeRequestInput, Transaction } from '@gtcx/domain';

/** Generate a cryptographic proof for the trade. */
export async function generateTradeProof(
  validRequest: TradeRequestInput,
  cryptoService: ICryptoService
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
  return cryptoService.signTransaction(transactionData);
}

/** Construct a Transaction object from the validated request and crypto proof. */
export function buildTransaction(
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

/** Generate a unique transaction identifier. */
export function generateTransactionId(): string {
  return `tx_${Date.now()}_${randomUUID()}`;
}
