import { randomUUID } from 'node:crypto';

import type {
  ComplianceRecord,
  ComplianceStatus,
  ComplianceSeverity,
  ComplianceCategory,
  RegulatoryFramework,
  Location,
} from './types';

export function generateRecordId(): string {
  return `comp_${Date.now()}_${randomUUID()}`;
}

export function generateCorrelationId(): string {
  return `check_${Date.now()}_${randomUUID()}`;
}

export function calculatePriority(severity: ComplianceSeverity): number {
  const priorities: Record<ComplianceSeverity, number> = {
    critical: 10,
    high: 8,
    medium: 5,
    low: 2,
  };
  return priorities[severity];
}

export function createComplianceRecord(params: {
  type: string;
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  sourceApp: string;
  sourceEntityId: string;
  sourceEntityType: 'asset_lot' | 'transaction' | 'trader' | 'producer';
  regulationCode: string;
  description: string;
  location?: Location | undefined;
  tags: string[];
  frameworks: RegulatoryFramework[];
}): ComplianceRecord {
  const framework = params.frameworks.find((f) => f.code === params.regulationCode);

  return {
    id: generateRecordId(),
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
      authority: (framework?.authority ||
        'regulatory_authority') as RegulatoryFramework['authority'],
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
      priority: calculatePriority(params.severity),
      references: [params.sourceEntityId],
    },
  };
}

export function buildComplianceResult(
  records: ComplianceRecord[],
  entityId: string,
  entityType: 'asset_lot' | 'transaction',
  _startTime: number,
  correlationId: string,
  eventEmitter: { emit: (event: unknown) => void },
  eventFactory: { compliance: (type: string, data: unknown, correlationId?: string) => unknown }
): ComplianceRecord[] {
  const violations = records.filter((r) => r.status === 'violation').length;
  const warnings = records.filter((r) => r.status === 'warning').length;
  eventEmitter.emit(
    eventFactory.compliance(
      'compliance.check_completed',
      {
        entityId,
        entityType,
        recordCount: records.length,
        violations,
        warnings,
        compliant: violations === 0,
      },
      correlationId
    )
  );
  return records;
}
