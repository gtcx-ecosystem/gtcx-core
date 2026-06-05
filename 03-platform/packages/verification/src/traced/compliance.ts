/**
 * Compliance logging for audit purposes.
 */

import { createCategoryLogger } from '../tracing.js';

const complianceLog = createCategoryLogger('compliance');

export function logComplianceEvent(event: {
  type:
    | 'verification_requested'
    | 'verification_completed'
    | 'verification_failed'
    | 'claim_issued'
    | 'claim_revoked';
  subjectId: string;
  credentialType?: string;
  gciScore?: number;
  success: boolean;
  reason?: string;
  metadata?: Record<string, unknown>;
}): void {
  if (event.success) {
    complianceLog.info(event.type, {
      subjectId: event.subjectId,
      credentialType: event.credentialType,
      gciScore: event.gciScore,
      ...event.metadata,
    });
  } else {
    complianceLog.warn(event.type, {
      subjectId: event.subjectId,
      reason: event.reason,
      ...event.metadata,
    });
  }
}

export function logGCICalculation(params: {
  subjectId: string;
  previousScore: number;
  newScore: number;
  factors: Record<string, number>;
  trigger: string;
}): void {
  complianceLog.info('gci.calculated', {
    subjectId: params.subjectId,
    scoreDelta: params.newScore - params.previousScore,
    newScore: params.newScore,
    factorCount: Object.keys(params.factors).length,
    trigger: params.trigger,
  });
}
