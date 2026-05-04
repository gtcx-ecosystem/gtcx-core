import { GtcxException, type ErrorCode } from '@gtcx/types';

// ============================================================================
// VERIFICATION ERROR CLASSES
// Aligned with ADR-012 (Error Taxonomy)
// ============================================================================

export class VerificationError extends GtcxException {
  constructor(
    message: string,
    code: ErrorCode = 'VERIFICATION_FAILED',
    details?: Record<string, unknown>,
    options?: { cause?: unknown }
  ) {
    super(code, message, details);
    this.name = 'VerificationError';
    if (options?.cause) {
      this.cause = options.cause;
    }
  }
}
