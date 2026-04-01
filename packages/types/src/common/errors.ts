// ============================================================================
// ERROR TYPES
// Standardized error definitions
// ============================================================================

export type ErrorCode =
  // Authentication & Authorization
  | 'AUTH_REQUIRED'
  | 'AUTH_INVALID'
  | 'AUTH_EXPIRED'
  | 'PERMISSION_DENIED'
  | 'ROLE_REQUIRED'

  // Validation
  | 'VALIDATION_ERROR'
  | 'INVALID_INPUT'
  | 'MISSING_FIELD'
  | 'INVALID_FORMAT'

  // Resources
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'CONFLICT'
  | 'GONE'

  // Business Logic
  | 'COMPLIANCE_FAILED'
  | 'INSUFFICIENT_BALANCE'
  | 'QUOTA_EXCEEDED'
  | 'OPERATION_NOT_ALLOWED'
  | 'WORKFLOW_ERROR'

  // Verification
  | 'VERIFICATION_FAILED'
  | 'SIGNATURE_INVALID'
  | 'PROOF_EXPIRED'
  | 'CONSENSUS_NOT_REACHED'

  // System
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'TIMEOUT'
  | 'RATE_LIMITED';

export interface GtcxError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown> | undefined;
  timestamp: number;
  requestId?: string | undefined;
  retryable?: boolean | undefined;
  retryAfter?: number | undefined;
}

export class GtcxException extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'GtcxException';
  }

  toJSON(): GtcxError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: Date.now(),
    };
  }
}
