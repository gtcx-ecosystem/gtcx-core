import { describe, expect, it } from 'vitest';

import { WORKPROOF_PREDICATES, WORKPROOF_PREDICATE_URIS } from '../src/predicates/registry';
import { PREDICATE_CATEGORIES } from '../src/predicates/types';
import type { EntityPredicateType } from '../src/predicates/types';

const ENTITY_TYPES: EntityPredicateType[] = [
  'EntityRegistered',
  'SanctionsCleared',
  'PepCleared',
  'AdverseMediaCleared',
  'BeneficialOwnershipDisclosed',
  'AccreditationHeld',
  'EntityRecognized',
  'IssuedBy',
  'OwnershipChain',
];

describe('Entity predicates — registration', () => {
  it('registers all 9 entity predicates in WORKPROOF_PREDICATES', () => {
    for (const type of ENTITY_TYPES) {
      expect(WORKPROOF_PREDICATES[type]).toBeDefined();
    }
  });

  it('assigns all entity predicates to the Entity category', () => {
    for (const type of ENTITY_TYPES) {
      expect(PREDICATE_CATEGORIES[type]).toBe('Entity');
    }
  });

  it('has matching URIs in WORKPROOF_PREDICATE_URIS', () => {
    for (const type of ENTITY_TYPES) {
      expect(WORKPROOF_PREDICATE_URIS[type]).toBeDefined();
      expect(WORKPROOF_PREDICATES[type].uri).toBe(WORKPROOF_PREDICATE_URIS[type]);
    }
  });

  it('expands the registry from 47 to 57 predicates', () => {
    expect(Object.keys(WORKPROOF_PREDICATES).length).toBe(57);
  });
});

describe('Entity predicates — schema and evidence', () => {
  it('EntityRegistered requires corporate_registry evidence', () => {
    expect(WORKPROOF_PREDICATES.EntityRegistered.evidence.required).toContain('corporate_registry');
  });

  it('SanctionsCleared has exponential decay with 90-day half-life', () => {
    expect(WORKPROOF_PREDICATES.SanctionsCleared.confidence.decayModel).toBe('exponential');
    expect(WORKPROOF_PREDICATES.SanctionsCleared.confidence.halfLife).toBe(90);
  });

  it('PepCleared and AdverseMediaCleared have continuous monitoring or triggers', () => {
    expect(WORKPROOF_PREDICATES.PepCleared.temporal.monitoringType).toBeDefined();
    expect(WORKPROOF_PREDICATES.AdverseMediaCleared.temporal.monitoringType).toBe('continuous');
  });

  it('BeneficialOwnershipDisclosed triggers on ownership changes', () => {
    expect(WORKPROOF_PREDICATES.BeneficialOwnershipDisclosed.temporal.triggers).toContain(
      'ownership.changed'
    );
  });

  it('AccreditationHeld triggers on suspension/revocation', () => {
    expect(WORKPROOF_PREDICATES.AccreditationHeld.temporal.triggers).toEqual(
      expect.arrayContaining(['accreditation.suspended', 'accreditation.revoked'])
    );
  });

  it('EntityRecognized requires multiple attestors', () => {
    expect(WORKPROOF_PREDICATES.EntityRecognized.attestation.minimumAttestors).toBe(2);
  });

  it('IssuedBy uses DID pattern for value', () => {
    expect(WORKPROOF_PREDICATES.IssuedBy.schema.pattern).toMatch(/did:gtcx:tp_/);
  });

  it('OwnershipChain requires both document and registry evidence', () => {
    expect(WORKPROOF_PREDICATES.OwnershipChain.evidence.required).toEqual(
      expect.arrayContaining(['document_hash', 'corporate_registry'])
    );
  });

  it('all entity predicates have version 1.0.0', () => {
    for (const type of ENTITY_TYPES) {
      expect(WORKPROOF_PREDICATES[type].version).toBe('1.0.0');
    }
  });

  it('all entity predicates disable self-attestation except IssuedBy', () => {
    for (const type of ENTITY_TYPES) {
      const expected = type === 'IssuedBy' ? true : false;
      expect(WORKPROOF_PREDICATES[type].attestation.selfAttestation).toBe(expected);
    }
  });
});

describe('Entity predicates — confidence and temporal', () => {
  it('all entity predicates have minimumThreshold below baseScore', () => {
    for (const type of ENTITY_TYPES) {
      const def = WORKPROOF_PREDICATES[type];
      expect(def.confidence.minimumThreshold).toBeLessThan(def.confidence.baseScore);
    }
  });

  it('confidence weights sum to 1.0 (within float tolerance)', () => {
    for (const type of ENTITY_TYPES) {
      const weights = Object.values(WORKPROOF_PREDICATES[type].confidence.evidenceWeights);
      const sum = weights.reduce((a, b) => a + b, 0);
      expect(Math.abs(sum - 1.0)).toBeLessThan(0.01);
    }
  });

  it('high-stakes predicates (sanctions, PEP) have baseScore >= 0.95', () => {
    expect(WORKPROOF_PREDICATES.SanctionsCleared.confidence.baseScore).toBeGreaterThanOrEqual(0.95);
    expect(WORKPROOF_PREDICATES.PepCleared.confidence.baseScore).toBeGreaterThanOrEqual(0.95);
    expect(WORKPROOF_PREDICATES.EntityRegistered.confidence.baseScore).toBeGreaterThanOrEqual(0.95);
    expect(WORKPROOF_PREDICATES.AccreditationHeld.confidence.baseScore).toBeGreaterThanOrEqual(
      0.95
    );
  });

  it('IssuedBy is non-renewable (issuance is immutable)', () => {
    expect(WORKPROOF_PREDICATES.IssuedBy.temporal.renewalRequired).toBe(false);
  });
});
