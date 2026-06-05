// ============================================================================
// PROVENANCE-AWARE TRACING
// Helpers for attaching and logging AgenticProvenance metadata
// ============================================================================

import type { AgenticProvenance } from '@gtcx/types';

/**
 * Internal structured JSON stderr writer (mirrors index.ts for zero-dependency).
 */
function writeLog(level: string, message: string, data?: Record<string, unknown>): void {
  const entry = JSON.stringify({
    level,
    msg: message,
    ...data,
    ts: new Date().toISOString(),
  });
  if (typeof process !== 'undefined' && process.stderr) {
    process.stderr.write(entry + '\n');
  }
}

function createCategoryLogger(category: string) {
  const emit = (level: string, message: string, data?: Record<string, unknown>) => {
    writeLog(level, message, { category, ...data });
  };
  return {
    info: (msg: string, data?: Record<string, unknown>) => emit('info', msg, data),
    warn: (msg: string, data?: Record<string, unknown>) => emit('warn', msg, data),
    error: (msg: string, data?: Record<string, unknown>) => emit('error', msg, data),
    debug: (msg: string, data?: Record<string, unknown>) => emit('debug', msg, data),
  };
}

/**
 * Wrap raw output data with an {@link AgenticProvenance} envelope.
 *
 * @example
 * ```typescript
 * const result = attachProvenance(
 *   { anomalies: [...] },
 *   buildProvenance({ trustLevel: 'verified', confidence: 0.92, ... })
 * );
 * // result = { data: { anomalies: [...] }, provenance: { ... } }
 * ```
 */
export function attachProvenance<T>(
  data: T,
  provenance: AgenticProvenance
): { data: T; provenance: AgenticProvenance } {
  return { data, provenance };
}

/**
 * Logger that emits structured provenance records to stderr.
 *
 * Useful for audit trails and downstream policy-gate consumption.
 */
export interface ProvenanceLogger {
  logProvenance(provenance: AgenticProvenance, context?: Record<string, unknown>): void;
  logEvaluation(
    provenance: AgenticProvenance,
    action: string,
    reason: string,
    context?: Record<string, unknown>
  ): void;
}

/**
 * Create a category-scoped provenance logger.
 *
 * Outputs JSON lines to stderr with level `info` for provenance records
 * and level `warn` for evaluations that require review.
 */
export function createProvenanceLogger(category: string): ProvenanceLogger {
  const logger = createCategoryLogger(category);

  return {
    logProvenance(provenance, context = {}) {
      logger.info('provenance_record', {
        trustLevel: provenance.trustLevel,
        confidence: provenance.confidence,
        evidenceCount: provenance.evidenceRefs.length,
        methodology: provenance.methodologyVersion.framework,
        methodologyVersion: provenance.methodologyVersion.version,
        requiresHumanReview: provenance.requiresHumanReview,
        reviewedBy: provenance.reviewedBy,
        ...context,
      });
    },

    logEvaluation(provenance, action, reason, context = {}) {
      const level = provenance.requiresHumanReview ? 'warn' : 'info';
      logger[level]('provenance_evaluation', {
        action,
        reason,
        trustLevel: provenance.trustLevel,
        confidence: provenance.confidence,
        requiresHumanReview: provenance.requiresHumanReview,
        ...context,
      });
    },
  };
}

/**
 * Convenience type for any result that carries an
 * {@link AgenticProvenance} envelope.
 */
export interface ProvenancedResult<T> {
  data: T;
  provenance: AgenticProvenance;
}
