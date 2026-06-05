import type { ZKProof } from '@gtcx/crypto';
import type { Location } from '@gtcx/domain';

export type { Location } from '@gtcx/domain';

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class ValidationError extends Error {
  readonly service: string;
  constructor(message: string, options?: { cause?: unknown; service?: string }) {
    super(message, options);
    this.name = 'ValidationError';
    this.service = options?.service ?? 'compliance';
  }
}

export const ComplianceValidationError = ValidationError;

export class ComplianceServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ComplianceServiceError';
  }
}

// ============================================================================
// CONFIG
// ============================================================================

export interface ComplianceConfig {
  defaultJurisdiction: string;
  supportedCommodities: string[];
  highValueThreshold: number;
  defaultCurrency: string;
  frameworks?: RegulatoryFramework[] | undefined;
}

export const DEFAULT_CONFIG: ComplianceConfig = {
  defaultJurisdiction: 'international',
  supportedCommodities: [],
  highValueThreshold: 10000,
  defaultCurrency: 'USD',
};

export function toErrorCause(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

// ============================================================================
// RESULT TYPES
// ============================================================================

export interface ComplianceCheckResult {
  compliant: boolean;
  issue?: string;
  details?: Record<string, unknown>;
}

export interface ComplianceReportSummary {
  totalRecords: number;
  compliantRecords: number;
  violations: number;
  warnings: number;
  pendingReviews: number;
}

export interface ComplianceReport {
  report: {
    summary: ComplianceReportSummary;
    breakdown: Record<string, unknown>;
    recommendations: string[];
    actionItems: unknown[];
  };
  metadata: {
    generatedAt: string;
    recordCount: number;
    complianceScore: number;
    criticalIssues: number;
  };
}

export interface ComplianceDashboard {
  overview: {
    totalRecords: number;
    compliantPercentage: number;
    pendingIssues: number;
    criticalViolations: number;
    complianceScore: number;
    trendDirection: 'improving' | 'declining' | 'stable';
  };
  byCategory: Record<
    string,
    { total: number; compliant: number; violations: number; trend: 'up' | 'down' | 'stable' }
  >;
  urgentActions: ComplianceRecord[];
  recentActivity: ComplianceRecord[];
  upcomingDeadlines: { record: ComplianceRecord; daysRemaining: number }[];
}

// ============================================================================
// REGULATORY FRAMEWORK TYPES
// ============================================================================

export interface RegulatoryRequirement {
  id: string;
  code: string;
  title: string;
  description: string;
  mandatory: boolean;
  applicableTo: string[];
  verificationMethod: string;
  renewalPeriod?: string;
  jurisdiction?: string;
}

export interface RegulatoryPenalty {
  violation: string;
  penalty: string;
}

export interface RegulatoryFramework {
  code: string;
  title: string;
  description: string;
  authority: RegulatoryAuthority;
  category: ComplianceCategory;
  jurisdiction: string;
  requirements: RegulatoryRequirement[];
  penalties: RegulatoryPenalty[];
  effectiveDate: string;
  lastUpdated: string;
}

// ============================================================================
// COMPLIANCE RECORD TYPES
// ============================================================================

export type ComplianceStatus = 'compliant' | 'violation' | 'warning' | 'pending_review';
export type ComplianceSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ComplianceCategory = 'licensing' | 'environmental' | 'financial' | 'operational';
export type RegulatoryAuthority = string;

export interface ComplianceRecord {
  id: string;
  type: string;
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  sourceApp: string;
  sourceEntityId: string;
  sourceEntityType: 'asset_lot' | 'transaction' | 'trader' | 'producer';
  regulation: {
    code: string;
    title: string;
    description: string;
    authority: RegulatoryAuthority;
    category: ComplianceCategory;
    jurisdiction?: string | undefined;
  };
  finding: {
    description: string;
    location?: Location | undefined;
    timestamp: string;
    reportedBy: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    tags: string[];
    priority: number;
    references: string[];
  };
  resolution?: {
    status?: string;
    dueDate?: string;
    assignedTo?: string;
  };
}

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface AssetLot {
  id: string;
  producerId: string;
  discoveryLocation: Location;
  cryptoProof?: unknown;
  certificateId?: string;
  metadata?: Record<string, unknown>;
}

export interface Transaction {
  id: string;
  fromTraderId: string;
  toTraderId: string;
  price: number;
  location?: Location;
  metadata?: Record<string, unknown>;
}

export interface ValidatedComplianceReportOptions {
  dateRange: { start: string; end: string };
  format: string;
  apps?: string[] | undefined;
  categories?: string[] | undefined;
  severity?: string[] | undefined;
}

// ============================================================================
// SERVICE DEPENDENCY TYPES
// ============================================================================

export interface ICryptoService {
  hash(data: string): string;
  sign(data: string, privateKey: string): string;
  verify(signature: string, data: string, publicKey: string): boolean;
}

export interface IStorageService {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown): Promise<void>;
}

export interface IComplianceRepository {
  getRecords(entityId?: string, entityType?: string): Promise<ComplianceRecord[]>;
  checkLicense(producerId: string, type: 'producer' | 'trader'): Promise<ComplianceCheckResult>;
  checkLocation(location: Location): Promise<ComplianceCheckResult>;
  checkKYC(transaction: Transaction): Promise<ComplianceCheckResult>;
}

export interface IDomainEventEmitter {
  emit(event: unknown): void;
}

export interface IMetricsCollector {
  counter(name: string, value: number, labels?: Record<string, string>): void;
  histogram(name: string, value: number, labels?: Record<string, string>): void;
}

export interface IOperationLogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export interface ZkVerifier {
  verify(proof: ZKProof): Promise<boolean>;
}
