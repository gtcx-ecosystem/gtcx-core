import { describe, expect, it } from 'vitest';

import {
  calculateComplianceTrend,
  getComplianceByCategory,
  getUrgentActions,
  getRecentActivity,
  getUpcomingDeadlines,
  generateActionItems,
  generateRecommendations,
  generateReportBreakdown,
  getFilteredComplianceRecords,
  createComplianceRecord,
  calculatePriority,
  generateRecordId,
  generateCorrelationId,
  buildComplianceResult,
  extractZkProof,
  checkDocumentation,
  checkProducerLicense,
  checkTraderLicense,
  checkLocationCompliance,
  checkKYCCompliance,
  getDefaultFrameworks,
  DEFAULT_CONFIG,
} from '../src/compliance';
import type { ComplianceRecord, RegulatoryFramework } from '../src/compliance';

function makeRecord(overrides: Partial<ComplianceRecord> = {}): ComplianceRecord {
  const now = new Date().toISOString();
  return {
    id: 'rec-1',
    type: 'test',
    status: 'compliant',
    severity: 'low',
    sourceApp: 'test',
    sourceEntityId: 'ent-1',
    sourceEntityType: 'asset_lot',
    regulation: {
      code: 'TEST-001',
      title: 'Test',
      description: 'Test regulation',
      authority: 'test_auth',
      category: 'licensing',
    },
    finding: {
      description: 'Test finding',
      timestamp: now,
      reportedBy: 'system',
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      tags: [],
      priority: 1,
      references: [],
    },
    ...overrides,
  } as ComplianceRecord;
}

describe('compliance modules', () => {
  describe('reports', () => {
    it('generateReportBreakdown returns counts by status and severity', () => {
      const records = [
        makeRecord({ status: 'compliant', severity: 'low' }),
        makeRecord({ status: 'violation', severity: 'critical' }),
        makeRecord({ status: 'warning', severity: 'high' }),
      ];
      const result = generateReportBreakdown(records);
      expect(result).toEqual({
        byStatus: { compliant: 1, warning: 1, violation: 1, pending: 0 },
        bySeverity: { critical: 1, high: 1, medium: 0, low: 1 },
      });
    });

    it('generateRecommendations includes critical and license messages', async () => {
      const records = [
        makeRecord({
          severity: 'critical',
          status: 'violation',
          regulation: {
            code: 'TEST-001',
            title: 'Test',
            description: 'Test',
            authority: 'auth',
            category: 'licensing',
          },
        }),
      ];
      const result = await generateRecommendations(records);
      expect(result).toContain('Prioritize resolution of 1 critical violations');
      expect(result).toContain('Address licensing violations to maintain operational status');
    });

    it('generateActionItems maps violations and warnings', async () => {
      const records = [
        makeRecord({
          status: 'violation',
          severity: 'high',
          resolution: { dueDate: '2026-12-31', assignedTo: 'alice' },
        }),
        makeRecord({ status: 'compliant' }),
      ];
      const result = await generateActionItems(records);
      expect(result).toHaveLength(1);
      expect((result[0] as Record<string, unknown>).severity).toBe('high');
    });

    it('calculateComplianceTrend returns stable for < 2 records', async () => {
      expect(await calculateComplianceTrend([])).toBe('stable');
      expect(await calculateComplianceTrend([makeRecord()])).toBe('stable');
    });

    it('calculateComplianceTrend detects improving', async () => {
      const records = [
        makeRecord({
          status: 'violation',
          metadata: { ...makeRecord().metadata, createdAt: '2024-01-01T00:00:00Z' },
        }),
        makeRecord({
          status: 'violation',
          metadata: { ...makeRecord().metadata, createdAt: '2024-02-01T00:00:00Z' },
        }),
        makeRecord({
          status: 'compliant',
          metadata: { ...makeRecord().metadata, createdAt: '2024-03-01T00:00:00Z' },
        }),
        makeRecord({
          status: 'compliant',
          metadata: { ...makeRecord().metadata, createdAt: '2024-04-01T00:00:00Z' },
        }),
      ];
      expect(await calculateComplianceTrend(records)).toBe('improving');
    });

    it('getComplianceByCategory returns all categories', async () => {
      const result = await getComplianceByCategory([]);
      expect(Object.keys(result)).toEqual([
        'licensing',
        'environmental',
        'financial',
        'operational',
      ]);
    });

    it('getUrgentActions filters and sorts by priority', async () => {
      const records = [
        makeRecord({ severity: 'medium', metadata: { ...makeRecord().metadata, priority: 5 } }),
        makeRecord({ severity: 'critical', metadata: { ...makeRecord().metadata, priority: 10 } }),
      ];
      const result = await getUrgentActions(records);
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('critical');
    });

    it('getRecentActivity sorts by updatedAt descending', async () => {
      const records = [
        makeRecord({ metadata: { ...makeRecord().metadata, updatedAt: '2024-01-01T00:00:00Z' } }),
        makeRecord({ metadata: { ...makeRecord().metadata, updatedAt: '2024-06-01T00:00:00Z' } }),
      ];
      const result = await getRecentActivity(records);
      expect(new Date(result[0].metadata.updatedAt).getTime()).toBeGreaterThan(
        new Date(result[1].metadata.updatedAt).getTime()
      );
    });

    it('getUpcomingDeadlines filters future due dates within 30 days', async () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const records = [makeRecord({ resolution: { dueDate: future.toISOString() } }), makeRecord()];
      const result = await getUpcomingDeadlines(records);
      expect(result).toHaveLength(1);
      expect(result[0].daysRemaining).toBeGreaterThan(0);
      expect(result[0].daysRemaining).toBeLessThanOrEqual(30);
    });
  });

  describe('helpers', () => {
    it('generateRecordId starts with comp_', () => {
      expect(generateRecordId()).toMatch(/^comp_\d+_[\w-]+$/);
    });

    it('generateCorrelationId starts with check_', () => {
      expect(generateCorrelationId()).toMatch(/^check_\d+_[\w-]+$/);
    });

    it('calculatePriority maps severities correctly', () => {
      expect(calculatePriority('critical')).toBe(10);
      expect(calculatePriority('high')).toBe(8);
      expect(calculatePriority('medium')).toBe(5);
      expect(calculatePriority('low')).toBe(2);
    });

    it('createComplianceRecord uses framework data when available', () => {
      const frameworks: RegulatoryFramework[] = getDefaultFrameworks(DEFAULT_CONFIG);
      const record = createComplianceRecord({
        type: 'test',
        status: 'violation',
        severity: 'high',
        sourceApp: 'app',
        sourceEntityId: 'ent-1',
        sourceEntityType: 'asset_lot',
        regulationCode: 'LICENSE-001',
        description: 'Test desc',
        tags: ['tag'],
        frameworks,
      });
      expect(record.regulation.title).toBe('Producer License');
      expect(record.metadata.priority).toBe(8);
    });

    it('buildComplianceResult emits check_completed event', () => {
      const events: unknown[] = [];
      const emitter = { emit: (e: unknown) => events.push(e) };
      const factory = {
        compliance: (type: string, payload: unknown, cid?: string) => ({ type, payload, cid }),
      };
      const records = [makeRecord({ status: 'violation' })];
      const result = buildComplianceResult(
        records,
        'ent-1',
        'asset_lot',
        0,
        'cid',
        emitter,
        factory
      );
      expect(result).toBe(records);
      expect(events).toHaveLength(1);
      expect((events[0] as Record<string, unknown>).type).toBe('compliance.check_completed');
    });
  });

  describe('validators', () => {
    it('extractZkProof returns null when no metadata', () => {
      expect(extractZkProof(undefined)).toBeNull();
      expect(extractZkProof({})).toBeNull();
    });

    it('checkDocumentation adds record when proof is missing', () => {
      const records: ComplianceRecord[] = [];
      const frameworks: RegulatoryFramework[] = getDefaultFrameworks(DEFAULT_CONFIG);
      checkDocumentation(
        { id: 'ent-1' },
        { sourceApp: 'app', sourceEntityType: 'asset_lot', type: 'test' },
        records,
        frameworks
      );
      expect(records).toHaveLength(1);
      expect(records[0].regulation.code).toBe('DOC-001');
    });

    it('checkProducerLicense returns fallback when no repo', async () => {
      const result = await checkProducerLicense('prod-1', undefined);
      expect(result.compliant).toBe(false);
    });

    it('checkTraderLicense returns fallback when no repo', async () => {
      const result = await checkTraderLicense('trader-1', undefined);
      expect(result.compliant).toBe(false);
    });

    it('checkLocationCompliance returns fallback when no repo', async () => {
      const result = await checkLocationCompliance(
        { latitude: 0, longitude: 0, accuracy: 1, timestamp: 0 },
        undefined
      );
      expect(result.compliant).toBe(true);
    });

    it('checkKYCCompliance returns fallback when no repo', async () => {
      const result = await checkKYCCompliance(
        { id: 'tx-1', fromTraderId: 'a', toTraderId: 'b', price: 100 },
        undefined
      );
      expect(result.compliant).toBe(true);
    });
  });

  describe('data-access', () => {
    it('getFilteredComplianceRecords filters by date range', async () => {
      const records = [
        makeRecord({ metadata: { ...makeRecord().metadata, createdAt: '2025-06-01T00:00:00Z' } }),
        makeRecord({ metadata: { ...makeRecord().metadata, createdAt: '2025-01-01T00:00:00Z' } }),
      ];
      const result = await getFilteredComplianceRecords(
        { dateRange: { start: '2025-05-01', end: '2025-12-31' }, format: 'test' },
        async () => records
      );
      expect(result).toHaveLength(1);
    });
  });
});
