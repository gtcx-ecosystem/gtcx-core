import { createHashCommitmentZkpEngine } from '@gtcx/crypto';
import { ComplianceConfigSchema, ComplianceReportOptionsSchema, safeParse } from '@gtcx/domain';

import { buildDashboard } from './dashboard';
import { getFilteredComplianceRecords } from './data-access';
import { getDefaultFrameworks } from './frameworks';
import { buildComplianceResult, createComplianceRecord, generateCorrelationId } from './helpers';
import {
  DomainEventFactory,
  nullEventEmitter,
  nullMetricsCollector,
  nullOperationLogger,
  ServiceMetrics,
} from './infrastructure';
import { getAllComplianceRecords } from './queries';
import { generateActionItems, generateRecommendations, generateReportBreakdown } from './reports';
import type {
  AssetLot,
  ComplianceConfig,
  ComplianceDashboard,
  ComplianceRecord,
  ComplianceReport,
  IComplianceRepository,
  ICryptoService,
  IDomainEventEmitter,
  IMetricsCollector,
  IOperationLogger,
  IStorageService,
  RegulatoryFramework,
  Transaction,
  ZkVerifier,
} from './types';
import {
  ComplianceServiceError,
  ComplianceValidationError,
  DEFAULT_CONFIG,
  toErrorCause,
} from './types';
import { checkDocumentation, checkLocationCompliance, verifyZkProofIfPresent } from './validators';
import { VerificationMethods } from './verification-methods';

// ============================================================================
// UNIFIED COMPLIANCE SERVICE
// ============================================================================

export class UnifiedComplianceService {
  private storageService: IStorageService;
  private cryptoService: ICryptoService;
  private eventEmitter: IDomainEventEmitter;
  private metrics: ServiceMetrics;
  private operationLogger: IOperationLogger;
  private eventFactory: DomainEventFactory;
  private config: ComplianceConfig;
  private frameworks: RegulatoryFramework[];
  private zkpVerifier: ZkVerifier;
  private complianceRepo: IComplianceRepository | undefined;
  private verificationMethods: VerificationMethods;

  constructor(
    dependencies: {
      storageService: IStorageService;
      cryptoService: ICryptoService;
      eventEmitter?: IDomainEventEmitter;
      metricsCollector?: IMetricsCollector;
      operationLogger?: IOperationLogger;
      zkpVerifier?: ZkVerifier;
      complianceRepository?: IComplianceRepository;
    },
    config: Partial<ComplianceConfig> = {}
  ) {
    this.storageService = dependencies.storageService;
    this.cryptoService = dependencies.cryptoService;
    this.eventEmitter = dependencies.eventEmitter || nullEventEmitter;
    this.metrics = new ServiceMetrics(
      dependencies.metricsCollector || nullMetricsCollector,
      'compliance'
    );
    this.operationLogger = dependencies.operationLogger || nullOperationLogger;
    this.eventFactory = new DomainEventFactory();
    this.zkpVerifier = dependencies.zkpVerifier ?? createHashCommitmentZkpEngine();
    this.complianceRepo = dependencies.complianceRepository;

    const configResult = safeParse(ComplianceConfigSchema, config);
    if (!configResult.success) {
      const messages = configResult.error.issues.map((issue) => issue.message);
      throw new ComplianceValidationError(`Invalid compliance config: ${messages.join(', ')}`);
    }
    this.config = { ...DEFAULT_CONFIG, ...configResult.data } as ComplianceConfig;
    this.frameworks = config.frameworks || getDefaultFrameworks(this.config);
    this.verificationMethods = new VerificationMethods(this.complianceRepo);
  }

  // ==========================================================================
  // FRAMEWORK MANAGEMENT
  // ==========================================================================

  registerFramework(framework: RegulatoryFramework): void {
    const existing = this.frameworks.findIndex((f) => f.code === framework.code);
    if (existing >= 0) {
      this.frameworks[existing] = framework;
    } else {
      this.frameworks.push(framework);
    }
    this.eventEmitter.emit(
      this.eventFactory.compliance('compliance.framework_registered', {
        frameworkCode: framework.code,
        jurisdiction: framework.jurisdiction,
      })
    );
  }

  getFrameworks(): RegulatoryFramework[] {
    return [...this.frameworks];
  }

  getFrameworksByJurisdiction(jurisdiction: string): RegulatoryFramework[] {
    return this.frameworks.filter(
      (f) => f.jurisdiction === jurisdiction || f.jurisdiction === 'international'
    );
  }

  // ==========================================================================
  // COMPLIANCE DASHBOARD
  // ==========================================================================

  async getComplianceDashboard(): Promise<ComplianceDashboard> {
    try {
      const allRecords = await getAllComplianceRecords(this.complianceRepo);
      return buildDashboard(allRecords);
    } catch (error) {
      throw new ComplianceServiceError('Failed to get compliance dashboard', {
        cause: toErrorCause(error),
      });
    }
  }

  // ==========================================================================
  // ASSET LOT COMPLIANCE
  // ==========================================================================

  async checkAssetLotCompliance(assetLot: AssetLot): Promise<ComplianceRecord[]> {
    const correlationId = generateCorrelationId();
    const startTime = Date.now();
    const records: ComplianceRecord[] = [];
    this.metrics.counter('compliance.check', 1, { entityType: 'asset_lot' });

    this.eventEmitter.emit(
      this.eventFactory.compliance(
        'compliance.check_started',
        { entityId: assetLot.id, entityType: 'asset_lot' },
        correlationId
      )
    );

    try {
      const licenseCheck = await this.checkProducerLicense(assetLot.producerId);
      if (!licenseCheck.compliant) {
        const record = createComplianceRecord({
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
          frameworks: this.frameworks,
        });
        records.push(record);
        this.metrics.counter('compliance.violation', 1, {
          entityType: 'asset_lot',
          regulationCode: 'LICENSE-001',
        });
        this.eventEmitter.emit(
          this.eventFactory.compliance(
            'compliance.violation_detected',
            {
              recordId: record.id,
              entityId: assetLot.id,
              entityType: 'asset_lot',
              severity: 'critical',
              regulationCode: 'LICENSE-001',
              description: record.finding.description,
            },
            correlationId
          )
        );
      }

      const locationCheck = await checkLocationCompliance(
        assetLot.discoveryLocation,
        this.complianceRepo
      );
      if (!locationCheck.compliant) {
        const record = createComplianceRecord({
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
          frameworks: this.frameworks,
        });
        records.push(record);
        this.metrics.counter('compliance.warning', 1, {
          entityType: 'asset_lot',
          regulationCode: 'ENV-001',
        });
        this.eventEmitter.emit(
          this.eventFactory.compliance(
            'compliance.warning_issued',
            {
              recordId: record.id,
              entityId: assetLot.id,
              entityType: 'asset_lot',
              severity: 'medium',
              regulationCode: 'ENV-001',
              description: record.finding.description,
            },
            correlationId
          )
        );
      }

      checkDocumentation(
        {
          id: assetLot.id,
          cryptoProof: assetLot.cryptoProof,
          certificateId: assetLot.certificateId,
        },
        {
          sourceApp: 'registration',
          sourceEntityType: 'asset_lot',
          type: 'regulatory',
          location: assetLot.discoveryLocation,
        },
        records,
        this.frameworks
      );

      await verifyZkProofIfPresent(
        { id: assetLot.id, entityType: 'asset_lot', metadata: assetLot.metadata },
        {
          sourceApp: 'registration',
          sourceEntityType: 'asset_lot',
          type: 'regulatory',
          location: assetLot.discoveryLocation,
        },
        records,
        correlationId,
        this.zkpVerifier,
        this.frameworks,
        this.eventEmitter,
        this.eventFactory
      );

      const result = buildComplianceResult(
        records,
        assetLot.id,
        'asset_lot',
        startTime,
        correlationId,
        this.eventEmitter,
        this.eventFactory
      );
      this.metrics.histogram('compliance.check.duration_ms', Date.now() - startTime, {
        entityType: 'asset_lot',
      });
      return result;
    } catch (error) {
      throw new ComplianceServiceError('Failed to check asset lot compliance', {
        cause: toErrorCause(error),
      });
    }
  }

  // ==========================================================================
  // TRANSACTION COMPLIANCE
  // ==========================================================================

  async checkTransactionCompliance(transaction: Transaction): Promise<ComplianceRecord[]> {
    const correlationId = generateCorrelationId();
    const startTime = Date.now();
    const records: ComplianceRecord[] = [];
    this.metrics.counter('compliance.check', 1, { entityType: 'transaction' });

    this.eventEmitter.emit(
      this.eventFactory.compliance(
        'compliance.check_started',
        { entityId: transaction.id, entityType: 'transaction' },
        correlationId
      )
    );

    try {
      const buyerCheck = await this.checkTraderLicense(transaction.toTraderId);
      const sellerCheck = await this.checkTraderLicense(transaction.fromTraderId);

      if (!buyerCheck.compliant || !sellerCheck.compliant) {
        const record = createComplianceRecord({
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
          frameworks: this.frameworks,
        });
        records.push(record);
        this.metrics.counter('compliance.violation', 1, {
          entityType: 'transaction',
          regulationCode: 'TRADE-001',
        });
        this.eventEmitter.emit(
          this.eventFactory.compliance(
            'compliance.violation_detected',
            {
              recordId: record.id,
              entityId: transaction.id,
              entityType: 'transaction',
              severity: 'critical',
              regulationCode: 'TRADE-001',
              description: record.finding.description,
            },
            correlationId
          )
        );
      }

      if (transaction.price > this.config.highValueThreshold) {
        const kycCheck = await this.checkKYCCompliance(transaction);
        if (!kycCheck.compliant) {
          records.push(
            createComplianceRecord({
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
              frameworks: this.frameworks,
            })
          );
        }
      }

      await verifyZkProofIfPresent(
        { id: transaction.id, entityType: 'transaction', metadata: transaction.metadata },
        {
          sourceApp: 'trading',
          sourceEntityType: 'transaction',
          type: 'financial',
          location: transaction.location,
        },
        records,
        correlationId,
        this.zkpVerifier,
        this.frameworks,
        this.eventEmitter,
        this.eventFactory
      );
      this.metrics.counter('compliance.zkproof.verify', 1, { entityType: 'transaction' });

      const result = buildComplianceResult(
        records,
        transaction.id,
        'transaction',
        startTime,
        correlationId,
        this.eventEmitter,
        this.eventFactory
      );
      this.metrics.histogram('compliance.check.duration_ms', Date.now() - startTime, {
        entityType: 'transaction',
      });
      return result;
    } catch (error) {
      throw new ComplianceServiceError('Failed to check transaction compliance', {
        cause: toErrorCause(error),
      });
    }
  }

  // ==========================================================================
  // COMPLIANCE REPORTS
  // ==========================================================================

  async generateComplianceReport(options: unknown): Promise<ComplianceReport> {
    this.metrics.counter('compliance.report.generate', 1);
    const optionsResult = safeParse(ComplianceReportOptionsSchema, options);
    if (!optionsResult.success) {
      const messages = optionsResult.error.issues.map((issue) => issue.message);
      throw new ComplianceValidationError(`Invalid report options: ${messages.join(', ')}`);
    }
    const validOptions = optionsResult.data;

    try {
      const records = await getFilteredComplianceRecords(validOptions, () =>
        getAllComplianceRecords(this.complianceRepo)
      );
      const report = {
        summary: {
          totalRecords: records.length,
          compliantRecords: records.filter((r) => r.status === 'compliant').length,
          violations: records.filter((r) => r.status === 'violation').length,
          warnings: records.filter((r) => r.status === 'warning').length,
          pendingReviews: records.filter((r) => r.status === 'pending_review').length,
        },
        breakdown: generateReportBreakdown(records),
        recommendations: await generateRecommendations(records),
        actionItems: await generateActionItems(records),
      };
      const metadata = {
        generatedAt: new Date().toISOString(),
        recordCount: records.length,
        complianceScore:
          records.length > 0 ? (report.summary.compliantRecords / records.length) * 100 : 100,
        criticalIssues: records.filter((r) => r.severity === 'critical').length,
      };

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
      throw new ComplianceServiceError('Failed to generate compliance report', {
        cause: toErrorCause(error),
      });
    }
  }

  // ==========================================================================
  // LICENSE VALIDATION
  // ==========================================================================

  async validateLicenses(traderId: string): Promise<boolean> {
    const check = await this.checkTraderLicense(traderId);
    return check.compliant;
  }

  async checkCompliance(
    entityId: string,
    entityType: 'trader' | 'producer' | 'asset_lot' | 'transaction'
  ): Promise<{ checked: boolean; records: ComplianceRecord[] }> {
    if (!this.complianceRepo) {
      return { checked: false, records: [] };
    }
    const records = await this.complianceRepo.getRecords(entityId, entityType);
    return { checked: true, records };
  }

  // ==========================================================================
  // VERIFICATION METHODS
  // ==========================================================================

  protected async checkProducerLicense(producerId: string) {
    return this.verificationMethods.checkProducerLicense(producerId);
  }

  protected async checkTraderLicense(traderId: string) {
    return this.verificationMethods.checkTraderLicense(traderId);
  }
  protected async checkKYCCompliance(transaction: Transaction) {
    return this.verificationMethods.checkKYCCompliance(transaction);
  }
}
