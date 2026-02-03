export type ErrorCode = 'AUTH_REQUIRED' | 'AUTH_INVALID' | 'AUTH_EXPIRED' | 'PERMISSION_DENIED' | 'ROLE_REQUIRED' | 'VALIDATION_ERROR' | 'INVALID_INPUT' | 'MISSING_FIELD' | 'INVALID_FORMAT' | 'NOT_FOUND' | 'ALREADY_EXISTS' | 'CONFLICT' | 'GONE' | 'COMPLIANCE_FAILED' | 'INSUFFICIENT_BALANCE' | 'QUOTA_EXCEEDED' | 'OPERATION_NOT_ALLOWED' | 'WORKFLOW_ERROR' | 'VERIFICATION_FAILED' | 'SIGNATURE_INVALID' | 'PROOF_EXPIRED' | 'CONSENSUS_NOT_REACHED' | 'INTERNAL_ERROR' | 'SERVICE_UNAVAILABLE' | 'TIMEOUT' | 'RATE_LIMITED';
export interface GtcxError {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    timestamp: number;
    requestId?: string;
    retryable?: boolean;
    retryAfter?: number;
}
export declare class GtcxException extends Error {
    readonly code: ErrorCode;
    readonly details?: Record<string, unknown> | undefined;
    constructor(code: ErrorCode, message: string, details?: Record<string, unknown> | undefined);
    toJSON(): GtcxError;
}
//# sourceMappingURL=errors.d.ts.map