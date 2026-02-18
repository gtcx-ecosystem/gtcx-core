import { describe, it, expect } from 'vitest';

import {
  WorkProofEvidenceTypeSchema,
  WorkProofNewEvidenceTypeSchema,
  AIQualityAssessmentSchema,
  WorkProofEvidenceItemSchema,
  CaptureModeSchema,
} from '../src/evidence/schemas';

// ---------------------------------------------------------------------------
// WorkProofEvidenceTypeSchema
// ---------------------------------------------------------------------------

describe('WorkProofEvidenceTypeSchema', () => {
  // All 11 existing @gtcx/verification evidence types
  const verificationTypes = [
    'government_id',
    'biometric_face',
    'biometric_fingerprint',
    'corporate_registry',
    'sanctions_screening',
    'site_audit',
    'assay_report',
    'photo_evidence',
    'gps_location',
    'document_hash',
    'witness_attestation',
  ] as const;

  it.each(verificationTypes)('accepts existing evidence type "%s"', (type) => {
    const result = WorkProofEvidenceTypeSchema.safeParse(type);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(type);
  });

  // All 8 new WorkProof evidence types
  const newTypes = [
    'satellite_image',
    'financial_record',
    'voice_recording',
    'video_capture',
    'community_attestation',
    'traditional_authority',
    'sensor_data',
    'system_log',
  ] as const;

  it.each(newTypes)('accepts new WorkProof evidence type "%s"', (type) => {
    const result = WorkProofEvidenceTypeSchema.safeParse(type);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(type);
  });

  it('has exactly 8 new evidence types', () => {
    expect(WorkProofNewEvidenceTypeSchema.options).toHaveLength(8);
  });

  it('rejects an invalid evidence type', () => {
    const result = WorkProofEvidenceTypeSchema.safeParse('crystal_ball');
    expect(result.success).toBe(false);
  });

  it('rejects an empty string', () => {
    const result = WorkProofEvidenceTypeSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// AIQualityAssessmentSchema
// ---------------------------------------------------------------------------

describe('AIQualityAssessmentSchema', () => {
  const validAI = {
    qualityScore: 0.85,
    clarityScore: 0.9,
    authenticityScore: 0.95,
    relevanceScore: 0.8,
    assessmentModel: 'gpt-4-vision',
    assessedAt: 1704067200000,
  };

  it('accepts a fully valid assessment and checks parsed fields', () => {
    const result = AIQualityAssessmentSchema.safeParse(validAI);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.qualityScore).toBe(0.85);
      expect(result.data.clarityScore).toBe(0.9);
      expect(result.data.authenticityScore).toBe(0.95);
      expect(result.data.relevanceScore).toBe(0.8);
      expect(result.data.assessmentModel).toBe('gpt-4-vision');
      expect(result.data.assessedAt).toBe(1704067200000);
    }
  });

  it('accepts all scores at lower boundary (0)', () => {
    const data = {
      ...validAI,
      qualityScore: 0,
      clarityScore: 0,
      authenticityScore: 0,
      relevanceScore: 0,
    };
    const result = AIQualityAssessmentSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.qualityScore).toBe(0);
      expect(result.data.clarityScore).toBe(0);
    }
  });

  it('accepts all scores at upper boundary (1)', () => {
    const data = {
      ...validAI,
      qualityScore: 1,
      clarityScore: 1,
      authenticityScore: 1,
      relevanceScore: 1,
    };
    const result = AIQualityAssessmentSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.qualityScore).toBe(1);
  });

  it('rejects qualityScore above 1', () => {
    const result = AIQualityAssessmentSchema.safeParse({ ...validAI, qualityScore: 1.01 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].code).toBe('too_big');
  });

  it('rejects negative clarityScore', () => {
    const result = AIQualityAssessmentSchema.safeParse({ ...validAI, clarityScore: -0.1 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].code).toBe('too_small');
  });

  it('rejects empty assessmentModel', () => {
    const result = AIQualityAssessmentSchema.safeParse({ ...validAI, assessmentModel: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].code).toBe('too_small');
  });

  it('rejects missing assessedAt', () => {
    const noAssessedAt = { ...validAI };
    delete (noAssessedAt as Record<string, unknown>)['assessedAt'];
    const result = AIQualityAssessmentSchema.safeParse(noAssessedAt);
    expect(result.success).toBe(false);
  });

  it('rejects non-positive assessedAt (0)', () => {
    const result = AIQualityAssessmentSchema.safeParse({ ...validAI, assessedAt: 0 });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// CaptureModeSchema
// ---------------------------------------------------------------------------

describe('CaptureModeSchema', () => {
  it.each(['online', 'offline', 'sms'] as const)('accepts capture mode "%s"', (mode) => {
    const result = CaptureModeSchema.safeParse(mode);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(mode);
  });

  it('rejects an invalid capture mode', () => {
    const result = CaptureModeSchema.safeParse('bluetooth');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// WorkProofEvidenceItemSchema
// ---------------------------------------------------------------------------

describe('WorkProofEvidenceItemSchema', () => {
  const fullItem = {
    type: 'photo_evidence' as const,
    hash: 'sha256:abc123def456',
    timestamp: 1704067200000,
    uri: 'https://evidence.example.com/img.jpg',
    mimeType: 'image/jpeg',
    captureMode: 'online' as const,
    deviceId: 'device-001',
    aiQuality: {
      qualityScore: 0.9,
      clarityScore: 0.8,
      authenticityScore: 0.95,
      relevanceScore: 0.85,
      assessmentModel: 'gpt-4-vision',
      assessedAt: 1704067200000,
    },
    metadata: { source: 'mobile', resolution: '4032x3024' },
  };

  it('accepts a full evidence item with all optional fields and checks parsed values', () => {
    const result = WorkProofEvidenceItemSchema.safeParse(fullItem);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('photo_evidence');
      expect(result.data.hash).toBe('sha256:abc123def456');
      expect(result.data.timestamp).toBe(1704067200000);
      expect(result.data.uri).toBe('https://evidence.example.com/img.jpg');
      expect(result.data.mimeType).toBe('image/jpeg');
      expect(result.data.captureMode).toBe('online');
      expect(result.data.deviceId).toBe('device-001');
      expect(result.data.aiQuality?.qualityScore).toBe(0.9);
      expect(result.data.metadata).toEqual({ source: 'mobile', resolution: '4032x3024' });
    }
  });

  it('accepts a minimal evidence item (only required fields)', () => {
    const minimal = { type: 'sensor_data', hash: 'sha256:def456', timestamp: 1704067200000 };
    const result = WorkProofEvidenceItemSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.type).toBe('sensor_data');
      expect(result.data.uri).toBeUndefined();
      expect(result.data.captureMode).toBeUndefined();
      expect(result.data.aiQuality).toBeUndefined();
    }
  });

  it('rejects empty hash', () => {
    const result = WorkProofEvidenceItemSchema.safeParse({
      type: 'system_log',
      hash: '',
      timestamp: 1704067200000,
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].code).toBe('too_small');
  });

  it('rejects zero timestamp (must be positive)', () => {
    const result = WorkProofEvidenceItemSchema.safeParse({
      type: 'system_log',
      hash: 'sha256:abc',
      timestamp: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative timestamp', () => {
    const result = WorkProofEvidenceItemSchema.safeParse({
      type: 'system_log',
      hash: 'sha256:abc',
      timestamp: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid evidence type within item', () => {
    const result = WorkProofEvidenceItemSchema.safeParse({
      type: 'telepathy',
      hash: 'sha256:abc',
      timestamp: 1704067200000,
    });
    expect(result.success).toBe(false);
  });
});
