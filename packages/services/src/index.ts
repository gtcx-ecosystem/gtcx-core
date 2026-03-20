/**
 * @gtcx/services
 *
 * Application-level business services for GTCX Protocol.
 * Extracted from @gtcx/domain to separate foundational types from service logic.
 *
 * Services:
 * - AssetLotRegistrationService: Commodity-agnostic asset registration
 * - TradingService: Market pricing, opportunities, trade execution
 * - UnifiedComplianceService: Regulatory compliance monitoring and reporting
 *
 * All services use dependency injection (P4) and import types/schemas from @gtcx/domain.
 *
 * @packageDocumentation
 */

// ============================================================================
// REGISTRATION SERVICE
// ============================================================================

export {
  AssetLotRegistrationService,
  ValidationError,
  type RegistrationConfig,
} from './registration';

// ============================================================================
// TRADING SERVICE
// ============================================================================

export {
  TradingService,
  LicenseValidationError,
  ComplianceError,
  MaxValueError,
  type TradingConfig,
} from './trading';

// ============================================================================
// COMPLIANCE SERVICE
// ============================================================================

export {
  UnifiedComplianceService,
  type ComplianceConfig,
  type ComplianceCheckResult,
} from './compliance';

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export type {
  IComplianceRepository,
  ITraderRepository,
  ITransactionRepository,
  ComplianceRecordFilter,
} from './repositories';
