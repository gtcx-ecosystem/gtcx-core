import { describe, it, expect } from 'vitest';

import {
  IssuerTrustLevelSchema,
  AdmissionCriteriaSchema,
  TrustRegistryEntrySchema,
  TrustRegistrySchema,
} from '../src/trust/schemas';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const validAdmissionCriteria = {
  requiredDocuments: ['business_license', 'tax_certificate'],
  jurisdictions: ['CD', 'UG'],
};

const validEntry = {
  issuerDID: 'did:gtcx:issuer-001',
  issuerName: 'Congo Mining Authority',
  trustLevel: 'licensed' as const,
  admissionCriteria: validAdmissionCriteria,
  isActive: true,
  admittedAt: 1704067200000,
  supportedProofTypes: ['ProductionEvent' as const, 'ComplianceVerification' as const],
};

// ---------------------------------------------------------------------------
// IssuerTrustLevelSchema
// ---------------------------------------------------------------------------

describe('IssuerTrustLevelSchema', () => {
  it.each(['sovereign', 'licensed', 'accredited', 'community'] as const)(
    'accepts trust level "%s"',
    (level) => {
      const result = IssuerTrustLevelSchema.safeParse(level);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe(level);
    }
  );

  it('rejects an invalid trust level', () => {
    const result = IssuerTrustLevelSchema.safeParse('untrusted');
    expect(result.success).toBe(false);
  });

  it('rejects an empty string', () => {
    const result = IssuerTrustLevelSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// AdmissionCriteriaSchema
// ---------------------------------------------------------------------------

describe('AdmissionCriteriaSchema', () => {
  it('accepts valid admission criteria and checks parsed fields', () => {
    const result = AdmissionCriteriaSchema.safeParse(validAdmissionCriteria);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.requiredDocuments).toEqual(['business_license', 'tax_certificate']);
      expect(result.data.jurisdictions).toEqual(['CD', 'UG']);
    }
  });

  it('rejects empty jurisdictions array (min 1)', () => {
    const result = AdmissionCriteriaSchema.safeParse({
      ...validAdmissionCriteria,
      jurisdictions: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_small');
  });

  it('rejects jurisdiction string with single char (min 2)', () => {
    const result = AdmissionCriteriaSchema.safeParse({
      ...validAdmissionCriteria,
      jurisdictions: ['X'],
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_small');
  });

  it('accepts jurisdiction with exactly 2 chars', () => {
    const result = AdmissionCriteriaSchema.safeParse({
      ...validAdmissionCriteria,
      jurisdictions: ['CD'],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.jurisdictions[0]).toBe('CD');
  });

  it('accepts optional minimumOperationalYears as nonnegative integer', () => {
    const result = AdmissionCriteriaSchema.safeParse({
      ...validAdmissionCriteria,
      minimumOperationalYears: 5,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.minimumOperationalYears).toBe(5);
  });

  it('accepts minimumOperationalYears at 0', () => {
    const result = AdmissionCriteriaSchema.safeParse({
      ...validAdmissionCriteria,
      minimumOperationalYears: 0,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.minimumOperationalYears).toBe(0);
  });

  it('rejects negative minimumOperationalYears', () => {
    const result = AdmissionCriteriaSchema.safeParse({
      ...validAdmissionCriteria,
      minimumOperationalYears: -1,
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional commodityRestrictions', () => {
    const result = AdmissionCriteriaSchema.safeParse({
      ...validAdmissionCriteria,
      commodityRestrictions: ['cobalt', 'gold'],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.commodityRestrictions).toEqual(['cobalt', 'gold']);
  });
});

// ---------------------------------------------------------------------------
// TrustRegistryEntrySchema
// ---------------------------------------------------------------------------

describe('TrustRegistryEntrySchema', () => {
  it('accepts a valid entry and checks parsed fields individually', () => {
    const result = TrustRegistryEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.issuerDID).toBe('did:gtcx:issuer-001');
      expect(result.data.issuerName).toBe('Congo Mining Authority');
      expect(result.data.trustLevel).toBe('licensed');
      expect(result.data.isActive).toBe(true);
      expect(result.data.admittedAt).toBe(1704067200000);
      expect(result.data.supportedProofTypes).toEqual([
        'ProductionEvent',
        'ComplianceVerification',
      ]);
      expect(result.data.expiresAt).toBeUndefined();
      expect(result.data.revokedAt).toBeUndefined();
      expect(result.data.revokeReason).toBeUndefined();
      expect(result.data.metadata).toBeUndefined();
    }
  });

  it('rejects empty supportedProofTypes (min 1)', () => {
    const result = TrustRegistryEntrySchema.safeParse({ ...validEntry, supportedProofTypes: [] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_small');
  });

  it('rejects invalid proof type in supportedProofTypes', () => {
    const result = TrustRegistryEntrySchema.safeParse({
      ...validEntry,
      supportedProofTypes: ['FakeProofType'],
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid proof types from the 12 WorkProof types', () => {
    const result = TrustRegistryEntrySchema.safeParse({
      ...validEntry,
      supportedProofTypes: ['ProductionEvent', 'LoanRepayment', 'GCISnapshot'],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.supportedProofTypes).toHaveLength(3);
  });

  it('accepts optional expiresAt', () => {
    const result = TrustRegistryEntrySchema.safeParse({ ...validEntry, expiresAt: 1800000000 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.expiresAt).toBe(1800000000);
  });

  it('accepts optional revokedAt and revokeReason', () => {
    const result = TrustRegistryEntrySchema.safeParse({
      ...validEntry,
      isActive: false,
      revokedAt: 1750000000,
      revokeReason: 'License expired and not renewed',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.revokedAt).toBe(1750000000);
      expect(result.data.revokeReason).toBe('License expired and not renewed');
    }
  });

  it('accepts optional metadata record', () => {
    const result = TrustRegistryEntrySchema.safeParse({
      ...validEntry,
      metadata: { region: 'Haut-Katanga', auditorId: 'audit-001' },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.metadata).toEqual({ region: 'Haut-Katanga', auditorId: 'audit-001' });
    }
  });
});

// ---------------------------------------------------------------------------
// TrustRegistrySchema
// ---------------------------------------------------------------------------

describe('TrustRegistrySchema', () => {
  it('accepts a valid registry and checks parsed fields', () => {
    const registry = {
      registryId: 'reg-001',
      version: '1.0',
      updatedAt: 1704067200000,
      entries: [validEntry],
    };
    const result = TrustRegistrySchema.safeParse(registry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.registryId).toBe('reg-001');
      expect(result.data.version).toBe('1.0');
      expect(result.data.updatedAt).toBe(1704067200000);
      expect(result.data.entries).toHaveLength(1);
    }
  });

  it('accepts empty entries array', () => {
    const registry = {
      registryId: 'reg-002',
      version: '1.0',
      updatedAt: 1704067200000,
      entries: [],
    };
    const result = TrustRegistrySchema.safeParse(registry);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.entries).toHaveLength(0);
  });

  it('rejects missing registryId', () => {
    const result = TrustRegistrySchema.safeParse({
      version: '1.0',
      updatedAt: 1704067200000,
      entries: [],
    });
    expect(result.success).toBe(false);
  });
});
