import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { WORKPROOF_PREDICATES, WORKPROOF_PREDICATE_URIS } from '../src/predicates/registry';
import {
  WorkProofPredicateTypeSchema,
  PredicateValueSchema,
  PredicateCategorySchema,
} from '../src/predicates/schemas';
import { PREDICATE_CATEGORIES } from '../src/predicates/types';

// ---------------------------------------------------------------------------
// Arbitraries — fast-check generators for valid and invalid inputs
// ---------------------------------------------------------------------------

const validPredicateTypes = Object.keys(WORKPROOF_PREDICATES) as string[];

const validCategories = [
  'Identity',
  'Production',
  'Location',
  'Compliance',
  'Financial',
  'Learning',
  'Performance',
  'Community',
  'Entity',
];

const booleanValueArb = fc.record({
  kind: fc.constant('boolean'),
  value: fc.boolean(),
});

const numericValueArb = fc.record({
  kind: fc.constant('numeric'),
  value: fc.double({ noDefaultInfinity: true, noNaN: true }),
  unit: fc.option(fc.string({ minLength: 1 }), { nil: undefined }),
  precision: fc.option(fc.integer({ min: 0, max: 10 }), { nil: undefined }),
});

const rangeValueArb = fc.tuple(fc.double(), fc.double()).map(([a, b]) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  return { kind: 'range' as const, min, max };
});

const enumValueArb = fc.string({ minLength: 1 }).chain((value) =>
  fc.array(fc.string({ minLength: 1 }), { minLength: 1 }).map((allowedValues) => ({
    kind: 'enum' as const,
    value: allowedValues.includes(value) ? value : allowedValues[0]!,
    allowedValues,
  }))
);

const hashValueArb = fc.record({
  kind: fc.constant('hash'),
  algorithm: fc.constantFrom('sha256', 'sha512', 'keccak256'),
  value: fc.string({ minLength: 1 }),
});

const localizedValueArb = fc.string({ minLength: 2 }).chain((defaultLocale) =>
  fc
    .dictionary(fc.string({ minLength: 1 }), fc.string({ minLength: 1 }), {
      minKeys: 1,
    })
    .map((value) => ({
      kind: 'localized' as const,
      value: { [defaultLocale]: 'test', ...value },
      defaultLocale,
    }))
);

const predicateValueArb = fc.oneof(
  booleanValueArb,
  numericValueArb,
  rangeValueArb,
  enumValueArb,
  hashValueArb,
  localizedValueArb
);

// ---------------------------------------------------------------------------
// Schema properties
// ---------------------------------------------------------------------------

describe('property-based — WorkProofPredicateTypeSchema', () => {
  it('accepts all 47 canonical predicate types', () => {
    for (const t of validPredicateTypes) {
      const result = WorkProofPredicateTypeSchema.safeParse(t);
      expect(result.success).toBe(true);
    }
  });

  it('rejects arbitrary strings (property-based)', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const result = WorkProofPredicateTypeSchema.safeParse(s);
        if (validPredicateTypes.includes(s)) {
          expect(result.success).toBe(true);
        } else {
          expect(result.success).toBe(false);
        }
      }),
      { numRuns: 500 }
    );
  });
});

describe('property-based — PredicateCategorySchema', () => {
  it('accepts all 9 valid categories', () => {
    for (const c of validCategories) {
      const result = PredicateCategorySchema.safeParse(c);
      expect(result.success).toBe(true);
    }
  });

  it('rejects arbitrary strings (property-based)', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const result = PredicateCategorySchema.safeParse(s);
        if (validCategories.includes(s)) {
          expect(result.success).toBe(true);
        } else {
          expect(result.success).toBe(false);
        }
      }),
      { numRuns: 500 }
    );
  });
});

describe('property-based — PredicateValueSchema', () => {
  it('accepts valid generated values (property-based)', () => {
    fc.assert(
      fc.property(predicateValueArb, (value) => {
        const result = PredicateValueSchema.safeParse(value);
        expect(result.success).toBe(true);
      }),
      { numRuns: 200 }
    );
  });

  it('rejects values with wrong kind literal (property-based)', () => {
    fc.assert(
      fc.property(
        fc.record({
          kind: fc.string({ minLength: 1 }).filter((s) => s !== 'composite'),
          value: fc.anything(),
        }),
        (invalid) => {
          const result = PredicateValueSchema.safeParse(invalid);
          expect(result.success).toBe(false);
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Registry invariants — structural properties of all 47 predicates
// ---------------------------------------------------------------------------

describe('property-based — WORKPROOF_PREDICATES invariants', () => {
  it('every predicate has a URI matching the tradepass pattern', () => {
    const uriPattern = /^tradepass:\/\/workproof\/[^/]+\/[^/]+$/;
    for (const [, def] of Object.entries(WORKPROOF_PREDICATES)) {
      expect(def.uri).toMatch(uriPattern);
    }
  });

  it('every predicate URI is present in WORKPROOF_PREDICATE_URIS', () => {
    for (const [, def] of Object.entries(WORKPROOF_PREDICATES)) {
      expect(Object.values(WORKPROOF_PREDICATE_URIS)).toContain(def.uri);
    }
  });

  it('confidence weights sum to 1.0 within float tolerance (property-based)', () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.values(WORKPROOF_PREDICATES)), (predicate) => {
        const weights = Object.values(predicate.confidence.evidenceWeights);
        const sum = weights.reduce((a, b) => a + b, 0);
        expect(Math.abs(sum - 1.0)).toBeLessThan(0.01);
      }),
      { numRuns: 100 }
    );
  });

  it('minimumThreshold is strictly less than baseScore for all predicates', () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.values(WORKPROOF_PREDICATES)), (predicate) => {
        expect(predicate.confidence.minimumThreshold).toBeLessThan(predicate.confidence.baseScore);
      }),
      { numRuns: 100 }
    );
  });

  it('temporal validDuration is a non-empty string starting with P', () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.values(WORKPROOF_PREDICATES)), (predicate) => {
        expect(predicate.temporal.validDuration).toMatch(/^P/);
      }),
      { numRuns: 100 }
    );
  });

  it('schema type is one of the allowed values', () => {
    const allowedSchemaTypes = ['boolean', 'enum', 'string', 'number', 'date', 'object'];
    fc.assert(
      fc.property(fc.constantFrom(...Object.values(WORKPROOF_PREDICATES)), (predicate) => {
        expect(allowedSchemaTypes).toContain(predicate.schema.type);
      }),
      { numRuns: 100 }
    );
  });
});

describe('property-based — PREDICATE_CATEGORIES consistency', () => {
  it('every predicate type maps to a valid category', () => {
    for (const [type, category] of Object.entries(PREDICATE_CATEGORIES)) {
      expect(validCategories).toContain(category);
      expect(validPredicateTypes).toContain(type);
    }
  });

  it('category counts match expected totals', () => {
    const counts: Record<string, number> = {};
    for (const category of Object.values(PREDICATE_CATEGORIES)) {
      counts[category] = (counts[category] ?? 0) + 1;
    }
    expect(counts['Identity']).toBe(5);
    expect(counts['Production']).toBe(5);
    expect(counts['Location']).toBe(4);
    expect(counts['Compliance']).toBe(5);
    expect(counts['Financial']).toBe(5);
    expect(counts['Learning']).toBe(5);
    expect(counts['Performance']).toBe(4);
    expect(counts['Community']).toBe(5);
    expect(counts['Entity']).toBe(9);
  });
});
