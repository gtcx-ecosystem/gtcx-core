/**
 * Unified Compliance Service
 *
 * Commodity-agnostic compliance monitoring and reporting.
 * Supports any regulatory framework with configurable requirements,
 * authorities, and jurisdiction-specific rules.
 *
 * Features:
 * - Runtime validation via Zod schemas (P2, P9)
 * - Event emission for observability (P12)
 * - Dependency injection for all externals (P4)
 * - Pluggable regulatory frameworks (P6)
 *
 * @package @gtcx/domain
 */

import { DomainEventFactory, nullEventEmitter, type IDomainEventEmitter } from './events';
import {
  ComplianceConfigSchema,
  ComplianceReportOptionsSchema,
  safeParse,
  type ValidatedComplianceReportOptions,
} from './schemas';
import type {
  AssetLot,
  Transaction,
  Location,
  ComplianceRecord,
  ComplianceStatus,
  ComplianceSeverity,
  ComplianceCategory,
  ComplianceDashboard,
  RegulatoryFramework,
  RegulatoryAuthority,
  ICryptoService,
  IStorageService,
} from './types';

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface ComplianceConfig {
  /** Default jurisdiction for compliance checks */
  defaultJurisdiction: string;
  /** Supported commodity types */
  supportedCommodities: string[];
  /** High-value transaction threshold requiring enhanced checks */
  highValueThreshold: number;
  /** Default currency for threshold calculations */
  defaultCurrency: string;
  /** Regulatory frameworks to apply */
  frameworks?: RegulatoryFramework[];
}

const DEFAULT_CONFIG: ComplianceConfig = {
  defaultJurisdiction: 'international',
  supportedCommodities: ['gold', 'cocoa', 'minerals', 'agricultural'],
  highValueThreshold: 10000,
  defaultCurrency: 'USD',
};

// ============================================================================
// COMPLIANCE CHECK RESULT
// ============================================================================

export interface ComplianceCheckResult {
  compliant: boolean;
  issue?: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// UNIFIED COMPLIANCE SERVICE
// ============================================================================

export class UnifiedComplianceService {
  private storageService: IStorageService;
  private cryptoService: ICryptoService;
  private eventEmitter: IDomainEventEmitter;
  private eventFactory: DomainEventFactory;
  private config: ComplianceConfig;
  private frameworks: RegulatoryFramework[];

  constructor(
    dependencies: {
      storageService: IStorageService;
      cryptoService: ICryptoService;
      eventEmitter?: IDomainEventEmitter;
    },
    config: Partial<ComplianceConfig> = {}
  ) {
    this.storageService = dependencies.storageService;
    this.cryptoService = dependencies.cryptoService;
    this.eventEmitter = dependencies.eventEmitter || nullEventEmitter;
    this.eventFactory = new DomainEventFactory();

    // Validate config
    const configResult = safeParse(ComplianceConfigSchema, config);
    if (!configResult.success) {
      throw new Error(`Invalid compliance config: ${configResult.errors.join(', ')}`);
    }
    this.config = { ...DEFAULT_CONFIG, ...configResult.data };
    this.frameworks = config.frameworks || this.getDefaultFrameworks();
  }

  // ==========================================================================
  // FRAMEWORK MANAGEMENT
  // ==========================================================================

  /**
   * Get default regulatory frameworks
   */
  protected getDefaultFrameworks(): RegulatoryFramework[] {
    return [
      {
        code: 'LICENSE-001',
        title: 'Producer License',
        description: 'License required for commodity production operations',
        authority: 'regulatory_authority',
        category: 'licensing',
        jurisdiction: this.config.defaultJurisdiction,
        requirements: [
          {
            id: 'LICENSE-001-01',
            code: 'LICENSE-001-01',
            title: 'Valid Production License',
            description: 'Valid license for production operations',
            mandatory: true,
            applicableTo: ['producer'],
            verificationMethod: 'license_verification',
            renewalPeriod: 'annual',
            jurisdiction: this.config.defaultJurisdiction,
          },
        ],
        penalties: [{ violation: 'Operating without license', penalty: 'Fine and cessation' }],
        effectiveDate: '2024-01-01',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'TRADE-001',
        title: 'Trading License',
        description: 'License required for commodity trading',
        authority: 'trade_authority',
        category: 'licensing',
        jurisdiction: this.config.defaultJurisdiction,
        requirements: [
          {
            id: 'TRADE-001-01',
            code: 'TRADE-001-01',
            title: 'Licensed Trader Permit',
            description: 'Valid trading permit',
            mandatory: true,
            applicableTo: ['trader'],
            verificationMethod: 'license_verification',
            renewalPeriod: 'annual',
            jurisdiction: this.config.defaultJurisdiction,
          },
        ],
        penalties: [{ violation: 'Trading without license', penalty: 'Fine and closure' }],
        effectiveDate: '2024-01-01',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
      {
        code: 'AML-001',
        title: 'Anti-Money Laundering',
        description: 'AML requirements for high-value transactions',
        authority: 'financial_authority',
        category: 'financial',
        jurisdiction: this.config.defaultJurisdiction,
        requirements: [
          {
            id: 'AML-001-01',
            code: 'AML-001-01',
            title: 'Enhanced KYC',
            description: 'Enhanced verification for high-value transactions',
            mandatory: true,
            applicableTo: ['trader', 'exporter'],
            verificationMethod: 'kyc_verification',
            jurisdiction: this.config.defaultJurisdiction,
          },
        ],
        penalties: [{ violation: 'KYC failure', penalty: 'Investigation and sanctions' }],
        effectiveDate: '2024-01-01',
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    ];
  }

  /**
   * Register additional regulatory framework
   */
  registerFramework(framework: RegulatoryFramework): void {
    const existing = this.frameworks.findIndex((f) => f.code === framework.code);
    if (existing >= 0) {
      this.frameworks[existing] = framework;
    } else {
      this.frameworks.push(framework);
    }

    // Emit event
    this.eventEmitter.emit(
      this.eventFactory.compliance('compliance.framework_registered', {
        frameworkCode: framework.code,
        jurisdiction: framework.jurisdiction,
      } as any)
    );
  }

  /**
   * Get all registered frameworks
   */
  getFrameworks(): RegulatoryFramework[] {
    return [...this.frameworks];
  }

  /**
   * Get frameworks for a specific jurisdiction
   */
  getFrameworksByJurisdiction(jurisdiction: string): RegulatoryFramework[] {
    return this.frameworks.filter(
      (f) => f.jurisdiction === jurisdiction || f.jurisdiction === 'international'
    );
  }

  // ==========================================================================
  // COMPLIANCE DASHBOARD
  // ==========================================================================

  /**
   * Get comprehensive compliance dashboard
   */
  async getComplianceDashboard(): Promise<ComplianceDashboard> {
    try {
      const allRecords = await this.getAllComplianceRecords();

      const compliant = allRecords.filter((r) => r.status === 'compliant');
      const violations = allRecords.filter((r) => r.status === 'violation'); // eslint-disable-line @typescript-eslint/no-unused-vars
      const critical = allRecords.filter((r) => r.severity === 'critical');
      const pending = allRecords.filter(
        (r) => r.status === 'pending_review' || r.resolution?.status === 'pending'
      );

      const score = allRecords.length > 0 ? (compliant.length / allRecords.length) * 100 : 100;

      return {
        overview: {
          totalRecords: allRecords.length,
          compliantPercentage: Math.round(score),
          pendingIssues: pending.length,
          criticalViolations: critical.length,
          complianceScore: Math.round(score),
          trendDirection: await this.calculateComplianceTrend(),
        },
        byCategory: await this.getComplianceByCategory(allRecords),
        urgentActions: await this.getUrgentActions(allRecords),
        recentActivity: await this.getRecentActivity(allRecords),
        upcomingDeadlines: await this.getUpcomingDeadlines(allRecords),
      };
    } catch (error) {
      throw new Error(`Failed to get compliance dashboard: ${error}`);
    }
  }

  // ==========================================================================
  // ASSET LOT COMPLIANCE
  // ==========================================================================

  /**
   * Check compliance for an asset lot
   */
  async checkAssetLotCompliance(assetLot: AssetLot): Promise<ComplianceRecord[]> {
    const correlationId = this.generateCorrelationId();
    this.eventFactory.setCorrelationId(correlationId);

    // Emit start event
    this.eventEmitter.emit(
      this.eventFactory.compliance('compliance.check_started', {
        entityId: assetLot.id,
        entityType: 'asset_lot',
      } as any)
    );

    const records: ComplianceRecord[] = [];

    try {
      // Check producer license compliance
      const licenseCheck = await this.checkProducerLicense(assetLot.producerId);
      if (!licenseCheck.compliant) {
        const record = this.createComplianceRecord({
          type: 'production',
          status: 'violation',
          severity: 'critical',
          sourceApp: 'registration',
          sourceEntityId: assetLot.id,
          sourceEntityType: 'asset_lot',
          regulationCode: 'LICENSE-001',
          description: licenseCheck.issue || 'Producer does not have valid license',
          location: assetLot.discoveryLocation,
          tags: ['license', 'production', 'critical'],
        });
        records.push(record);

        // Emit violation event
        this.eventEmitter.emit(
          this.eventFactory.compliance('compliance.violation_detected', {
            recordId: record.id,
            entityId: assetLot.id,
            entityType: 'asset_lot',
            severity: 'critical',
            regulationCode: 'LICENSE-001',
            description: record.finding.description,
          })
        );
      }

      // Check location compliance
      const locationCheck = await this.checkLocationCompliance(assetLot.discoveryLocation);
      if (!locationCheck.compliant) {
        const record = this.createComplianceRecord({
          type: 'environmental',
          status: 'warning',
          severity: 'medium',
          sourceApp: 'registration',
          sourceEntityId: assetLot.id,
          sourceEntityType: 'asset_lot',
          regulationCode: 'ENV-001',
          description: locationCheck.issue || 'Location compliance issue',
          location: assetLot.discoveryLocation,
          tags: ['environmental', 'location'],
        });
        records.push(record);

        // Emit warning event
        this.eventEmitter.emit(
          this.eventFactory.compliance('compliance.warning_issued', {
            recordId: record.id,
            entityId: assetLot.id,
            entityType: 'asset_lot',
            severity: 'medium',
            regulationCode: 'ENV-001',
            description: record.finding.description,
          } as any)
        );
      }

      // Check documentation compliance
      if (!assetLot.cryptoProof || !assetLot.certificateId) {
        records.push(
          this.createComplianceRecord({
            type: 'regulatory',
            status: 'violation',
            severity: 'high',
            sourceApp: 'registration',
            sourceEntityId: assetLot.id,
            sourceEntityType: 'asset_lot',
            regulationCode: 'DOC-001',
            description: 'Missing cryptographic proof or certificate',
            location: assetLot.discoveryLocation,
            tags: ['documentation', 'certification'],
          })
        );
      }

      // Emit completion event
      const violations = records.filter((r) => r.status === 'violation').length;
      const warnings = records.filter((r) => r.status === 'warning').length;
      this.eventEmitter.emit(
        this.eventFactory.compliance('compliance.check_completed', {
          entityId: assetLot.id,
          entityType: 'asset_lot',
          recordCount: records.length,
          violations,
          warnings,
          compliant: violations === 0,
        })
      );

      return records;
    } catch (error) {
      throw new Error(`Failed to check asset lot compliance: ${error}`);
    }
  }

  // ==========================================================================
  // TRANSACTION COMPLIANCE
  // ==========================================================================

  /**
   * Check compliance for a transaction
   */
  async checkTransactionCompliance(transaction: Transaction): Promise<ComplianceRecord[]> {
    const correlationId = this.generateCorrelationId();
    this.eventFactory.setCorrelationId(correlationId);

    // Emit start event
    this.eventEmitter.emit(
      this.eventFactory.compliance('compliance.check_started', {
        entityId: transaction.id,
        entityType: 'transaction',
      } as any)
    );

    const records: ComplianceRecord[] = [];

    try {
      // Check trader licenses
      const buyerCheck = await this.checkTraderLicense(transaction.toTraderId);
      const sellerCheck = await this.checkTraderLicense(transaction.fromTraderId);

      if (!buyerCheck.compliant || !sellerCheck.compliant) {
        const record = this.createComplianceRecord({
          type: 'trading',
          status: 'violation',
          severity: 'critical',
          sourceApp: 'trading',
          sourceEntityId: transaction.id,
          sourceEntityType: 'transaction',
          regulationCode: 'TRADE-001',
          description: 'One or more parties lack valid trading license',
          location: transaction.location,
          tags: ['license', 'trading', 'critical'],
        });
        records.push(record);

        this.eventEmitter.emit(
          this.eventFactory.compliance('compliance.violation_detected', {
            recordId: record.id,
            entityId: transaction.id,
            entityType: 'transaction',
            severity: 'critical',
            regulationCode: 'TRADE-001',
            description: record.finding.description,
          })
        );
      }

      // Check high-value transaction thresholds
      if (transaction.price > this.config.highValueThreshold) {
        const kycCheck = await this.checkKYCCompliance(transaction);
        if (!kycCheck.compliant) {
          records.push(
            this.createComplianceRecord({
              type: 'financial',
              status: 'warning',
              severity: 'high',
              sourceApp: 'trading',
              sourceEntityId: transaction.id,
              sourceEntityType: 'transaction',
              regulationCode: 'AML-001',
              description: 'High-value transaction requires enhanced KYC',
              location: transaction.location,
              tags: ['aml', 'kyc', 'high-value'],
            })
          );
        }
      }

      // Emit completion event
      const violations = records.filter((r) => r.status === 'violation').length;
      const warnings = records.filter((r) => r.status === 'warning').length;
      this.eventEmitter.emit(
        this.eventFactory.compliance('compliance.check_completed', {
          entityId: transaction.id,
          entityType: 'transaction',
          recordCount: records.length,
          violations,
          warnings,
          compliant: violations === 0,
        })
      );

      return records;
    } catch (error) {
      throw new Error(`Failed to check transaction compliance: ${error}`);
    }
  }

  // ==========================================================================
  // COMPLIANCE REPORTS
  // ==========================================================================

  /**
   * Generate compliance report
   */
  async generateComplianceReport(options: unknown): Promise<{
    report: {
      summary: {
        totalRecords: number;
        compliantRecords: number;
        violations: number;
        warnings: number;
        pendingReviews: number;
      };
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
  }> {
    // Validate options
    const optionsResult = safeParse(ComplianceReportOptionsSchema, options);
    if (!optionsResult.success) {
      throw new Error(`Invalid report options: ${optionsResult.errors.join(', ')}`);
    }

    const validOptions = optionsResult.data;

    try {
      const records = await this.getFilteredComplianceRecords(validOptions);

      const report = {
        summary: {
          totalRecords: records.length,
          compliantRecords: records.filter((r) => r.status === 'compliant').length,
          violations: records.filter((r) => r.status === 'violation').length,
          warnings: records.filter((r) => r.status === 'warning').length,
          pendingReviews: records.filter((r) => r.status === 'pending_review').length,
        },
        breakdown: this.generateReportBreakdown(records),
        recommendations: await this.generateRecommendations(records),
        actionItems: await this.generateActionItems(records),
      };

      const metadata = {
        generatedAt: new Date().toISOString(),
        recordCount: records.length,
        complianceScore:
          records.length > 0 ? (report.summary.compliantRecords / records.length) * 100 : 100,
        criticalIssues: records.filter((r) => r.severity === 'critical').length,
      };

      // Emit report generated event
      this.eventEmitter.emit(
        this.eventFactory.compliance('compliance.report_generated', {
          reportId: `report_${Date.now()}`,
          format: validOptions.format,
          recordCount: metadata.recordCount,
          complianceScore: metadata.complianceScore,
          criticalIssues: metadata.criticalIssues,
        })
      );

      return { report, metadata };
    } catch (error) {
      throw new Error(`Failed to generate compliance report: ${error}`);
    }
  }

  // ==========================================================================
  // LICENSE VALIDATION
  // ==========================================================================

  /**
   * Validate trader licenses (implements IComplianceService)
   */
  async validateLicenses(traderId: string): Promise<boolean> {
    const check = await this.checkTraderLicense(traderId);
    return check.compliant;
  }

  /**
   * Check compliance (implements IComplianceService)
   */
  async checkCompliance(
    _entityId: string,
    _entityType: 'trader' | 'producer' | 'asset_lot' | 'transaction'
  ): Promise<ComplianceRecord[]> {
    // Placeholder - would delegate to specific check methods
    return [];
  }

  // ==========================================================================
  // HELPER METHODS
  // ==========================================================================

  protected createComplianceRecord(params: {
    type: string;
    status: ComplianceStatus;
    severity: ComplianceSeverity;
    sourceApp: string;
    sourceEntityId: string;
    sourceEntityType: 'asset_lot' | 'transaction' | 'trader' | 'producer';
    regulationCode: string;
    description: string;
    location?: Location;
    tags: string[];
  }): ComplianceRecord {
    const framework = this.frameworks.find((f) => f.code === params.regulationCode);

    return {
      id: this.generateRecordId(),
      type: params.type,
      status: params.status,
      severity: params.severity,
      sourceApp: params.sourceApp,
      sourceEntityId: params.sourceEntityId,
      sourceEntityType: params.sourceEntityType,
      regulation: {
        code: params.regulationCode,
        title: framework?.title || params.regulationCode,
        description: framework?.description || params.description,
        authority: (framework?.authority || 'regulatory_authority') as RegulatoryAuthority,
        category: (framework?.category || 'operational') as ComplianceCategory,
        jurisdiction: framework?.jurisdiction,
      },
      finding: {
        description: params.description,
        location: params.location,
        timestamp: new Date().toISOString(),
        reportedBy: 'system',
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: params.tags,
        priority: this.calculatePriority(params.severity),
        references: [params.sourceEntityId],
      },
    };
  }

  protected generateRecordId(): string {
    return `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }

  protected generateCorrelationId(): string {
    return `check_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  protected calculatePriority(severity: ComplianceSeverity): number {
    const priorities: Record<ComplianceSeverity, number> = {
      critical: 10,
      high: 8,
      medium: 5,
      low: 2,
    };
    return priorities[severity];
  }

  // ==========================================================================
  // VERIFICATION METHODS (Override for jurisdiction-specific implementations)
  // ==========================================================================

  protected async checkProducerLicense(_producerId: string): Promise<ComplianceCheckResult> {
    return { compliant: true };
  }

  protected async checkTraderLicense(_traderId: string): Promise<ComplianceCheckResult> {
    return { compliant: true };
  }

  protected async checkLocationCompliance(_location: Location): Promise<ComplianceCheckResult> {
    return { compliant: true };
  }

  protected async checkKYCCompliance(_transaction: Transaction): Promise<ComplianceCheckResult> {
    return { compliant: true };
  }

  // ==========================================================================
  // DATA ACCESS (Integration points)
  // ==========================================================================

  protected async getAllComplianceRecords(): Promise<ComplianceRecord[]> {
    return [];
  }

  protected async calculateComplianceTrend(): Promise<'improving' | 'declining' | 'stable'> {
    return 'stable';
  }

  protected async getComplianceByCategory(
    records: ComplianceRecord[]
  ): Promise<
    Record<
      string,
      { total: number; compliant: number; violations: number; trend: 'up' | 'down' | 'stable' }
    >
  > {
    const categories: ComplianceCategory[] = [
      'licensing',
      'environmental',
      'financial',
      'operational',
    ];
    const result: Record<
      string,
      { total: number; compliant: number; violations: number; trend: 'up' | 'down' | 'stable' }
    > = {};

    for (const category of categories) {
      const catRecords = records.filter((r) => r.regulation.category === category);
      result[category] = {
        total: catRecords.length,
        compliant: catRecords.filter((r) => r.status === 'compliant').length,
        violations: catRecords.filter((r) => r.status === 'violation').length,
        trend: 'stable',
      };
    }
    return result;
  }

  protected async getUrgentActions(records: ComplianceRecord[]): Promise<ComplianceRecord[]> {
    return records
      .filter((r) => r.severity === 'critical' || r.severity === 'high')
      .sort((a, b) => b.metadata.priority - a.metadata.priority)
      .slice(0, 10);
  }

  protected async getRecentActivity(records: ComplianceRecord[]): Promise<ComplianceRecord[]> {
    return records
      .sort(
        (a, b) =>
          new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime()
      )
      .slice(0, 20);
  }

  protected async getUpcomingDeadlines(
    records: ComplianceRecord[]
  ): Promise<{ record: ComplianceRecord; daysRemaining: number }[]> {
    return records
      .filter((r) => r.resolution?.dueDate)
      .map((r) => ({
        record: r,
        daysRemaining: Math.ceil(
          (new Date(r.resolution!.dueDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
        ),
      }))
      .filter((item) => item.daysRemaining > 0 && item.daysRemaining <= 30)
      .sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  protected async getFilteredComplianceRecords(
    options: ValidatedComplianceReportOptions
  ): Promise<ComplianceRecord[]> {
    const allRecords = await this.getAllComplianceRecords();
    return allRecords.filter((record) => {
      const recordDate = new Date(record.metadata.createdAt);
      const startDate = new Date(options.dateRange.start);
      const endDate = new Date(options.dateRange.end);

      if (recordDate < startDate || recordDate > endDate) return false;
      if (options.apps && !options.apps.includes(record.sourceApp)) return false;
      if (options.categories && !options.categories.includes(record.regulation.category))
        return false;
      if (options.severity && !options.severity.includes(record.severity)) return false;
      return true;
    });
  }

  protected generateReportBreakdown(records: ComplianceRecord[]): Record<string, unknown> {
    return {
      byStatus: {
        compliant: records.filter((r) => r.status === 'compliant').length,
        warning: records.filter((r) => r.status === 'warning').length,
        violation: records.filter((r) => r.status === 'violation').length,
        pending: records.filter((r) => r.status === 'pending_review').length,
      },
      bySeverity: {
        critical: records.filter((r) => r.severity === 'critical').length,
        high: records.filter((r) => r.severity === 'high').length,
        medium: records.filter((r) => r.severity === 'medium').length,
        low: records.filter((r) => r.severity === 'low').length,
      },
    };
  }

  protected async generateRecommendations(records: ComplianceRecord[]): Promise<string[]> {
    const recommendations: string[] = [];
    const critical = records.filter((r) => r.severity === 'critical').length;
    const licenseViolations = records.filter(
      (r) => r.regulation.category === 'licensing' && r.status === 'violation'
    ).length;

    if (critical > 0) {
      recommendations.push(`Prioritize resolution of ${critical} critical violations`);
    }
    if (licenseViolations > 0) {
      recommendations.push('Address licensing violations to maintain operational status');
    }
    recommendations.push('Implement automated compliance monitoring');
    recommendations.push('Establish regular compliance review schedule');
    return recommendations;
  }

  protected async generateActionItems(records: ComplianceRecord[]): Promise<unknown[]> {
    return records
      .filter((r) => r.status === 'violation' || r.status === 'warning')
      .map((r) => ({
        id: r.id,
        description: r.finding.description,
        severity: r.severity,
        dueDate: r.resolution?.dueDate,
        assignedTo: r.resolution?.assignedTo,
      }));
  }
}

export default UnifiedComplianceService;
