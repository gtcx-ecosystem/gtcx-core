/**
 * Trading service helper functions.
 */

import type { AssetLot, Location, Trader, Transaction } from '@gtcx/domain';

import type { ITraderRepository, ITransactionRepository } from '../repositories';

/** Create a placeholder trader for unknown IDs. */
export function createUnknownTrader(traderId: string, location: Location): Trader {
  return {
    id: traderId,
    licenseNumber: 'unknown',
    name: 'Unknown Trader',
    location,
    verificationLevel: 'basic',
    roles: ['producer'],
  };
}

/** Retrieve available asset lots via the trader repository. */
export async function getAvailableAssetLots(traderRepo?: ITraderRepository): Promise<AssetLot[]> {
  if (traderRepo) return traderRepo.getAvailableLots();
  return [];
}

/** Retrieve trader info via the trader repository. */
export async function getTraderInfo(
  traderId: string,
  traderRepo?: ITraderRepository
): Promise<Trader | undefined> {
  if (traderRepo) return traderRepo.getTrader(traderId);
  return undefined;
}

/** Retrieve transaction history via the transaction repository. */
export async function getTransactionHistory(
  commodityType: string,
  period: string,
  transactionRepo?: ITransactionRepository
): Promise<Transaction[]> {
  if (transactionRepo) return transactionRepo.getHistory(commodityType, period);
  return [];
}
