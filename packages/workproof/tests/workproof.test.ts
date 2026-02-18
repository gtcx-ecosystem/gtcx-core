import { describe, it, expect } from 'vitest';

import {
  WorkProofTypeSchema,
  WorkProofClaimSchema,
  WorkProofSchema,
} from '../src/workproof/schemas';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const validClaim = {
  predicateType: 'CommodityProduced' as const,
  predicateURI: 'tradepass://workproof/production/commodity-produced',
  value: { kind: 'boolean', value: true },
  evidence: [
    {
      type: 'satellite_image' as const,
      hash: 'sha256:abc123',
      timestamp: 1704067200000,
    },
  ],
  confidence: 0.95,
  issuedAt: 1704067200000,
  proof: {
    type: 'Ed25519Signature2020' as const,
    created: '2024-01-01T00:00:00Z',
    verificationMethod: 'did:example:verifier#key-1',
    proofValue: 'z3FXQFj8RvWPy...',
  },
};

const validWorkProof = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential', 'WorkProof'],
  issuer: 'did:example:issuer',
  issuanceDate: '2024-01-01T00:00:00Z',
  credentialSubject: {
    id: 'did:example:subject',
    proofType: 'ProductionEvent' as const,
    tradepassId: 'tp-001',
    issuerId: 'did:example:issuer',
    issuerRole: 'inspector',
    claims: [validClaim],
  },
  workProofVersion: '2.1' as const,
};

// ---------------------------------------------------------------------------
// WorkProofTypeSchema
// ---------------------------------------------------------------------------

describe('WorkProofTypeSchema', () => {
  const ALL_TYPES = WorkProofTypeSchema.options;

  it('has exactly 12 proof types', () => {
    expect(ALL_TYPES).toHaveLength(12);
  });

  it.each([
    'ProductionEvent',
    'PaymentReceived',
    'TrainingCompletion',
    'CertificationEarned',
    'ComplianceVerification',
    'RoleAssignment',
    'LoanRepayment',
    'MilestoneAchievement',
    'GCISnapshot',
    'TenureMark',
    'CommunityEndorsement',
    'TraditionalAuthorityAttestation',
  ] as const)('accepts proof type "%s"', (t) => {
    const result = WorkProofTypeSchema.safeParse(t);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(t);
  });

  it('rejects an invalid proof type', () => {
    const result = WorkProofTypeSchema.safeParse('FakeType');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// WorkProofSchema — full parsing
// ---------------------------------------------------------------------------

describe('WorkProofSchema', () => {
  it('accepts a full valid WorkProof and checks every parsed field', () => {
    const result = WorkProofSchema.safeParse(validWorkProof);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data['@context']).toEqual(['https://www.w3.org/2018/credentials/v1']);
      expect(result.data.type).toContain('VerifiableCredential');
      expect(result.data.type).toContain('WorkProof');
      expect(result.data.issuer).toBe('did:example:issuer');
      expect(result.data.issuanceDate).toBe('2024-01-01T00:00:00Z');
      expect(result.data.workProofVersion).toBe('2.1');
      expect(result.data.credentialSubject.id).toBe('did:example:subject');
      expect(result.data.credentialSubject.proofType).toBe('ProductionEvent');
      expect(result.data.credentialSubject.tradepassId).toBe('tp-001');
      expect(result.data.credentialSubject.issuerId).toBe('did:example:issuer');
      expect(result.data.credentialSubject.issuerRole).toBe('inspector');
      expect(result.data.credentialSubject.claims).toHaveLength(1);
      expect(result.data.credentialSubject.claims[0].confidence).toBe(0.95);
    }
  });

  it('rejects type array missing "VerifiableCredential" and checks error message', () => {
    const bad = { ...validWorkProof, type: ['WorkProof'] };
    const result = WorkProofSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('VerifiableCredential');
      expect(result.error.issues[0].message).toContain('WorkProof');
    }
  });

  it('rejects type array missing "WorkProof"', () => {
    const bad = { ...validWorkProof, type: ['VerifiableCredential'] };
    const result = WorkProofSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('WorkProof');
    }
  });

  it('rejects workProofVersion other than "2.1"', () => {
    const bad = { ...validWorkProof, workProofVersion: '1.0' };
    const result = WorkProofSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].code).toBe('invalid_literal');
  });

  it('rejects missing workProofVersion', () => {
    const noVersion = { ...validWorkProof };
    delete (noVersion as Record<string, unknown>)['workProofVersion'];
    const result = WorkProofSchema.safeParse(noVersion);
    expect(result.success).toBe(false);
  });

  it('rejects invalid issuanceDate (not datetime)', () => {
    const bad = { ...validWorkProof, issuanceDate: 'not-a-date' };
    const result = WorkProofSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });

  it('accepts issuanceDate with milliseconds', () => {
    const wp = { ...validWorkProof, issuanceDate: '2024-01-01T00:00:00.000Z' };
    const result = WorkProofSchema.safeParse(wp);
    expect(result.success).toBe(true);
  });

  // --- Issuer variants ---

  it('accepts issuer as a plain string', () => {
    const wp = { ...validWorkProof, issuer: 'did:gtcx:some-issuer' };
    const result = WorkProofSchema.safeParse(wp);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.issuer).toBe('did:gtcx:some-issuer');
  });

  it('accepts issuer as object with id and name', () => {
    const wp = { ...validWorkProof, issuer: { id: 'did:gtcx:issuer', name: 'Test Issuer' } };
    const result = WorkProofSchema.safeParse(wp);
    expect(result.success).toBe(true);
    if (result.success) {
      const issuerObj = result.data.issuer as { id: string; name?: string };
      expect(issuerObj.id).toBe('did:gtcx:issuer');
      expect(issuerObj.name).toBe('Test Issuer');
    }
  });

  it('accepts issuer as object without optional name', () => {
    const wp = { ...validWorkProof, issuer: { id: 'did:gtcx:issuer' } };
    const result = WorkProofSchema.safeParse(wp);
    expect(result.success).toBe(true);
    if (result.success) {
      const issuerObj = result.data.issuer as { id: string; name?: string };
      expect(issuerObj.name).toBeUndefined();
    }
  });

  // --- Optional proof sub-object ---

  it('accepts WorkProof with outer proof object (all 5 fields)', () => {
    const wp = {
      ...validWorkProof,
      proof: {
        type: 'Ed25519Signature2020',
        created: '2024-01-01T00:00:00Z',
        verificationMethod: 'did:example:verifier#key-1',
        proofPurpose: 'assertionMethod',
        proofValue: 'z3FXQFj8...',
      },
    };
    const result = WorkProofSchema.safeParse(wp);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.proof?.type).toBe('Ed25519Signature2020');
      expect(result.data.proof?.proofPurpose).toBe('assertionMethod');
    }
  });

  it('rejects outer proof with empty string fields', () => {
    const wp = {
      ...validWorkProof,
      proof: {
        type: '',
        created: '2024-01-01T00:00:00Z',
        verificationMethod: 'did:example:verifier#key-1',
        proofPurpose: 'assertionMethod',
        proofValue: 'z3FXQFj8...',
      },
    };
    const result = WorkProofSchema.safeParse(wp);
    expect(result.success).toBe(false);
  });

  it('accepts WorkProof without outer proof (optional)', () => {
    const result = WorkProofSchema.safeParse(validWorkProof);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.proof).toBeUndefined();
  });

  // --- Empty claims ---

  it('rejects empty claims array', () => {
    const bad = {
      ...validWorkProof,
      credentialSubject: { ...validWorkProof.credentialSubject, claims: [] },
    };
    const result = WorkProofSchema.safeParse(bad);
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// WorkProofClaimSchema
// ---------------------------------------------------------------------------

describe('WorkProofClaimSchema', () => {
  it('accepts a valid claim and checks parsed fields', () => {
    const result = WorkProofClaimSchema.safeParse(validClaim);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.predicateType).toBe('CommodityProduced');
      expect(result.data.predicateURI).toBe('tradepass://workproof/production/commodity-produced');
      expect(result.data.confidence).toBe(0.95);
      expect(result.data.issuedAt).toBe(1704067200000);
      expect(result.data.evidence).toHaveLength(1);
      expect(result.data.proof.type).toBe('Ed25519Signature2020');
    }
  });

  it('accepts confidence at 0', () => {
    const result = WorkProofClaimSchema.safeParse({ ...validClaim, confidence: 0 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.confidence).toBe(0);
  });

  it('accepts confidence at 1', () => {
    const result = WorkProofClaimSchema.safeParse({ ...validClaim, confidence: 1 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.confidence).toBe(1);
  });

  it('rejects confidence above 1', () => {
    const result = WorkProofClaimSchema.safeParse({ ...validClaim, confidence: 1.01 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].code).toBe('too_big');
  });

  it('rejects confidence below 0', () => {
    const result = WorkProofClaimSchema.safeParse({ ...validClaim, confidence: -0.01 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].code).toBe('too_small');
  });

  it('rejects empty evidence array (min 1)', () => {
    const result = WorkProofClaimSchema.safeParse({ ...validClaim, evidence: [] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].code).toBe('too_small');
  });

  it('accepts optional validUntil when provided', () => {
    const result = WorkProofClaimSchema.safeParse({ ...validClaim, validUntil: 1735689600000 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.validUntil).toBe(1735689600000);
  });

  it('accepts claim without validUntil (optional)', () => {
    const result = WorkProofClaimSchema.safeParse(validClaim);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.validUntil).toBeUndefined();
  });

  it('requires proof object', () => {
    const noClaim = { ...validClaim };
    delete (noClaim as Record<string, unknown>)['proof'];
    const result = WorkProofClaimSchema.safeParse(noClaim);
    expect(result.success).toBe(false);
  });

  it('accepts claim proof with EcdsaSecp256k1Signature2019 type', () => {
    const altProof = {
      ...validClaim,
      proof: {
        type: 'EcdsaSecp256k1Signature2019' as const,
        created: '2024-01-01T00:00:00Z',
        verificationMethod: 'did:example:verifier#key-2',
        proofValue: 'z456def...',
      },
    };
    const result = WorkProofClaimSchema.safeParse(altProof);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.proof.type).toBe('EcdsaSecp256k1Signature2019');
  });
});
