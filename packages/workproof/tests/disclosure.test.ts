import { describe, it, expect } from 'vitest';

import {
  ThresholdOperatorSchema,
  DisclosureLevelSchema,
  ThresholdClaimSchema,
  SelectiveDisclosureRequestSchema,
  SelectiveDisclosureResponseSchema,
  ThresholdResultSchema,
} from '../src/disclosure/schemas';

// ---------------------------------------------------------------------------
// ThresholdOperatorSchema
// ---------------------------------------------------------------------------

describe('ThresholdOperatorSchema', () => {
  it.each(['gt', 'gte', 'lt', 'lte', 'eq', 'range'] as const)(
    'accepts threshold operator "%s"',
    (op) => {
      const result = ThresholdOperatorSchema.safeParse(op);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe(op);
    }
  );

  it('rejects an invalid operator', () => {
    const result = ThresholdOperatorSchema.safeParse('between');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// DisclosureLevelSchema
// ---------------------------------------------------------------------------

describe('DisclosureLevelSchema', () => {
  it.each(['full', 'summary', 'category', 'threshold', 'single_credential'] as const)(
    'accepts disclosure level "%s"',
    (level) => {
      const result = DisclosureLevelSchema.safeParse(level);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe(level);
    }
  );

  it('rejects an invalid disclosure level', () => {
    const result = DisclosureLevelSchema.safeParse('private');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// ThresholdClaimSchema
// ---------------------------------------------------------------------------

describe('ThresholdClaimSchema', () => {
  it('accepts "gte" with a single number threshold', () => {
    const result = ThresholdClaimSchema.safeParse({
      property: 'GCIScoreRecorded',
      operator: 'gte',
      threshold: 50,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.property).toBe('GCIScoreRecorded');
      expect(result.data.operator).toBe('gte');
      expect(result.data.threshold).toBe(50);
    }
  });

  it('accepts "range" with [min, max] tuple', () => {
    const result = ThresholdClaimSchema.safeParse({
      property: 'GCIScoreRecorded',
      operator: 'range',
      threshold: [10, 90] as [number, number],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.operator).toBe('range');
      expect(result.data.threshold).toEqual([10, 90]);
    }
  });

  it('rejects "range" with a single number', () => {
    const result = ThresholdClaimSchema.safeParse({
      property: 'GCIScoreRecorded',
      operator: 'range',
      threshold: 50,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('range operator requires');
    }
  });

  it('rejects "gte" with a tuple', () => {
    const result = ThresholdClaimSchema.safeParse({
      property: 'GCIScoreRecorded',
      operator: 'gte',
      threshold: [10, 20],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('range operator requires');
    }
  });

  it('accepts optional unit field', () => {
    const result = ThresholdClaimSchema.safeParse({
      property: 'QuantityVerified',
      operator: 'gt',
      threshold: 100,
      unit: 'kg',
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.unit).toBe('kg');
  });

  it('rejects invalid property (predicate type)', () => {
    const result = ThresholdClaimSchema.safeParse({
      property: 'InvalidPredicate',
      operator: 'eq',
      threshold: 42,
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// SelectiveDisclosureRequestSchema
// ---------------------------------------------------------------------------

describe('SelectiveDisclosureRequestSchema', () => {
  const fullRequest = {
    requestId: 'req-001',
    requestorDID: 'did:gtcx:requestor',
    subjectDID: 'did:gtcx:subject',
    disclosureLevel: 'threshold' as const,
    requestedCategories: ['production', 'financial'],
    requestedPredicates: ['GCIScoreRecorded' as const, 'QuantityVerified' as const],
    thresholdClaims: [
      {
        property: 'GCIScoreRecorded' as const,
        operator: 'gte' as const,
        threshold: 50,
      },
    ],
    purpose: 'credit assessment',
    expiresAt: 1800000000,
  };

  it('accepts a full request with all optional fields and checks parsed values', () => {
    const result = SelectiveDisclosureRequestSchema.safeParse(fullRequest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.requestId).toBe('req-001');
      expect(result.data.requestorDID).toBe('did:gtcx:requestor');
      expect(result.data.subjectDID).toBe('did:gtcx:subject');
      expect(result.data.disclosureLevel).toBe('threshold');
      expect(result.data.requestedCategories).toEqual(['production', 'financial']);
      expect(result.data.requestedPredicates).toEqual(['GCIScoreRecorded', 'QuantityVerified']);
      expect(result.data.thresholdClaims).toHaveLength(1);
      expect(result.data.purpose).toBe('credit assessment');
      expect(result.data.expiresAt).toBe(1800000000);
    }
  });

  it('accepts a minimal request without optional fields', () => {
    const minimal = {
      requestId: 'req-002',
      requestorDID: 'did:gtcx:requestor',
      subjectDID: 'did:gtcx:subject',
      disclosureLevel: 'summary' as const,
      purpose: 'credit check',
      expiresAt: 1800000000,
    };
    const result = SelectiveDisclosureRequestSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.requestedCategories).toBeUndefined();
      expect(result.data.requestedPredicates).toBeUndefined();
      expect(result.data.thresholdClaims).toBeUndefined();
    }
  });

  it('rejects empty purpose string', () => {
    const result = SelectiveDisclosureRequestSchema.safeParse({
      requestId: 'req-003',
      requestorDID: 'did:gtcx:requestor',
      subjectDID: 'did:gtcx:subject',
      disclosureLevel: 'full',
      purpose: '',
      expiresAt: 1800000000,
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// SelectiveDisclosureResponseSchema
// ---------------------------------------------------------------------------

describe('SelectiveDisclosureResponseSchema', () => {
  it('accepts a valid response and checks parsed fields', () => {
    const response = {
      requestId: 'req-001',
      disclosureLevel: 'threshold' as const,
      thresholdResults: [
        {
          claim: {
            property: 'GCIScoreRecorded' as const,
            operator: 'gte' as const,
            threshold: 50,
          },
          satisfied: true,
          zkProofUri: 'ipfs://Qm...',
        },
      ],
      generatedAt: 1704067200000,
      signature: 'z3FXQ...',
    };
    const result = SelectiveDisclosureResponseSchema.safeParse(response);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.requestId).toBe('req-001');
      expect(result.data.disclosureLevel).toBe('threshold');
      expect(result.data.thresholdResults).toHaveLength(1);
      expect(result.data.generatedAt).toBe(1704067200000);
      expect(result.data.signature).toBe('z3FXQ...');
    }
  });

  it('accepts response without optional fields', () => {
    const minimal = {
      requestId: 'req-002',
      disclosureLevel: 'summary' as const,
      generatedAt: 1704067200000,
    };
    const result = SelectiveDisclosureResponseSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.thresholdResults).toBeUndefined();
      expect(result.data.signature).toBeUndefined();
    }
  });
});

// ---------------------------------------------------------------------------
// ThresholdResultSchema
// ---------------------------------------------------------------------------

describe('ThresholdResultSchema', () => {
  it('accepts satisfied=true with zkProofUri', () => {
    const result = ThresholdResultSchema.safeParse({
      claim: { property: 'GCIScoreRecorded', operator: 'gte', threshold: 50 },
      satisfied: true,
      zkProofUri: 'ipfs://QmABC123',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.satisfied).toBe(true);
      expect(result.data.zkProofUri).toBe('ipfs://QmABC123');
    }
  });

  it('accepts satisfied=false without zkProofUri', () => {
    const result = ThresholdResultSchema.safeParse({
      claim: { property: 'GCIScoreRecorded', operator: 'gte', threshold: 50 },
      satisfied: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.satisfied).toBe(false);
      expect(result.data.zkProofUri).toBeUndefined();
    }
  });
});
