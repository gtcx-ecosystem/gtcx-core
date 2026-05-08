import { generateKeyPair } from '@gtcx/crypto';
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
  type VerificationOperationLog,
} from '../src/traced';

function makeLocation() {
  return { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() };
}

// =============================================================================
// TRACED CERTIFICATE OPERATIONS
// =============================================================================

describe('tracedGenerateCertificate', () => {
  it('should be a function', () => {
    expect(typeof tracedGenerateCertificate).toBe('function');
  });

  it('should generate a standard certificate for standard security level', async () => {
    const keyPair = generateKeyPair();
    const cert = await tracedGenerateCertificate({
      type: 'location',
      securityLevel: 'standard',
      location: makeLocation(),
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });
    expect(cert.certificateId).toBeTruthy();
    expect(cert.verificationData.publicKey).toBe(keyPair.publicKey);
    expect(cert.verificationData.signature).toBeTruthy();
    expect('signature' in cert).toBe(true);
    expect('dataHash' in cert).toBe(true);
  });

  it('should generate a military-grade certificate for military security level', async () => {
    const keyPair = generateKeyPair();
    const cert = await tracedGenerateCertificate({
      type: 'asset-origin',
      securityLevel: 'military',
      location: { latitude: 0, longitude: 0, accuracy: 1, timestamp: Date.now() },
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
      assetData: {
        commodityType: 'gold',
        estimatedWeight: 10,
        unit: 'kg',
      },
      claims: [],
    });
    expect('multiSignature' in cert).toBe(true);
    expect('postQuantumHash' in cert).toBe(true);
  });

  it('should not swallow validation errors', async () => {
    const call = tracedGenerateCertificate({
      type: 'asset-origin',
      securityLevel: 'military',
      location: { latitude: 0, longitude: 0, accuracy: 1, timestamp: Date.now() },
      privateKey: 'pk',
      publicKey: 'pub',
    });
    await expect(call).rejects.toThrow('Validation failed');
  });
});

describe('tracedVerifyCertificate', () => {
  it('should be a function', () => {
    expect(typeof tracedVerifyCertificate).toBe('function');
  });

  it('should verify a real signed standard certificate', async () => {
    const keyPair = generateKeyPair();
    const cert = await tracedGenerateCertificate({
      type: 'location',
      securityLevel: 'standard',
      location: makeLocation(),
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });

    const result = await tracedVerifyCertificate(cert);
    expect(result.isValid).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.checks.signatureValid).toBe(true);
  });

  it('should verify a real signed military-grade certificate', async () => {
    const keyPair = generateKeyPair();
    const cert = await tracedGenerateCertificate({
      type: 'asset-origin',
      securityLevel: 'military',
      location: { latitude: 0, longitude: 0, accuracy: 1, timestamp: Date.now() },
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
      assetData: {
        commodityType: 'gold',
        estimatedWeight: 10,
        unit: 'kg',
      },
      claims: [],
    });

    const result = await tracedVerifyCertificate(cert);
    expect(result.isValid).toBe(true);
    expect(result.checks.signatureValid).toBe(true);
  });

  it('should reject certificates with placeholder signatures', async () => {
    const fakeCert = {
      certificateId: 'CERT_001',
      version: '1.0',
      type: 'location' as const,
      securityLevel: 'standard' as const,
      metadata: {
        issuer: 'test',
        issuedAt: Date.now(),
        userRole: 'producer',
        deviceId: 'dev-1',
        location: makeLocation(),
      },
      dataHash: 'abcd1234',
      verificationData: {
        publicKey: 'pk_test',
        signature: 'sig_test',
        timestamp: Date.now(),
      },
      createdAt: Date.now(),
      signature: 'sig_test',
    };

    const result = await tracedVerifyCertificate(fakeCert);
    expect(result.isValid).toBe(false);
    expect(result.checks.signatureValid).toBe(false);
  });

  it('should reject tampered certificates', async () => {
    const keyPair = generateKeyPair();
    const cert = await tracedGenerateCertificate({
      type: 'location',
      securityLevel: 'standard',
      location: makeLocation(),
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });

    const tampered = {
      ...cert,
      metadata: {
        ...cert.metadata,
        deviceId: 'tampered-device',
      },
    };

    const result = await tracedVerifyCertificate(tampered);
    expect(result.isValid).toBe(false);
    expect(result.checks.signatureValid).toBe(false);
  });

  it('should report invalid certificate structure', async () => {
    const keyPair = generateKeyPair();
    const cert = await tracedGenerateCertificate({
      type: 'location',
      securityLevel: 'standard',
      location: makeLocation(),
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });
    const invalidCert = {
      ...cert,
      certificateId: '',
    };

    const result = await tracedVerifyCertificate(invalidCert);
    expect(result.isValid).toBe(false);
    expect(result.details).toContain('Missing certificate ID');
  });
});

// =============================================================================
// TRACED QR CODE OPERATIONS
// =============================================================================

describe('tracedGenerateQRCode', () => {
  it('should be a function', () => {
    expect(typeof tracedGenerateQRCode).toBe('function');
  });

  it('should generate QR code with URI and data payload', async () => {
    const qr = await tracedGenerateQRCode({
      certificateId: 'CERT_001',
      type: 'certificate',
    });
    expect(qr.id).toBeTruthy();
    expect(qr.qrCodeUri.startsWith('data:application/json;base64,')).toBe(true);
    expect(qr.data.certificateId).toBe('CERT_001');
  });

  it('should generate photo QR code', async () => {
    const qr = await tracedGenerateQRCode({
      certificateId: 'CERT_002',
      type: 'photo',
      metadata: { photoHash: 'abc123', location: { latitude: 1, longitude: 2 } },
    });
    expect(qr.id).toBeTruthy();
    expect(qr.data.type).toBe('photo');
  });

  it('should generate asset-lot QR code', async () => {
    const qr = await tracedGenerateQRCode({
      certificateId: 'CERT_003',
      type: 'asset-lot',
      metadata: {
        assetWeight: 100,
        assetUnit: 'kg',
        purity: 0.995,
        commodityType: 'gold',
        producerId: 'P001',
        operatorRole: 'producer',
        location: { latitude: 6.2, longitude: -1.6 },
      },
    });
    expect(qr.id).toBeTruthy();
    expect(qr.data.type).toBe('asset-lot');
  });

  it('should generate certificate QR code with asset metadata', async () => {
    const qr = await tracedGenerateQRCode({
      certificateId: 'CERT_004',
      type: 'certificate',
      metadata: {
        assetWeight: 50,
        commodityType: 'silver',
      },
    });
    expect(qr.id).toBeTruthy();
  });
});

describe('tracedVerifyQRCode', () => {
  it('should be a function', () => {
    expect(typeof tracedVerifyQRCode).toBe('function');
  });

  it('should return invalid result for malformed QR data', async () => {
    const result = await tracedVerifyQRCode('some-qr-data');
    expect(result.isValid).toBe(false);
  });

  it('should verify valid generated QR data', async () => {
    const qr = await tracedGenerateQRCode({
      certificateId: 'CERT_001',
      type: 'location',
      metadata: {
        location: { latitude: 1, longitude: 2 },
      },
    });
    const result = await tracedVerifyQRCode(qr.dataString);
    expect(result.isValid).toBe(true);
  });
});

// =============================================================================
// TRACED PROOF BUNDLE OPERATIONS
// =============================================================================

describe('tracedCreateProofBundle', () => {
  it('should be a function', () => {
    expect(typeof tracedCreateProofBundle).toBe('function');
  });

  it('should create a proof bundle with cryptographic proof', async () => {
    const bundle = await tracedCreateProofBundle({
      type: 'location',
      location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
    });
    expect(bundle.id).toBeTruthy();
    expect(bundle.proofs.cryptographicProof.signature).toBeTruthy();
    expect(bundle.proofs.locationProof).toBeDefined();
  });

  it('should create a proof bundle without location proof', async () => {
    const bundle = await tracedCreateProofBundle({
      type: 'location',
    });
    expect(bundle.id).toBeTruthy();
    expect(bundle.proofs.cryptographicProof.signature).toBeTruthy();
    expect(bundle.proofs.locationProof).toBeUndefined();
  });

  it('should create a proof bundle with photo hashes', async () => {
    const bundle = await tracedCreateProofBundle({
      type: 'photo',
      photoHashes: ['hash1', 'hash2', 'hash3'],
    });
    expect(bundle.id).toBeTruthy();
    expect(bundle.proofs.photoProofs).toBeDefined();
    expect(bundle.proofs.photoProofs!.length).toBe(3);
  });

  it('should create a proof bundle with claims', async () => {
    const bundle = await tracedCreateProofBundle({
      type: 'compliance',
      claims: [
        { type: 'origin', value: 'Ghana', confidence: 0.95 },
        { type: 'weight', value: '10kg', confidence: 0.99 },
      ],
    });
    expect(bundle.id).toBeTruthy();
    expect(bundle.claims).toBeDefined();
    expect(bundle.claims!.length).toBe(2);
  });

  it('should create a proof bundle without claims when array is empty', async () => {
    const bundle = await tracedCreateProofBundle({
      type: 'location',
      claims: [],
    });
    expect(bundle.id).toBeTruthy();
    expect(bundle.claims).toBeUndefined();
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
    const logs: VerificationOperationLog[] = [
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
    const logs: VerificationOperationLog[] = [
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
    const logs: VerificationOperationLog[] = [
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
    const logs: VerificationOperationLog[] = [
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
    const logs: VerificationOperationLog[] = [
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
    const logs: VerificationOperationLog[] = [
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
    const logs: VerificationOperationLog[] = [
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
    const logs: VerificationOperationLog[] = [
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
