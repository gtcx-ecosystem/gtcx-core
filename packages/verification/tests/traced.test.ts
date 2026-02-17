import type { OperationLog } from '@gtcx/ai';
import { describe, it, expect } from 'vitest';

import {
  tracedGenerateCertificate,
  tracedVerifyCertificate,
  tracedGenerateQRCode,
  tracedVerifyQRCode,
  tracedCreateProofBundle,
  tracedVerificationWorkflow,
  logComplianceEvent,
  logGCICalculation,
  computeVerificationSummary,
} from '../src/traced';

// =============================================================================
// TRACED CERTIFICATE OPERATIONS
// =============================================================================

describe('tracedGenerateCertificate', () => {
  it('should be a function', () => {
    expect(typeof tracedGenerateCertificate).toBe('function');
  });

  it('should throw with the placeholder implementation error', async () => {
    await expect(
      tracedGenerateCertificate({
        type: 'location',
        securityLevel: 'standard',
        location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
        privateKey: 'pk_test',
        publicKey: 'pub_test',
      })
    ).rejects.toThrow('Implementation required');
  });

  it('should not swallow errors — they propagate to the caller', async () => {
    const call = tracedGenerateCertificate({
      type: 'asset-origin',
      securityLevel: 'military',
      location: { latitude: 0, longitude: 0, accuracy: 1, timestamp: Date.now() },
      privateKey: 'pk',
      publicKey: 'pub',
      claims: [],
    });
    await expect(call).rejects.toThrow();
  });
});

describe('tracedVerifyCertificate', () => {
  it('should be a function', () => {
    expect(typeof tracedVerifyCertificate).toBe('function');
  });

  it('should throw with placeholder implementation error', async () => {
    const mockCert = {
      certificateId: 'CERT_001',
      version: '1.0',
      type: 'location' as const,
      securityLevel: 'standard' as const,
      metadata: {
        issuer: 'test',
        issuedAt: Date.now(),
        userRole: 'producer',
        deviceId: 'dev-1',
        location: { latitude: 0, longitude: 0, accuracy: 5, timestamp: Date.now() },
      },
      verificationData: {
        publicKey: 'pk_test',
        signature: 'sig_test',
        timestamp: Date.now(),
      },
      createdAt: Date.now(),
    };
    await expect(tracedVerifyCertificate(mockCert)).rejects.toThrow('Implementation required');
  });
});

// =============================================================================
// TRACED QR CODE OPERATIONS
// =============================================================================

describe('tracedGenerateQRCode', () => {
  it('should be a function', () => {
    expect(typeof tracedGenerateQRCode).toBe('function');
  });

  it('should throw with placeholder implementation error', async () => {
    await expect(
      tracedGenerateQRCode({
        certificateId: 'CERT_001',
        type: 'certificate',
      })
    ).rejects.toThrow('Implementation required');
  });
});

describe('tracedVerifyQRCode', () => {
  it('should be a function', () => {
    expect(typeof tracedVerifyQRCode).toBe('function');
  });

  it('should throw with placeholder implementation error', async () => {
    await expect(tracedVerifyQRCode('some-qr-data')).rejects.toThrow('Implementation required');
  });
});

// =============================================================================
// TRACED PROOF BUNDLE OPERATIONS
// =============================================================================

describe('tracedCreateProofBundle', () => {
  it('should be a function', () => {
    expect(typeof tracedCreateProofBundle).toBe('function');
  });

  it('should throw with placeholder implementation error', async () => {
    await expect(
      tracedCreateProofBundle({
        type: 'location',
        location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
      })
    ).rejects.toThrow('Implementation required');
  });
});

// =============================================================================
// WORKFLOW TRACING
// =============================================================================

describe('tracedVerificationWorkflow', () => {
  it('should return the result of a successful workflow', async () => {
    const result = await tracedVerificationWorkflow(
      async () => ({ status: 'ok', value: 42 }),
      'test-workflow'
    );
    expect(result).toEqual({ status: 'ok', value: 42 });
  });

  it('should propagate errors from the workflow', async () => {
    await expect(
      tracedVerificationWorkflow(async () => {
        throw new Error('workflow failed');
      }, 'failing-workflow')
    ).rejects.toThrow('workflow failed');
  });

  it('should propagate non-Error throws', async () => {
    await expect(
      tracedVerificationWorkflow(async () => {
        throw 'string-error';
      }, 'string-error-workflow')
    ).rejects.toBe('string-error');
  });

  it('should accept optional metadata', async () => {
    const result = await tracedVerificationWorkflow(async () => 'done', 'metadata-workflow', {
      userId: 'user-001',
      operation: 'test',
    });
    expect(result).toBe('done');
  });
});

// =============================================================================
// COMPLIANCE LOGGING
// =============================================================================

describe('logComplianceEvent', () => {
  it('should not throw for a successful event', () => {
    expect(() =>
      logComplianceEvent({
        type: 'verification_completed',
        subjectId: 'subject-001',
        credentialType: 'ProducerID',
        gciScore: 85,
        success: true,
      })
    ).not.toThrow();
  });

  it('should not throw for a failed event', () => {
    expect(() =>
      logComplianceEvent({
        type: 'verification_failed',
        subjectId: 'subject-002',
        success: false,
        reason: 'signature invalid',
      })
    ).not.toThrow();
  });

  it('should handle all event types', () => {
    const types = [
      'verification_requested',
      'verification_completed',
      'verification_failed',
      'claim_issued',
      'claim_revoked',
    ] as const;

    for (const type of types) {
      expect(() =>
        logComplianceEvent({
          type,
          subjectId: 'subj',
          success: type !== 'verification_failed',
        })
      ).not.toThrow();
    }
  });

  it('should accept optional metadata', () => {
    expect(() =>
      logComplianceEvent({
        type: 'claim_issued',
        subjectId: 'subject-003',
        success: true,
        metadata: { claimId: 'claim-001', predicateUri: 'tradepass://identity/kyc/verified' },
      })
    ).not.toThrow();
  });
});

describe('logGCICalculation', () => {
  it('should not throw for valid params', () => {
    expect(() =>
      logGCICalculation({
        subjectId: 'subject-001',
        previousScore: 70,
        newScore: 85,
        factors: { compliance: 0.3, verification: 0.5, history: 0.2 },
        trigger: 'verification_completed',
      })
    ).not.toThrow();
  });

  it('should handle negative score deltas', () => {
    expect(() =>
      logGCICalculation({
        subjectId: 'subject-002',
        previousScore: 90,
        newScore: 75,
        factors: { violation: -0.15 },
        trigger: 'compliance_violation',
      })
    ).not.toThrow();
  });

  it('should handle empty factors', () => {
    expect(() =>
      logGCICalculation({
        subjectId: 'subject-003',
        previousScore: 50,
        newScore: 50,
        factors: {},
        trigger: 'manual_recalc',
      })
    ).not.toThrow();
  });
});

// =============================================================================
// VERIFICATION ANALYTICS
// =============================================================================

describe('computeVerificationSummary', () => {
  it('should return zero-value summary for empty logs', () => {
    const summary = computeVerificationSummary([]);
    expect(summary.totalOperations).toBe(0);
    expect(summary.successfulVerifications).toBe(0);
    expect(summary.failedVerifications).toBe(0);
    expect(summary.averageLatencyMs).toBe(0);
    expect(summary.operationsByType).toEqual({});
    expect(summary.errorsByType).toEqual({});
  });

  it('should filter to only verification category logs', () => {
    const logs: OperationLog[] = [
      {
        operationName: 'verification.generateCertificate',
        type: 'verification.generateCertificate',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 50,
      },
      {
        operationName: 'ai.classify',
        type: 'ai.classify',
        category: 'ai',
        timestamp: Date.now(),
        success: true,
        durationMs: 100,
      },
    ];
    const summary = computeVerificationSummary(logs);
    expect(summary.totalOperations).toBe(1);
  });

  it('should count successes and failures', () => {
    const logs: OperationLog[] = [
      {
        operationName: 'v1',
        type: 'verification.generateCertificate',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 40,
      },
      {
        operationName: 'v2',
        type: 'verification.verifyCertificate',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 30,
      },
      {
        operationName: 'v3',
        type: 'verification.verifyQRCode',
        category: 'verification',
        timestamp: Date.now(),
        success: false,
        durationMs: 10,
        error: { name: 'ValidationError', message: 'invalid QR' },
      },
    ];
    const summary = computeVerificationSummary(logs);
    expect(summary.totalOperations).toBe(3);
    expect(summary.successfulVerifications).toBe(2);
    expect(summary.failedVerifications).toBe(1);
  });

  it('should compute average latency', () => {
    const logs: OperationLog[] = [
      {
        operationName: 'v1',
        type: 'verification.op1',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 100,
      },
      {
        operationName: 'v2',
        type: 'verification.op2',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 200,
      },
    ];
    const summary = computeVerificationSummary(logs);
    expect(summary.averageLatencyMs).toBe(150);
  });

  it('should skip null durations when computing average', () => {
    const logs: OperationLog[] = [
      {
        operationName: 'v1',
        type: 'verification.op1',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 100,
      },
      {
        operationName: 'v2',
        type: 'verification.op2',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: null,
      },
    ];
    const summary = computeVerificationSummary(logs);
    expect(summary.averageLatencyMs).toBe(100);
  });

  it('should group operations by type (last segment)', () => {
    const logs: OperationLog[] = [
      {
        operationName: 'v1',
        type: 'verification.generateCertificate',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 50,
      },
      {
        operationName: 'v2',
        type: 'verification.generateCertificate',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 60,
      },
      {
        operationName: 'v3',
        type: 'verification.verifyQRCode',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 20,
      },
    ];
    const summary = computeVerificationSummary(logs);
    expect(summary.operationsByType).toEqual({
      generateCertificate: 2,
      verifyQRCode: 1,
    });
  });

  it('should group errors by error name', () => {
    const logs: OperationLog[] = [
      {
        operationName: 'v1',
        type: 'verification.verify',
        category: 'verification',
        timestamp: Date.now(),
        success: false,
        durationMs: 10,
        error: { name: 'ValidationError', message: 'bad input' },
      },
      {
        operationName: 'v2',
        type: 'verification.verify',
        category: 'verification',
        timestamp: Date.now(),
        success: false,
        durationMs: 15,
        error: { name: 'ValidationError', message: 'another bad input' },
      },
      {
        operationName: 'v3',
        type: 'verification.verify',
        category: 'verification',
        timestamp: Date.now(),
        success: false,
        durationMs: 5,
        error: { name: 'TimeoutError', message: 'timed out' },
      },
    ];
    const summary = computeVerificationSummary(logs);
    expect(summary.errorsByType).toEqual({
      ValidationError: 2,
      TimeoutError: 1,
    });
  });

  it('should not count failed operations without error object in errorsByType', () => {
    const logs: OperationLog[] = [
      {
        operationName: 'v1',
        type: 'verification.op',
        category: 'verification',
        timestamp: Date.now(),
        success: false,
        durationMs: 10,
        // no error property
      },
    ];
    const summary = computeVerificationSummary(logs);
    expect(summary.failedVerifications).toBe(1);
    expect(summary.errorsByType).toEqual({});
  });

  it('should handle type with no dot separator', () => {
    const logs: OperationLog[] = [
      {
        operationName: 'v1',
        type: 'singleword',
        category: 'verification',
        timestamp: Date.now(),
        success: true,
        durationMs: 10,
      },
    ];
    const summary = computeVerificationSummary(logs);
    expect(summary.operationsByType).toEqual({ singleword: 1 });
  });
});
