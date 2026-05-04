/**
 * UnifiedComplianceService Tests
 *
 * Tests for commodity-agnostic compliance monitoring, framework management,
 * asset lot and transaction compliance checks, report generation,
 * license validation, and dashboard retrieval.
 */

import { createHashCommitmentZkpEngine, type ZkVerifier } from '@gtcx/crypto';
import type {
  ICryptoService,
  IStorageService,
  AssetLot,
  ComplianceRecord,
  Transaction,
  RegulatoryFramework,
} from '@gtcx/domain';
import { describe, expect, it, vi } from 'vitest';

import { UnifiedComplianceService } from '../src/compliance';
import type { IComplianceRepository } from '../src/repositories';

// ============================================================================
// HELPERS
// ============================================================================

function createMockCryptoService(): ICryptoService {
  return {
    createHash: vi.fn().mockResolvedValue('mock-hash'),
    sign: vi.fn().mockResolvedValue('mock-signature'),
    verify: vi.fn().mockResolvedValue(true),
    signTransaction: vi.fn().mockResolvedValue('mock-tx-signature'),
  };
}

function createMockStorageService(): IStorageService {
  return {
    saveAssetLot: vi.fn().mockResolvedValue(undefined),
    getAssetLot: vi.fn().mockResolvedValue(null),
    saveCertificate: vi.fn().mockResolvedValue(undefined),
    saveTransaction: vi.fn().mockResolvedValue(undefined),
  };
}

function createMockEventEmitter() {
  return {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };
}

function createMockComplianceRepo(): IComplianceRepository {
  return {
    getRecords: vi.fn().mockResolvedValue([]),
    checkLicense: vi.fn().mockResolvedValue({ compliant: true }),
    checkLocation: vi.fn().mockResolvedValue({ compliant: true }),
    checkKYC: vi.fn().mockResolvedValue({ compliant: true }),
  };
}

function createService(
  overrides: {
    storageService?: IStorageService;
    cryptoService?: ICryptoService;
    eventEmitter?: ReturnType<typeof createMockEventEmitter>;
    zkpVerifier?: ZkVerifier;
    complianceRepository?: IComplianceRepository;
    config?: Record<string, unknown>;
  } = {}
) {
  return new UnifiedComplianceService(
    {
      storageService: overrides.storageService ?? createMockStorageService(),
      cryptoService: overrides.cryptoService ?? createMockCryptoService(),
      eventEmitter: overrides.eventEmitter as never,
      zkpVerifier: overrides.zkpVerifier,
      complianceRepository: overrides.complianceRepository ?? createMockComplianceRepo(),
    },
    overrides.config ?? {}
  );
}

function createMockAssetLot(overrides: Partial<AssetLot> = {}): AssetLot {
  return {
    id: 'GOL-560-018-TEST-ABCD',
    commodityType: 'gold',
    producerId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    discoveryLocation: {
      latitude: 5.6037,
      longitude: -0.187,
      accuracy: 5,
      timestamp: Date.now(),
    },
    discoveryDate: new Date().toISOString(),
    weight: 100,
    weightUnit: 'g',
    purity: 90,
    form: 'refined',
    qualityGrade: 'A',
    status: 'registered',
    cryptoProof: 'proof-hash-123',
    certificateId: 'CERT-GOL-560-018-TEST-ABCD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx-001',
    assetLotId: 'GOL-560-018-TEST-ABCD',
    fromTraderId: 'seller-uuid-1234',
    toTraderId: 'buyer-uuid-5678',
    quantity: 100,
    quantityUnit: 'g',
    price: 5000,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    location: {
      latitude: 5.6037,
      longitude: -0.187,
      accuracy: 5,
      timestamp: Date.now(),
    },
    cryptoSignature: 'sig-123',
    status: 'pending',
    ...overrides,
  };
}

function createCustomFramework(overrides: Partial<RegulatoryFramework> = {}): RegulatoryFramework {
  return {
    code: 'CUSTOM-001',
    title: 'Custom Framework',
    description: 'A custom regulatory framework',
    authority: 'custom_authority',
    category: 'operational',
    jurisdiction: 'ghana',
    requirements: [
      {
        id: 'CUSTOM-001-01',
        code: 'CUSTOM-001-01',
        title: 'Custom Requirement',
        description: 'Custom requirement description',
        mandatory: true,
        applicableTo: ['producer'],
        verificationMethod: 'manual',
        jurisdiction: 'ghana',
      },
    ],
    penalties: [{ violation: 'Non-compliance', penalty: 'Fine' }],
    effectiveDate: '2024-01-01',
    lastUpdated: '2024-06-01',
    ...overrides,
  };
}

// ============================================================================
// TESTS
// ============================================================================

describe('UnifiedComplianceService', () => {
  // --------------------------------------------------------------------------
  // Constructor
  // --------------------------------------------------------------------------

  describe('constructor', () => {
    it('accepts valid config and creates service', () => {
      const service = createService();
      expect(service).toBeInstanceOf(UnifiedComplianceService);
    });

    it('accepts partial config', () => {
      const service = createService({ config: { defaultJurisdiction: 'ghana' } });
      expect(service).toBeInstanceOf(UnifiedComplianceService);
    });

    it('accepts empty config', () => {
      const service = createService({ config: {} });
      expect(service).toBeInstanceOf(UnifiedComplianceService);
    });

    it('throws on invalid config: negative threshold', () => {
      expect(() => createService({ config: { highValueThreshold: -100 } })).toThrow(
        /Invalid compliance config/
      );
    });

    it('throws on invalid config: jurisdiction too long', () => {
      expect(() =>
        createService({
          config: { defaultJurisdiction: 'a'.repeat(100) },
        })
      ).toThrow(/Invalid compliance config/);
    });
  });

  // --------------------------------------------------------------------------
  // getFrameworks / registerFramework
  // --------------------------------------------------------------------------

  describe('getFrameworks()', () => {
    it('returns default frameworks', () => {
      const service = createService();
      const frameworks = service.getFrameworks();

      expect(frameworks.length).toBeGreaterThanOrEqual(3);

      const codes = frameworks.map((f) => f.code);
      expect(codes).toContain('LICENSE-001');
      expect(codes).toContain('TRADE-001');
      expect(codes).toContain('AML-001');
    });

    it('returns a copy (not the internal array)', () => {
      const service = createService();
      const frameworks1 = service.getFrameworks();
      const frameworks2 = service.getFrameworks();

      expect(frameworks1).not.toBe(frameworks2);
      expect(frameworks1).toEqual(frameworks2);
    });
  });

  describe('registerFramework()', () => {
    it('adds a new framework', () => {
      const service = createService();
      const initialCount = service.getFrameworks().length;

      const custom = createCustomFramework();
      service.registerFramework(custom);

      const frameworks = service.getFrameworks();
      expect(frameworks.length).toBe(initialCount + 1);
      expect(frameworks.some((f) => f.code === 'CUSTOM-001')).toBe(true);
    });

    it('replaces existing framework with same code', () => {
      const service = createService();

      const custom1 = createCustomFramework({ title: 'Version 1' });
      service.registerFramework(custom1);

      const custom2 = createCustomFramework({ title: 'Version 2' });
      service.registerFramework(custom2);

      const frameworks = service.getFrameworks();
      const match = frameworks.filter((f) => f.code === 'CUSTOM-001');
      expect(match).toHaveLength(1);
      expect(match[0]!.title).toBe('Version 2');
    });

    it('emits compliance.framework_registered event', () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });

      service.registerFramework(createCustomFramework());

      const events = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls;
      const regEvent = events.find((call) => call[0].type === 'compliance.framework_registered');
      expect(regEvent).toBeDefined();
      expect(regEvent![0].payload.frameworkCode).toBe('CUSTOM-001');
    });
  });

  // --------------------------------------------------------------------------
  // getFrameworksByJurisdiction
  // --------------------------------------------------------------------------

  describe('getFrameworksByJurisdiction()', () => {
    it('returns frameworks matching exact jurisdiction', () => {
      const service = createService({ config: { defaultJurisdiction: 'ghana' } });

      const custom = createCustomFramework({ jurisdiction: 'ghana' });
      service.registerFramework(custom);

      const frameworks = service.getFrameworksByJurisdiction('ghana');
      expect(frameworks.some((f) => f.code === 'CUSTOM-001')).toBe(true);
    });

    it('includes international frameworks in any jurisdiction query', () => {
      const service = createService({ config: { defaultJurisdiction: 'international' } });

      const frameworks = service.getFrameworksByJurisdiction('some_country');

      // Default frameworks have jurisdiction = config.defaultJurisdiction = 'international'
      expect(frameworks.length).toBeGreaterThanOrEqual(3);
    });

    it('returns empty for jurisdiction with no frameworks', () => {
      const service = createService({ config: { defaultJurisdiction: 'ghana' } });

      // Default frameworks will have jurisdiction 'ghana', not 'international'
      // Query for a different jurisdiction that is also not 'international'
      const frameworks = service.getFrameworksByJurisdiction('brazil');

      // Should not include ghana-specific frameworks
      const ghanaFrameworks = frameworks.filter(
        (f) => f.jurisdiction !== 'international' && f.jurisdiction !== 'brazil'
      );
      expect(ghanaFrameworks).toHaveLength(0);
    });
  });

  // --------------------------------------------------------------------------
  // checkAssetLotCompliance
  // --------------------------------------------------------------------------

  describe('checkAssetLotCompliance()', () => {
    it('returns empty records for fully compliant asset lot', async () => {
      const service = createService();
      const lot = createMockAssetLot();

      const records = await service.checkAssetLotCompliance(lot);

      // Default checkProducerLicense and checkLocationCompliance return compliant
      // Asset lot has cryptoProof and certificateId
      expect(records).toHaveLength(0);
    });

    it('accepts a valid ZK proof in asset lot metadata', async () => {
      const zkp = createHashCommitmentZkpEngine();
      const proof = await zkp.generate({
        system: 'bulletproofs',
        proofType: 'gci_threshold',
        publicInputs: ['threshold:50'],
        witness: 'score:75',
        verificationKeyId: 'bulletproofs-gci-v1',
      });
      const lot = createMockAssetLot({ metadata: { zkProof: proof } });
      const service = createService({ zkpVerifier: zkp });

      const records = await service.checkAssetLotCompliance(lot);

      const zkRecord = records.find((r) => r.regulation.code === 'ZKP-001');
      expect(zkRecord).toBeUndefined();
    });

    it('flags an invalid ZK proof in asset lot metadata', async () => {
      const zkp = createHashCommitmentZkpEngine();
      const proof = await zkp.generate({
        system: 'bulletproofs',
        proofType: 'gci_threshold',
        publicInputs: ['threshold:50'],
        witness: 'score:75',
        verificationKeyId: 'bulletproofs-gci-v1',
      });
      const lot = createMockAssetLot({
        metadata: { zkProof: { ...proof, proof: 'not-base64' } },
      });
      const service = createService({ zkpVerifier: zkp });

      const records = await service.checkAssetLotCompliance(lot);

      const zkRecord = records.find((r) => r.regulation.code === 'ZKP-001');
      expect(zkRecord).toBeDefined();
      expect(zkRecord!.status).toBe('violation');
    });

    it('detects missing cryptographic proof', async () => {
      const service = createService();
      const lot = createMockAssetLot({ cryptoProof: undefined });

      const records = await service.checkAssetLotCompliance(lot);

      expect(records.length).toBeGreaterThanOrEqual(1);
      const docRecord = records.find((r) => r.regulation.code === 'DOC-001');
      expect(docRecord).toBeDefined();
      expect(docRecord!.status).toBe('violation');
      expect(docRecord!.severity).toBe('high');
    });

    it('detects missing certificate ID', async () => {
      const service = createService();
      const lot = createMockAssetLot({ certificateId: undefined });

      const records = await service.checkAssetLotCompliance(lot);

      const docRecord = records.find((r) => r.regulation.code === 'DOC-001');
      expect(docRecord).toBeDefined();
    });

    it('emits compliance.check_started and compliance.check_completed events', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });
      const lot = createMockAssetLot();

      await service.checkAssetLotCompliance(lot);

      const eventTypes = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.map(
        (call) => call[0].type
      );
      expect(eventTypes).toContain('compliance.check_started');
      expect(eventTypes).toContain('compliance.check_completed');
    });

    it('check_completed event reports zero violations for compliant lot', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });
      const lot = createMockAssetLot();

      await service.checkAssetLotCompliance(lot);

      const completedEvent = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0].type === 'compliance.check_completed'
      );
      expect(completedEvent![0].payload.violations).toBe(0);
      expect(completedEvent![0].payload.compliant).toBe(true);
    });

    it('compliance record includes correct source entity info', async () => {
      const service = createService();
      const lot = createMockAssetLot({ cryptoProof: undefined });

      const records = await service.checkAssetLotCompliance(lot);

      const record = records[0]!;
      expect(record.sourceApp).toBe('registration');
      expect(record.sourceEntityId).toBe(lot.id);
      expect(record.sourceEntityType).toBe('asset_lot');
    });

    it('compliance record has generated ID and timestamps', async () => {
      const service = createService();
      const lot = createMockAssetLot({ cryptoProof: undefined });

      const records = await service.checkAssetLotCompliance(lot);

      const record = records[0]!;
      expect(record.id).toMatch(/^comp_/);
      expect(record.metadata.createdAt).toBeTruthy();
      expect(record.metadata.updatedAt).toBeTruthy();
    });
  });

  // --------------------------------------------------------------------------
  // checkTransactionCompliance
  // --------------------------------------------------------------------------

  describe('checkTransactionCompliance()', () => {
    it('returns empty records for compliant transaction', async () => {
      const service = createService();
      const tx = createMockTransaction();

      const records = await service.checkTransactionCompliance(tx);

      // Default checkTraderLicense returns compliant, price below threshold
      expect(records).toHaveLength(0);
    });

    it('emits check_started and check_completed events', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });
      const tx = createMockTransaction();

      await service.checkTransactionCompliance(tx);

      const eventTypes = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.map(
        (call) => call[0].type
      );
      expect(eventTypes).toContain('compliance.check_started');
      expect(eventTypes).toContain('compliance.check_completed');
    });

    it('check_completed payload includes entity info for transaction', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });
      const tx = createMockTransaction();

      await service.checkTransactionCompliance(tx);

      const completedEvent = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0].type === 'compliance.check_completed'
      );
      expect(completedEvent![0].payload.entityId).toBe(tx.id);
      expect(completedEvent![0].payload.entityType).toBe('transaction');
    });

    it('high-value transaction below threshold does not trigger KYC check', async () => {
      const service = createService({ config: { highValueThreshold: 100000 } });
      const tx = createMockTransaction({ price: 5000 });

      const records = await service.checkTransactionCompliance(tx);
      expect(records).toHaveLength(0);
    });

    it('transaction compliance record references correct regulation code', async () => {
      // We need to subclass to simulate a license failure
      class TestComplianceService extends UnifiedComplianceService {
        protected override async checkTraderLicense(_traderId: string) {
          return { compliant: false, issue: 'Expired license' };
        }
      }

      const service = new TestComplianceService({
        storageService: createMockStorageService(),
        cryptoService: createMockCryptoService(),
      });
      const tx = createMockTransaction();

      const records = await service.checkTransactionCompliance(tx);

      expect(records.length).toBeGreaterThanOrEqual(1);
      const tradeRecord = records.find((r) => r.regulation.code === 'TRADE-001');
      expect(tradeRecord).toBeDefined();
      expect(tradeRecord!.status).toBe('violation');
      expect(tradeRecord!.severity).toBe('critical');
    });

    it('high-value transaction triggers KYC check when above threshold', async () => {
      class TestComplianceService extends UnifiedComplianceService {
        protected override async checkKYCCompliance(_transaction: Transaction) {
          return { compliant: false, issue: 'KYC incomplete' };
        }
      }

      const service = new TestComplianceService(
        {
          storageService: createMockStorageService(),
          cryptoService: createMockCryptoService(),
        },
        { highValueThreshold: 1000 }
      );
      const tx = createMockTransaction({ price: 5000 });

      const records = await service.checkTransactionCompliance(tx);

      const amlRecord = records.find((r) => r.regulation.code === 'AML-001');
      expect(amlRecord).toBeDefined();
      expect(amlRecord!.severity).toBe('high');
    });
  });

  // --------------------------------------------------------------------------
  // generateComplianceReport
  // --------------------------------------------------------------------------

  describe('generateComplianceReport()', () => {
    it('throws on invalid options (missing required fields)', async () => {
      const service = createService();

      await expect(service.generateComplianceReport({})).rejects.toThrow(/Invalid report options/);
    });

    it('throws on invalid date range (start after end)', async () => {
      const service = createService();

      await expect(
        service.generateComplianceReport({
          dateRange: {
            start: '2025-12-01T00:00:00.000Z',
            end: '2025-01-01T00:00:00.000Z',
          },
          format: 'summary',
        })
      ).rejects.toThrow(/Invalid report options/);
    });

    it('returns report structure for valid options', async () => {
      const service = createService();

      const result = await service.generateComplianceReport({
        dateRange: {
          start: '2025-01-01T00:00:00.000Z',
          end: '2025-12-31T00:00:00.000Z',
        },
        format: 'summary',
      });

      expect(result.report).toBeDefined();
      expect(result.report.summary).toBeDefined();
      expect(result.report.summary.totalRecords).toBe(0);
      expect(result.report.summary.compliantRecords).toBe(0);
      expect(result.report.summary.violations).toBe(0);
      expect(result.report.summary.warnings).toBe(0);
      expect(result.report.summary.pendingReviews).toBe(0);
      expect(result.report.breakdown).toBeDefined();
      expect(result.report.recommendations).toBeInstanceOf(Array);
      expect(result.report.actionItems).toBeInstanceOf(Array);
    });

    it('returns metadata with report', async () => {
      const service = createService();

      const result = await service.generateComplianceReport({
        dateRange: {
          start: '2025-01-01T00:00:00.000Z',
          end: '2025-12-31T00:00:00.000Z',
        },
        format: 'detailed',
      });

      expect(result.metadata).toBeDefined();
      expect(result.metadata.generatedAt).toBeTruthy();
      expect(result.metadata.recordCount).toBe(0);
      expect(result.metadata.complianceScore).toBe(100); // No records = 100% compliant
      expect(result.metadata.criticalIssues).toBe(0);
    });

    it('emits compliance.report_generated event', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });

      await service.generateComplianceReport({
        dateRange: {
          start: '2025-01-01T00:00:00.000Z',
          end: '2025-12-31T00:00:00.000Z',
        },
        format: 'export',
      });

      const events = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls;
      const reportEvent = events.find((call) => call[0].type === 'compliance.report_generated');
      expect(reportEvent).toBeDefined();
      expect(reportEvent![0].payload.format).toBe('export');
    });

    it('accepts optional filter parameters', async () => {
      const service = createService();

      const result = await service.generateComplianceReport({
        dateRange: {
          start: '2025-01-01T00:00:00.000Z',
          end: '2025-12-31T00:00:00.000Z',
        },
        format: 'summary',
        apps: ['registration', 'trading'],
        categories: ['licensing', 'financial'],
        severity: ['critical', 'high'],
      });

      expect(result.report).toBeDefined();
    });

    it('always includes default recommendations', async () => {
      const service = createService();

      const result = await service.generateComplianceReport({
        dateRange: {
          start: '2025-01-01T00:00:00.000Z',
          end: '2025-12-31T00:00:00.000Z',
        },
        format: 'summary',
      });

      expect(result.report.recommendations).toContain('Implement automated compliance monitoring');
      expect(result.report.recommendations).toContain(
        'Establish regular compliance review schedule'
      );
    });
  });

  // --------------------------------------------------------------------------
  // validateLicenses
  // --------------------------------------------------------------------------

  describe('validateLicenses()', () => {
    it('returns true by default (delegates to checkTraderLicense)', async () => {
      const service = createService();

      const result = await service.validateLicenses('some-trader-id');

      expect(result).toBe(true);
    });

    it('returns false when checkTraderLicense reports non-compliant', async () => {
      class TestComplianceService extends UnifiedComplianceService {
        protected override async checkTraderLicense(_traderId: string) {
          return { compliant: false, issue: 'License expired' };
        }
      }

      const service = new TestComplianceService({
        storageService: createMockStorageService(),
        cryptoService: createMockCryptoService(),
      });

      const result = await service.validateLicenses('expired-trader');
      expect(result).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // checkCompliance (IComplianceService interface)
  // --------------------------------------------------------------------------

  describe('checkCompliance()', () => {
    it('returns checked status with records when repo configured', async () => {
      const service = createService();

      const result = await service.checkCompliance('entity-1', 'trader');

      expect(result.checked).toBe(true);
      expect(result.records).toEqual([]);
    });

    it('returns unchecked status when repo not configured', async () => {
      // Create service without compliance repository
      const service = new UnifiedComplianceService(
        {
          storageService: createMockStorageService(),
          cryptoService: createMockCryptoService(),
        },
        {}
      );

      const result = await service.checkCompliance('entity-1', 'trader');

      expect(result.checked).toBe(false);
      expect(result.records).toEqual([]);
    });
  });

  // --------------------------------------------------------------------------
  // getComplianceDashboard
  // --------------------------------------------------------------------------

  describe('getComplianceDashboard()', () => {
    it('returns dashboard structure with all sections', async () => {
      const service = createService();

      const dashboard = await service.getComplianceDashboard();

      expect(dashboard.overview).toBeDefined();
      expect(dashboard.overview.totalRecords).toBe(0);
      expect(dashboard.overview.compliantPercentage).toBe(100);
      expect(dashboard.overview.pendingIssues).toBe(0);
      expect(dashboard.overview.criticalViolations).toBe(0);
      expect(dashboard.overview.complianceScore).toBe(100);
      expect(dashboard.overview.trendDirection).toBe('stable');
    });

    it('returns byCategory breakdown', async () => {
      const service = createService();

      const dashboard = await service.getComplianceDashboard();

      expect(dashboard.byCategory).toBeDefined();
      expect(dashboard.byCategory['licensing']).toBeDefined();
      expect(dashboard.byCategory['environmental']).toBeDefined();
      expect(dashboard.byCategory['financial']).toBeDefined();
      expect(dashboard.byCategory['operational']).toBeDefined();
    });

    it('returns empty arrays for urgentActions, recentActivity, and upcomingDeadlines', async () => {
      const service = createService();

      const dashboard = await service.getComplianceDashboard();

      expect(dashboard.urgentActions).toEqual([]);
      expect(dashboard.recentActivity).toEqual([]);
      expect(dashboard.upcomingDeadlines).toEqual([]);
    });

    it('category breakdown has correct shape', async () => {
      const service = createService();

      const dashboard = await service.getComplianceDashboard();

      const licensing = dashboard.byCategory['licensing'];
      expect(licensing).toHaveProperty('total');
      expect(licensing).toHaveProperty('compliant');
      expect(licensing).toHaveProperty('violations');
      expect(licensing).toHaveProperty('trend');
      expect(licensing!.trend).toBe('stable');
    });
  });

  // --------------------------------------------------------------------------
  // Priority calculation
  // --------------------------------------------------------------------------

  describe('compliance record priority', () => {
    it('assigns correct priority based on severity', async () => {
      const service = createService();
      // Trigger a documentation violation (high severity)
      const lot = createMockAssetLot({ cryptoProof: undefined });

      const records = await service.checkAssetLotCompliance(lot);

      const docRecord = records.find((r) => r.regulation.code === 'DOC-001');
      expect(docRecord).toBeDefined();
      // 'high' severity => priority 8
      expect(docRecord!.metadata.priority).toBe(8);
    });

    it('critical severity gets priority 10', async () => {
      class TestComplianceService extends UnifiedComplianceService {
        protected override async checkProducerLicense(_producerId: string) {
          return { compliant: false, issue: 'No license found' };
        }
      }

      const service = new TestComplianceService({
        storageService: createMockStorageService(),
        cryptoService: createMockCryptoService(),
      });

      const lot = createMockAssetLot();
      const records = await service.checkAssetLotCompliance(lot);

      const licenseRecord = records.find((r) => r.regulation.code === 'LICENSE-001');
      expect(licenseRecord).toBeDefined();
      expect(licenseRecord!.metadata.priority).toBe(10);
    });
  });

  // --------------------------------------------------------------------------
  // null-object defaults
  // --------------------------------------------------------------------------

  describe('null-object defaults', () => {
    it('works without eventEmitter, metricsCollector, operationLogger, or complianceRepository', () => {
      const service = new UnifiedComplianceService(
        {
          storageService: createMockStorageService(),
          cryptoService: createMockCryptoService(),
        },
        {}
      );

      const frameworks = service.getFrameworks();

      expect(frameworks.length).toBeGreaterThanOrEqual(3);
    });
  });

  // --------------------------------------------------------------------------
  // event payload verification
  // --------------------------------------------------------------------------

  describe('event payload verification', () => {
    it('compliance.check_completed event has recordCount and violations', async () => {
      const emitter = createMockEventEmitter();
      const service = createService({ eventEmitter: emitter });
      const lot = createMockAssetLot();

      await service.checkAssetLotCompliance(lot);

      const completedEvent = (emitter.emit as ReturnType<typeof vi.fn>).mock.calls.find(
        (call) => call[0].type === 'compliance.check_completed'
      );
      expect(completedEvent).toBeDefined();

      const payload = completedEvent![0].payload;
      expect(payload).toHaveProperty('recordCount');
      expect(payload).toHaveProperty('violations');
    });
  });

  // --------------------------------------------------------------------------
  // Crypto failure paths
  // --------------------------------------------------------------------------

  describe('Crypto failure paths', () => {
    it('verify returning false flags asset lot as non-compliant via subclass', async () => {
      const crypto = createMockCryptoService();
      (crypto.verify as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      // Capture crypto in closure so the subclass can delegate to it
      const capturedCrypto = crypto;
      class CryptoVerifyComplianceService extends UnifiedComplianceService {
        protected override async checkProducerLicense(_producerId: string) {
          const isValid = await capturedCrypto.verify('data', 'sig');
          return isValid
            ? { compliant: true }
            : { compliant: false, issue: 'Cryptographic verification failed' };
        }
      }

      const service = new CryptoVerifyComplianceService({
        storageService: createMockStorageService(),
        cryptoService: crypto,
      });

      const lot = createMockAssetLot();
      const records = await service.checkAssetLotCompliance(lot);

      const licenseRecord = records.find((r) => r.regulation.code === 'LICENSE-001');
      expect(licenseRecord).toBeDefined();
      expect(licenseRecord!.status).toBe('violation');
      expect(licenseRecord!.finding.description).toContain('Cryptographic verification failed');
      expect(crypto.verify).toHaveBeenCalled();
    });

    it('createHash throwing propagates error from compliance check', async () => {
      const crypto = createMockCryptoService();
      (crypto.createHash as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error('Hash computation failed')
      );

      const capturedCrypto = crypto;
      class CryptoHashComplianceService extends UnifiedComplianceService {
        protected override async checkProducerLicense(_producerId: string) {
          await capturedCrypto.createHash('test-data');
          return { compliant: true };
        }
      }

      const service = new CryptoHashComplianceService({
        storageService: createMockStorageService(),
        cryptoService: crypto,
      });

      const lot = createMockAssetLot();
      await expect(service.checkAssetLotCompliance(lot)).rejects.toThrow(
        'Failed to check asset lot compliance'
      );

      try {
        await service.checkAssetLotCompliance(lot);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).cause).toBeInstanceOf(Error);
        expect(((error as Error).cause as Error).message).toContain('Hash computation failed');
      }
      expect(crypto.createHash).toHaveBeenCalledWith('test-data');
    });
  });
});

// ============================================================================
// REPOSITORY DI
// ============================================================================

describe('Repository DI: IComplianceRepository', () => {
  function createMockRecord(overrides: Partial<ComplianceRecord> = {}): ComplianceRecord {
    return {
      id: 'comp-001',
      type: 'license_check',
      status: 'compliant',
      severity: 'low',
      sourceApp: 'agx',
      sourceEntityId: 'trader-1',
      sourceEntityType: 'trader',
      regulation: {
        code: 'MIN-001',
        title: 'Mining License',
        description: 'Active mining license required',
        authority: 'ZMMA' as never,
        category: 'licensing',
      },
      finding: {
        description: 'License valid',
        timestamp: new Date().toISOString(),
        reportedBy: 'system',
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        priority: 1,
        references: [],
      },
      ...overrides,
    } as ComplianceRecord;
  }

  it('getAllComplianceRecords delegates to repository when provided', async () => {
    const records = [createMockRecord({ id: 'r1' }), createMockRecord({ id: 'r2' })];
    const repo: IComplianceRepository = {
      getRecords: vi.fn().mockResolvedValue(records),
      checkLicense: vi.fn().mockResolvedValue({ compliant: true }),
      checkLocation: vi.fn().mockResolvedValue({ compliant: true }),
      checkKYC: vi.fn().mockResolvedValue({ compliant: true }),
    };

    const service = new UnifiedComplianceService(
      {
        storageService: createMockStorageService(),
        cryptoService: createMockCryptoService(),
        complianceRepository: repo,
      },
      {}
    );

    const dashboard = await service.getComplianceDashboard();
    expect(repo.getRecords).toHaveBeenCalled();
    expect(dashboard.overview.totalRecords).toBe(2);
  });

  it('checkLicense delegates producer license check to repository', async () => {
    const repo: IComplianceRepository = {
      getRecords: vi.fn().mockResolvedValue([]),
      checkLicense: vi.fn().mockResolvedValue({ compliant: false, issue: 'expired' }),
      checkLocation: vi.fn().mockResolvedValue({ compliant: true }),
      checkKYC: vi.fn().mockResolvedValue({ compliant: true }),
    };

    const service = new UnifiedComplianceService(
      {
        storageService: createMockStorageService(),
        cryptoService: createMockCryptoService(),
        complianceRepository: repo,
      },
      {}
    );

    // validateLicenses calls checkTraderLicense internally
    const valid = await service.validateLicenses('trader-1');
    expect(repo.checkLicense).toHaveBeenCalledWith('trader-1', 'trader');
    expect(valid).toBe(false);
  });

  it('falls back to default stubs when no repository provided', async () => {
    const service = createService();
    const dashboard = await service.getComplianceDashboard();
    expect(dashboard.overview.totalRecords).toBe(0);
  });

  // ==========================================================================
  // NO-REPOSITORY FALLBACK PATHS
  // ==========================================================================

  describe('no-repository fallback behavior', () => {
    function createServiceWithoutRepo() {
      return new UnifiedComplianceService(
        {
          storageService: createMockStorageService(),
          cryptoService: createMockCryptoService(),
        },
        {}
      );
    }

    it('returns non-compliant for trader license when no repo configured', async () => {
      const service = createServiceWithoutRepo();
      const result = await service.validateLicenses('trader-1');
      expect(result).toBe(false);
    });

    it('returns empty dashboard when no repo configured', async () => {
      const service = createServiceWithoutRepo();
      const dashboard = await service.getComplianceDashboard();
      expect(dashboard.overview.totalRecords).toBe(0);
      expect(dashboard.overview.complianceScore).toBe(100);
    });

    it('produces compliance records for asset lot without repo', async () => {
      const service = createServiceWithoutRepo();
      const lot = createMockAssetLot();
      const records = await service.checkAssetLotCompliance(lot);
      expect(Array.isArray(records)).toBe(true);
    });

    it('produces compliance records for transaction without repo', async () => {
      const service = createServiceWithoutRepo();
      const tx = createMockTransaction();
      const records = await service.checkTransactionCompliance(tx);
      expect(Array.isArray(records)).toBe(true);
    });

    it('flags transaction with missing trader IDs in KYC fallback', async () => {
      const service = createServiceWithoutRepo();
      const tx = createMockTransaction({ fromTraderId: '', toTraderId: '' });
      const records = await service.checkTransactionCompliance(tx);
      const hasViolation = records.some((r) => r.status === 'violation');
      expect(hasViolation).toBe(true);
    });

    it('flags invalid location coordinates in location fallback', async () => {
      const service = createServiceWithoutRepo();
      const lot = createMockAssetLot({
        discoveryLocation: {
          latitude: 999,
          longitude: -999,
          accuracy: 5,
          timestamp: Date.now(),
        },
      });
      const records = await service.checkAssetLotCompliance(lot);
      const hasViolation = records.some((r) => r.status === 'violation');
      expect(hasViolation).toBe(true);
    });

    it('returns checked:false from checkCompliance when no repo', async () => {
      const service = createServiceWithoutRepo();
      const result = await service.checkCompliance('entity-1', 'producer');
      expect(result.checked).toBe(false);
      expect(result.records).toEqual([]);
    });
  });
});
