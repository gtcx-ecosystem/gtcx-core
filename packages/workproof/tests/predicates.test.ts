import { describe, it, expect } from 'vitest';

import { WORKPROOF_PREDICATE_URIS, WORKPROOF_PREDICATES } from '../src/predicates/registry';
import {
  WorkProofPredicateTypeSchema,
  PredicateCategorySchema,
  BooleanValueSchema,
  NumericValueSchema,
  RangeValueSchema,
  EnumValueSchema,
  HashValueSchema,
  LocalizedValueSchema,
  PredicateValueSchema,
  VerificationMethodSchema,
} from '../src/predicates/schemas';

// ---------------------------------------------------------------------------
// WorkProofPredicateTypeSchema
// ---------------------------------------------------------------------------

describe('WorkProofPredicateTypeSchema', () => {
  const ALL_TYPES = WorkProofPredicateTypeSchema.options;

  it('has exactly 57 predicate types', () => {
    expect(ALL_TYPES).toHaveLength(57);
  });

  it('parses every predicate type and returns the same value', () => {
    for (const t of ALL_TYPES) {
      const result = WorkProofPredicateTypeSchema.safeParse(t);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data).toBe(t);
    }
  });

  it('rejects an invalid predicate type', () => {
    const result = WorkProofPredicateTypeSchema.safeParse('MadeUpPredicate');
    expect(result.success).toBe(false);
  });

  it('rejects an empty string', () => {
    const result = WorkProofPredicateTypeSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// PredicateCategorySchema — category counts
// ---------------------------------------------------------------------------

describe('PredicateCategorySchema', () => {
  it('has exactly 10 categories', () => {
    expect(PredicateCategorySchema.options).toHaveLength(10);
  });

  // Expected counts per category from the enum grouping
  const categoryCounts: Record<string, number> = {
    Identity: 5,
    Production: 5,
    Location: 4,
    Compliance: 5,
    Financial: 5,
    Learning: 5,
    Performance: 4,
    Community: 5,
    Entity: 9,
    Continental: 10,
  };

  // Map each predicate type to its category based on position in the enum
  const categoryRanges: [string, string[]][] = [
    [
      'Identity',
      ['IdentityVerified', 'RoleHeld', 'EmploymentActive', 'TenureAchieved', 'CommunityMembership'],
    ],
    [
      'Production',
      [
        'CommodityProduced',
        'QuantityVerified',
        'QualityGraded',
        'OriginAuthenticated',
        'MethodCompliant',
      ],
    ],
    [
      'Location',
      ['SiteVerified', 'GeofenceCompliant', 'LocationConsistent', 'EnvironmentalCompliance'],
    ],
    [
      'Compliance',
      ['InspectionPassed', 'StandardMet', 'GCIScoreRecorded', 'ViolationFree', 'LicenseValid'],
    ],
    [
      'Financial',
      ['PaymentReceived', 'LoanDisbursed', 'RepaymentCompleted', 'SavingsDeposited', 'TaxWithheld'],
    ],
    [
      'Learning',
      [
        'ModuleCompleted',
        'AssessmentPassed',
        'CertificationEarned',
        'SkillDemonstrated',
        'MentorshipProvided',
      ],
    ],
    [
      'Performance',
      ['ConsistencyMaintained', 'QualityThresholdMet', 'ProductivityTarget', 'ReliabilityScore'],
    ],
    [
      'Community',
      [
        'PeerEndorsement',
        'ElderAttestation',
        'CooperativeMembership',
        'CommunityContribution',
        'MentorshipReceived',
      ],
    ],
    [
      'Entity',
      [
        'EntityRegistered',
        'SanctionsCleared',
        'PepCleared',
        'AdverseMediaCleared',
        'BeneficialOwnershipDisclosed',
        'AccreditationHeld',
        'EntityRecognized',
        'IssuedBy',
        'OwnershipChain',
      ],
    ],
    [
      'Continental',
      [
        'MiningLicenseValid',
        'GoldBuyingLicenseValid',
        'CooperativeRegistered',
        'Traceability3tTagged',
        'RegionalCertificationIcglrRcm',
        'RegionalProtocolSignatory',
        'PricePreciousMetalFix',
        'ConflictZoneCleared',
        'OriginSatelliteVerified',
        'PhysicalSealAttested',
      ],
    ],
  ];

  it.each(categoryRanges)(
    'category "%s" has correct count of predicates',
    (category, predicates) => {
      expect(predicates).toHaveLength(categoryCounts[category as string]!);
      for (const p of predicates) {
        expect(WorkProofPredicateTypeSchema.safeParse(p).success).toBe(true);
      }
    }
  );
});

// ---------------------------------------------------------------------------
// BooleanValueSchema
// ---------------------------------------------------------------------------

describe('BooleanValueSchema', () => {
  it('accepts { kind: "boolean", value: true }', () => {
    const result = BooleanValueSchema.safeParse({ kind: 'boolean', value: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kind).toBe('boolean');
      expect(result.data.value).toBe(true);
    }
  });

  it('accepts { kind: "boolean", value: false }', () => {
    const result = BooleanValueSchema.safeParse({ kind: 'boolean', value: false });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.value).toBe(false);
  });

  it('rejects wrong kind literal', () => {
    const result = BooleanValueSchema.safeParse({ kind: 'numeric', value: true });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('invalid_literal');
  });

  it('rejects non-boolean value', () => {
    const result = BooleanValueSchema.safeParse({ kind: 'boolean', value: 'yes' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('invalid_type');
  });
});

// ---------------------------------------------------------------------------
// NumericValueSchema
// ---------------------------------------------------------------------------

describe('NumericValueSchema', () => {
  it('accepts minimal numeric value (only kind + value)', () => {
    const result = NumericValueSchema.safeParse({ kind: 'numeric', value: 42 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kind).toBe('numeric');
      expect(result.data.value).toBe(42);
      expect(result.data.unit).toBeUndefined();
      expect(result.data.precision).toBeUndefined();
      expect(result.data.verificationMethod).toBeUndefined();
    }
  });

  it('accepts numeric value with unit', () => {
    const result = NumericValueSchema.safeParse({ kind: 'numeric', value: 3.5, unit: 'kg' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.unit).toBe('kg');
  });

  it('accepts numeric value with precision', () => {
    const result = NumericValueSchema.safeParse({ kind: 'numeric', value: 3.14159, precision: 2 });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.precision).toBe(2);
  });

  it.each(['measured', 'calculated', 'attested', 'ai_estimated'] as const)(
    'accepts verificationMethod "%s"',
    (method) => {
      const result = NumericValueSchema.safeParse({
        kind: 'numeric',
        value: 10,
        verificationMethod: method,
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.verificationMethod).toBe(method);
    }
  );

  it('rejects invalid verificationMethod', () => {
    const result = VerificationMethodSchema.safeParse('guessed');
    expect(result.success).toBe(false);
  });

  it('rejects non-number value', () => {
    const result = NumericValueSchema.safeParse({ kind: 'numeric', value: 'forty' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('invalid_type');
  });

  it('rejects negative precision', () => {
    const result = NumericValueSchema.safeParse({ kind: 'numeric', value: 1, precision: -1 });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// RangeValueSchema
// ---------------------------------------------------------------------------

describe('RangeValueSchema', () => {
  it('accepts range where min < max', () => {
    const result = RangeValueSchema.safeParse({ kind: 'range', min: 0, max: 100 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kind).toBe('range');
      expect(result.data.min).toBe(0);
      expect(result.data.max).toBe(100);
    }
  });

  it('accepts range where min equals max', () => {
    const result = RangeValueSchema.safeParse({ kind: 'range', min: 50, max: 50 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.min).toBe(50);
      expect(result.data.max).toBe(50);
    }
  });

  it('rejects range where min > max and checks error message', () => {
    const result = RangeValueSchema.safeParse({ kind: 'range', min: 100, max: 10 });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.message).toBe('min must be <= max');
  });

  it('accepts range with optional unit', () => {
    const result = RangeValueSchema.safeParse({ kind: 'range', min: 0, max: 10, unit: 'kg' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.unit).toBe('kg');
  });
});

// ---------------------------------------------------------------------------
// EnumValueSchema
// ---------------------------------------------------------------------------

describe('EnumValueSchema', () => {
  it('accepts value that is in allowedValues', () => {
    const result = EnumValueSchema.safeParse({
      kind: 'enum',
      value: 'high',
      allowedValues: ['high', 'medium', 'low'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe('high');
      expect(result.data.allowedValues).toEqual(['high', 'medium', 'low']);
    }
  });

  it('rejects value NOT in allowedValues and checks error message', () => {
    const result = EnumValueSchema.safeParse({
      kind: 'enum',
      value: 'extreme',
      allowedValues: ['high', 'low'],
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]!.message).toBe('value must be one of allowedValues');
  });

  it('rejects empty allowedValues array', () => {
    const result = EnumValueSchema.safeParse({ kind: 'enum', value: 'x', allowedValues: [] });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// HashValueSchema
// ---------------------------------------------------------------------------

describe('HashValueSchema', () => {
  it.each(['sha256', 'sha512', 'keccak256'] as const)('accepts algorithm "%s"', (algorithm) => {
    const result = HashValueSchema.safeParse({ kind: 'hash', algorithm, value: 'abc123def456' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.algorithm).toBe(algorithm);
      expect(result.data.value).toBe('abc123def456');
    }
  });

  it('rejects invalid algorithm', () => {
    const result = HashValueSchema.safeParse({ kind: 'hash', algorithm: 'md5', value: 'abc123' });
    expect(result.success).toBe(false);
  });

  it('rejects empty value string', () => {
    const result = HashValueSchema.safeParse({ kind: 'hash', algorithm: 'sha256', value: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]!.code).toBe('too_small');
  });
});

// ---------------------------------------------------------------------------
// LocalizedValueSchema
// ---------------------------------------------------------------------------

describe('LocalizedValueSchema', () => {
  it('accepts when defaultLocale exists in value map', () => {
    const result = LocalizedValueSchema.safeParse({
      kind: 'localized',
      value: { en: 'Hello', fr: 'Bonjour' },
      defaultLocale: 'en',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.defaultLocale).toBe('en');
      expect(result.data.value['fr']).toBe('Bonjour');
    }
  });

  it('rejects when defaultLocale not in value map and checks error message', () => {
    const result = LocalizedValueSchema.safeParse({
      kind: 'localized',
      value: { en: 'Hello' },
      defaultLocale: 'fr',
    });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.issues[0]!.message).toBe('defaultLocale must exist in value map');
  });

  it('rejects defaultLocale shorter than 2 chars', () => {
    const result = LocalizedValueSchema.safeParse({
      kind: 'localized',
      value: { e: 'Hello' },
      defaultLocale: 'e',
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// PredicateValueSchema — composite
// ---------------------------------------------------------------------------

describe('PredicateValueSchema (composite)', () => {
  it('parses a composite value with nested boolean', () => {
    const composite = {
      kind: 'composite',
      components: { verified: { kind: 'boolean', value: true } },
    };
    const result = PredicateValueSchema.safeParse(composite);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.kind).toBe('composite');
    }
  });

  it('parses nested composite (composite inside composite)', () => {
    const nested = {
      kind: 'composite',
      components: {
        inner: {
          kind: 'composite',
          components: {
            score: { kind: 'numeric', value: 99 },
          },
        },
      },
    };
    const result = PredicateValueSchema.safeParse(nested);
    expect(result.success).toBe(true);
  });

  it('rejects empty components and checks error message', () => {
    const result = PredicateValueSchema.safeParse({ kind: 'composite', components: {} });
    expect(result.success).toBe(false);
    // The refinement error message
    if (!result.success) {
      const componentIssue = result.error.issues.find((i: { message: string }) =>
        i.message.includes('components must have at least one entry')
      );
      expect(componentIssue).toBeDefined();
    }
  });
});

// ---------------------------------------------------------------------------
// WORKPROOF_PREDICATE_URIS
// ---------------------------------------------------------------------------

describe('WORKPROOF_PREDICATE_URIS', () => {
  const uris = Object.values(WORKPROOF_PREDICATE_URIS);

  it('has 57 URIs', () => {
    expect(uris).toHaveLength(57);
  });

  it('every URI starts with "tradepass://workproof/"', () => {
    for (const uri of uris) {
      expect(uri.startsWith('tradepass://workproof/')).toBe(true);
    }
  });

  it('every URI matches the tradepass URI regex', () => {
    const uriRegex = /^tradepass:\/\/[^/]+\/[^/]+\/[^/]+$/;
    for (const uri of uris) {
      expect(uriRegex.test(uri)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// WORKPROOF_PREDICATES
// ---------------------------------------------------------------------------

describe('WORKPROOF_PREDICATES', () => {
  const entries = Object.entries(WORKPROOF_PREDICATES);

  it('has 57 entries', () => {
    expect(entries).toHaveLength(57);
  });

  it('each definition has all required fields (uri, name, description, domain, version)', () => {
    for (const [, def] of entries) {
      expect(def.uri).toBeDefined();
      expect(typeof def.name).toBe('string');
      expect(typeof def.description).toBe('string');
      expect(typeof def.domain).toBe('string');
      expect(typeof def.version).toBe('string');
      // Also check structural fields
      expect(def.schema).toBeDefined();
      expect(def.evidence).toBeDefined();
      expect(def.attestation).toBeDefined();
      expect(def.confidence).toBeDefined();
      expect(def.temporal).toBeDefined();
      expect(def.ai).toBeDefined();
    }
  });

  it('every predicate key maps to a URI containing "workproof"', () => {
    for (const [, def] of entries) {
      expect(def.uri).toContain('workproof');
    }
  });
});
