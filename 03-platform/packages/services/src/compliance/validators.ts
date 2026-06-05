import type { ZKProof } from '@gtcx/crypto';
import { ZKProofSchema } from '@gtcx/crypto';

import { createComplianceRecord } from './helpers';
import type {
  ComplianceRecord,
  ComplianceCheckResult,
  Transaction,
  ZkVerifier,
  RegulatoryFramework,
  Location,
} from './types';

export interface ValidationContext {
  sourceApp: string;
  sourceEntityType: 'asset_lot' | 'transaction';
  type: string;
  location?: Location | undefined;
}

export function extractZkProof(metadata?: Record<string, unknown>): ZKProof | null {
  if (!metadata) return null;
  const candidate = metadata['zkProof'] ?? metadata['zk_proof'];
  if (!candidate) return null;
  const parsed = ZKProofSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

export async function verifyZkProofIfPresent(
  data: {
    id: string;
    entityType: 'asset_lot' | 'transaction';
    metadata?: Record<string, unknown> | undefined;
  },
  ctx: ValidationContext,
  records: ComplianceRecord[],
  correlationId: string,
  zkpVerifier: ZkVerifier,
  frameworks: RegulatoryFramework[],
  eventEmitter: { emit: (event: unknown) => void },
  eventFactory: { compliance: (type: string, data: unknown, correlationId?: string) => unknown }
): Promise<void> {
  const zkProof = extractZkProof(data.metadata);
  if (!zkProof) return;

  const isValid = await zkpVerifier.verify(zkProof);
  if (!isValid) {
    const record = createComplianceRecord({
      type: ctx.type,
      status: 'violation',
      severity: 'high',
      sourceApp: ctx.sourceApp,
      sourceEntityId: data.id,
      sourceEntityType: data.entityType,
      regulationCode: 'ZKP-001',
      description: 'Invalid zero-knowledge proof',
      location: ctx.location,
      tags: ['zkp', 'proof', 'verification'],
      frameworks,
    });
    records.push(record);
    eventEmitter.emit(
      eventFactory.compliance(
        'compliance.zk_proof_invalid',
        {
          recordId: record.id,
          entityId: data.id,
          entityType: data.entityType,
          proofType: zkProof.proofType,
        },
        correlationId
      )
    );
  } else {
    eventEmitter.emit(
      eventFactory.compliance(
        'compliance.zk_proof_verified',
        {
          entityId: data.id,
          entityType: data.entityType,
          proofType: zkProof.proofType,
        },
        correlationId
      )
    );
  }
}

export function checkDocumentation(
  data: { id: string; cryptoProof?: unknown | undefined; certificateId?: string | undefined },
  ctx: ValidationContext,
  records: ComplianceRecord[],
  frameworks: RegulatoryFramework[]
): void {
  if (!data.cryptoProof || !data.certificateId) {
    records.push(
      createComplianceRecord({
        type: ctx.type,
        status: 'violation',
        severity: 'high',
        sourceApp: ctx.sourceApp,
        sourceEntityId: data.id,
        sourceEntityType: ctx.sourceEntityType as 'asset_lot' | 'transaction',
        regulationCode: 'DOC-001',
        description: 'Missing cryptographic proof or certificate',
        location: ctx.location,
        tags: ['documentation', 'certification'],
        frameworks,
      })
    );
  }
}

export async function checkProducerLicense(
  producerId: string,
  complianceRepo:
    | { checkLicense: (id: string, type: 'producer') => Promise<ComplianceCheckResult> }
    | undefined
): Promise<ComplianceCheckResult> {
  if (complianceRepo) return complianceRepo.checkLicense(producerId, 'producer');
  return {
    compliant: false,
    issue: 'Compliance repository not configured — cannot verify producer license',
  };
}

export async function checkTraderLicense(
  traderId: string,
  complianceRepo:
    | { checkLicense: (id: string, type: 'trader') => Promise<ComplianceCheckResult> }
    | undefined
): Promise<ComplianceCheckResult> {
  if (complianceRepo) return complianceRepo.checkLicense(traderId, 'trader');
  return {
    compliant: false,
    issue: 'Compliance repository not configured — cannot verify trader license',
  };
}

export async function checkLocationCompliance(
  location: Location,
  complianceRepo: { checkLocation: (loc: Location) => Promise<ComplianceCheckResult> } | undefined
): Promise<ComplianceCheckResult> {
  if (complianceRepo) return complianceRepo.checkLocation(location);
  return { compliant: true, details: { method: 'coordinate_validation_only' } };
}

export async function checkKYCCompliance(
  transaction: Transaction,
  complianceRepo: { checkKYC: (tx: Transaction) => Promise<ComplianceCheckResult> } | undefined
): Promise<ComplianceCheckResult> {
  if (complianceRepo) return complianceRepo.checkKYC(transaction);
  if (!transaction.fromTraderId || !transaction.toTraderId) {
    return { compliant: false, issue: 'Transaction missing buyer or seller identity' };
  }
  return { compliant: true, details: { method: 'field_presence_only' } };
}
