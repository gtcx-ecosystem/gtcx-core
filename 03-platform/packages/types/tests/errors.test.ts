import { describe, it, expect } from 'vitest';

import type { ErrorCode, GtcxError } from '../src/common/errors';
import { GtcxException } from '../src/common/errors';

describe('GtcxException', () => {
  it('constructs with code and message', () => {
    const err = new GtcxException('NOT_FOUND', 'Resource not found');
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Resource not found');
    expect(err.name).toBe('GtcxException');
    expect(err).toBeInstanceOf(Error);
  });

  it('constructs with details', () => {
    const err = new GtcxException('VALIDATION_ERROR', 'Bad input', {
      field: 'email',
      reason: 'invalid format',
    });
    expect(err.details).toEqual({ field: 'email', reason: 'invalid format' });
  });

  it('serializes to GtcxError via toJSON()', () => {
    const err = new GtcxException('AUTH_EXPIRED', 'Token expired');
    const json = err.toJSON();
    expect(json.code).toBe('AUTH_EXPIRED');
    expect(json.message).toBe('Token expired');
    expect(json.timestamp).toBeGreaterThan(0);
    expect(json.details).toBeUndefined();
  });

  it('serializes details in toJSON()', () => {
    const err = new GtcxException('RATE_LIMITED', 'Too many requests', {
      retryAfter: 30,
    });
    const json = err.toJSON();
    expect(json.details).toEqual({ retryAfter: 30 });
  });

  it('all ErrorCode values are string literals', () => {
    const codes: ErrorCode[] = [
      'AUTH_REQUIRED',
      'AUTH_INVALID',
      'AUTH_EXPIRED',
      'PERMISSION_DENIED',
      'ROLE_REQUIRED',
      'VALIDATION_ERROR',
      'INVALID_INPUT',
      'MISSING_FIELD',
      'INVALID_FORMAT',
      'NOT_FOUND',
      'ALREADY_EXISTS',
      'CONFLICT',
      'GONE',
      'COMPLIANCE_FAILED',
      'INSUFFICIENT_BALANCE',
      'QUOTA_EXCEEDED',
      'OPERATION_NOT_ALLOWED',
      'WORKFLOW_ERROR',
      'VERIFICATION_FAILED',
      'SIGNATURE_INVALID',
      'PROOF_EXPIRED',
      'CONSENSUS_NOT_REACHED',
      'INTERNAL_ERROR',
      'SERVICE_UNAVAILABLE',
      'TIMEOUT',
      'RATE_LIMITED',
    ];
    expect(codes.length).toBe(26);
    for (const code of codes) {
      expect(typeof code).toBe('string');
      const err = new GtcxException(code, `Test ${code}`);
      expect(err.code).toBe(code);
    }
  });

  it('GtcxError interface is structurally compatible', () => {
    const error: GtcxError = {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong',
      timestamp: Date.now(),
      retryable: true,
      retryAfter: 60,
    };
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.retryable).toBe(true);
  });
});
