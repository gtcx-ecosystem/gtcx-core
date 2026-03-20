/**
 * Repository interfaces for @gtcx/services
 *
 * These decouple services from storage backends. Pass concrete
 * implementations to service constructors to wire real data access.
 * When no repository is provided, services fall back to their default
 * stub behavior (returns [], undefined, etc.).
 */

import type { AssetLot, ComplianceRecord, Location, Transaction, Trader } from '@gtcx/domain';

import type { ComplianceCheckResult } from './compliance';

// ============================================================================
// COMPLIANCE REPOSITORY
// ============================================================================

export interface ComplianceRecordFilter {
  entityId?: string;
  entityType?: 'trader' | 'producer' | 'asset_lot' | 'transaction';
  dateFrom?: string;
  dateTo?: string;
  apps?: string[];
  categories?: string[];
  severity?: string[];
}

export interface IComplianceRepository {
  getRecords(entityId?: string, entityType?: string): Promise<ComplianceRecord[]>;
  checkLicense(id: string, type: 'producer' | 'trader'): Promise<ComplianceCheckResult>;
  checkLocation(location: Location): Promise<ComplianceCheckResult>;
  checkKYC(transaction: Transaction): Promise<ComplianceCheckResult>;
}

// ============================================================================
// TRADER REPOSITORY
// ============================================================================

export interface ITraderRepository {
  getTrader(id: string): Promise<Trader | undefined>;
  getAvailableLots(filters?: Record<string, unknown>): Promise<AssetLot[]>;
}

// ============================================================================
// TRANSACTION REPOSITORY
// ============================================================================

export interface ITransactionRepository {
  getHistory(commodityType: string, period: string): Promise<Transaction[]>;
}
