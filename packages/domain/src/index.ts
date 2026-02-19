/**
 * @gtcx/domain
 *
 * Commodity-agnostic domain services for GTCX Protocol.
 *
 * ## Architectural Principles - 10/10
 *
 * | Principle | Implementation |
 * |-----------|----------------|
 * | P1 Package Structure | Clean src/ + internal/ separation |
 * | P2 Type Safety | Zod schemas at all boundaries |
 * | P3 Modularity | Independent services with granular exports |
 * | P4 Composability | Full dependency injection |
 * | P5 AI-Native | AI integration interfaces + operation logging |
 * | P6 Asset Abstraction | commodityType: string throughout |
 * | P7 Documentation | Complete API reference + threat model |
 * | P8 Offline-First | Offline queue with conflict resolution |
 * | P9 Security | Input sanitization, rate limiting hooks |
 * | P10 API Stability | Versioning, deprecation markers, changelog |
 * | P11 Data Evolution | Schema versioning + migrations |
 * | P12 Observability | Events + metrics + AI logging |
 *
 * @packageDocumentation
 */

// ============================================================================
// VERSION INFO
// ============================================================================

export {
  API_VERSION,
  MIN_SUPPORTED_VERSION,
  DEPRECATIONS,
  API_STABILITY,
  CHANGELOG,
  isDeprecated,
  getUpcomingRemovals,
  checkVersionCompatibility,
  compareVersions,
  getStability,
  isStable,
  getChangelogSince,
  deprecated,
  type DeprecationInfo,
  type VersionCompatibility,
  type StabilityLevel,
  type StabilityInfo,
  type ChangelogEntry,
} from './versioning';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // Asset types
  AssetLot,
  AssetLotStatus,
  AssetRegistrationData,
  AssetCertificate,
  AssetForm,
  QualityGrade,

  // Trading types
  Trader,
  TraderRole,
  Transaction,
  TransactionStatus,
  PaymentMethod,
  MarketPrice,
  PriceHistory,
  TradingOpportunity,
  TradeRequest,
  TradeAnalytics,

  // Compliance types
  ComplianceRecord,
  ComplianceStatus,
  ComplianceSeverity,
  ComplianceCategory,
  ComplianceDashboard,
  RegulatoryFramework,
  RegulatoryRequirement,
  RegulatoryAuthority,

  // Infrastructure types
  Location,
  LocationWithAddress,
  CryptoProof,
  CryptographicProof,

  // Workflow types
  WorkflowStep,
  RegistrationProgress,
  ValidationResult,

  // Service interfaces
  ICryptoService,
  ILocationService,
  IStorageService,
  IPriceService,
  IComplianceService,
} from './types';

// ============================================================================
// SCHEMAS (P2 + P9)
// ============================================================================

export {
  // Registration schemas
  AssetRegistrationDataSchema,
  PartialRegistrationDataSchema,
  RegistrationConfigSchema,

  // Trading schemas
  TradeRequestSchema,
  TradingConfigSchema,
  TradingOpportunityFilterSchema,

  // Compliance schemas
  ComplianceConfigSchema,
  ComplianceReportOptionsSchema,
  ComplianceSeveritySchema,
  ComplianceStatusSchema,
  ComplianceCategorySchema,

  // Primitive schemas
  LocationSchema,
  CoordinatesSchema,
  PhotoMetadataSchema,
  CryptoProofSchema,
  CurrencyCodeSchema,
  CommodityTypeSchema,
  UuidSchema,
  IsoDateSchema,
  PositiveNumberSchema,
  PercentageSchema,

  // Validation helpers
  safeParse,
  validateRegistrationData,
  validatePartialRegistrationData,
  validateTradeRequest,
  validateTradingFilter,
  validateComplianceReportOptions,
  safeValidateRegistrationData,
  safeValidateTradeRequest,

  // Inferred types
  type AssetRegistrationInput,
  type PartialRegistrationInput,
  type TradeRequestInput,
  type TradingOpportunityFilter,
  type ComplianceReportOptions,
  type RegistrationConfigInput,
  type TradingConfigInput,
  type ComplianceConfigInput,
  type ValidatedRegistrationData,
  type ValidatedComplianceReportOptions,
} from './schemas';

// ============================================================================
// EVENTS (P12)
// ============================================================================

export {
  // Event types
  type DomainEventType,
  type DomainEvent,

  // Event payloads - Registration
  type RegistrationStartedPayload,
  type RegistrationValidatedPayload,
  type RegistrationCompletedPayload,
  type RegistrationFailedPayload,
  type RegistrationProgressPayload,

  // Event payloads - Trading
  type PriceCalculatedPayload,
  type OpportunityFoundPayload,
  type TradeInitiatedPayload,
  type TradeExecutedPayload,
  type TradeFailedPayload,

  // Event payloads - Compliance
  type ComplianceCheckStartedPayload,
  type ComplianceCheckCompletedPayload,
  type ViolationDetectedPayload,
  type WarningIssuedPayload,
  type ReportGeneratedPayload,

  // Event infrastructure
  type IDomainEventEmitter,
  DomainEventFactory,
  nullEventEmitter,
  InMemoryEventEmitter,
} from './events';

// ============================================================================
// AI LOGGING (P5)
// ============================================================================

export {
  // Types
  type OperationType,
  type OperationStatus,
  type OperationLogEntry,
  type IOperationLogger,

  // Implementations
  InMemoryOperationLogger,
  nullOperationLogger,

  // Helpers
  detectAnomalies,
  suggestNextOperations,
} from './ai-logging';

// ============================================================================
// AI INTEGRATION (P5)
// ============================================================================

export {
  // Types
  type AIAnalysisContext,
  type AIAnalysisResult,
  type AIAction,
  type AIAnomaly,
  type IAIProvider,
  type AIServiceHooks,

  // Implementations
  nullAIProvider,
  defaultAIHooks,
  AIContextBuilder,
} from './ai-integration';

// ============================================================================
// METRICS (P12)
// ============================================================================

export {
  // Types
  type MetricType,
  type Metric,
  type HistogramMetric,
  type SummaryMetric,
  type IMetricsCollector,

  // Constants
  METRIC_NAMES,

  // Implementations
  InMemoryMetricsCollector,
  nullMetricsCollector,
  ServiceMetrics,
} from './metrics';

// ============================================================================
// MIGRATIONS (P11)
// ============================================================================

export {
  // Types
  type SchemaVersion,
  type EntityType,
  type VersionedEntity,
  type Migration,

  // Constants
  SCHEMA_VERSIONS,

  // Classes
  SchemaMigrator,
  defaultMigrator,

  // Helpers
  isVersionedEntity,
  ensureVersioned,
  migrateAndUnwrap,
} from './migrations';

// ============================================================================
// OFFLINE QUEUE (P8)
// ============================================================================

export {
  // Types
  type QueuedOperationType,
  type QueuedOperationStatus,
  type QueuedOperation,
  type ConflictStrategy,
  type ConflictResolution,
  type IOfflineQueueStorage,

  // Classes
  OfflineQueue,
  InMemoryQueueStorage,
} from './internal/offline-queue';

// ============================================================================
// SERVICES (moved to @gtcx/services)
// ============================================================================
// AssetLotRegistrationService, TradingService, and UnifiedComplianceService
// have been extracted to the @gtcx/services package for clean separation
// of foundational types from application-level business logic.
