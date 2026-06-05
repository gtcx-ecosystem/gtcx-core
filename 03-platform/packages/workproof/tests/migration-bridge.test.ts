import {
  TRADEPASS_LEGACY_ID_ALIASES,
  resolveLegacyPredicateId,
  findLegacyIdsForUri,
} from '@gtcx/verification/migration';
import { describe, expect, it } from 'vitest';

import { WORKPROOF_PREDICATES } from '../src/predicates/registry';

/**
 * Integration test: validates that the TradePass legacy ID alias map
 * (from @gtcx/verification/migration) resolves to predicates that actually
 * exist in the @gtcx/workproof registry.
 *
 * This is the exact pattern gtcx-protocols will use for ADR-012 Stage 1:
 *
 *   const canonicalUri = resolveLegacyPredicateId('tradepass.identity.proven');
 *   const predicate = WORKPROOF_PREDICATES[canonicalUri]; // undefined — URIs are keys
 *
 * Instead, the bridge should look up by URI:
 *   const predicate = Object.values(WORKPROOF_PREDICATES).find(p => p.uri === canonicalUri);
 */

describe('Migration bridge — legacy ID to predicate round-trip', () => {
  it('every legacy alias resolves to a URI present in WORKPROOF_PREDICATES', () => {
    const entries = Object.entries(TRADEPASS_LEGACY_ID_ALIASES);
    expect(entries.length).toBeGreaterThan(0);

    for (const [legacyId, canonicalUri] of entries) {
      const predicate = Object.values(WORKPROOF_PREDICATES).find((p) => p.uri === canonicalUri);
      expect(predicate).toBeDefined();
      expect(
        predicate,
        `Legacy ID "${legacyId}" maps to URI "${canonicalUri}" but no predicate has that URI`
      ).toBeDefined();
    }
  });

  it('resolveLegacyPredicateId returns the same URIs as the alias map', () => {
    for (const [legacyId, expectedUri] of Object.entries(TRADEPASS_LEGACY_ID_ALIASES)) {
      const resolved = resolveLegacyPredicateId(legacyId);
      expect(resolved).toBe(expectedUri);
    }
  });

  it('findLegacyIdsForUri returns at least the forward-mapped legacy ID', () => {
    for (const [legacyId, uri] of Object.entries(TRADEPASS_LEGACY_ID_ALIASES)) {
      const reverse = findLegacyIdsForUri(uri);
      expect(reverse).toContain(legacyId);
    }
  });

  it('unknown legacy IDs return undefined', () => {
    expect(resolveLegacyPredicateId('tradepass.made.up.predicate')).toBeUndefined();
    expect(resolveLegacyPredicateId('')).toBeUndefined();
  });

  it('entity-tier legacy IDs resolve to the 9 new predicates', () => {
    const entityLegacyIds = [
      'tradepass.entity.registered',
      'tradepass.entity.sanctions_cleared',
      'tradepass.entity.pep_cleared',
      'tradepass.entity.adverse_media_cleared',
      'tradepass.entity.beneficial_ownership_disclosed',
      'tradepass.entity.accreditation_held',
      'tradepass.entity.recognized',
      'tradepass.entity.issued_by',
      'tradepass.entity.ownership_chain',
    ];

    for (const legacyId of entityLegacyIds) {
      const uri = resolveLegacyPredicateId(legacyId);
      expect(uri).toBeDefined();

      const predicate = Object.values(WORKPROOF_PREDICATES).find((p) => p.uri === uri);
      expect(predicate).toBeDefined();
      expect(predicate!.domain).toBeDefined();
      expect(predicate!.version).toBe('1.0.0');
    }
  });
});

describe('Migration bridge — gtcx-protocols integration pattern', () => {
  /**
   * This is the reference bridge implementation that gtcx-protocols
   * should adapt for predicate-bridge.ts in Stage 1.
   */
  function resolvePredicate(id: string) {
    // Direct URI lookup
    const byUri = Object.values(WORKPROOF_PREDICATES).find((p) => p.uri === id);
    if (byUri) return byUri;

    // Legacy ID lookup via migration helper
    const canonicalUri = resolveLegacyPredicateId(id);
    if (canonicalUri) {
      return Object.values(WORKPROOF_PREDICATES).find((p) => p.uri === canonicalUri);
    }

    return undefined;
  }

  it('resolves canonical URI directly', () => {
    const uri = 'tradepass://workproof/identity/verified';
    const predicate = resolvePredicate(uri);
    expect(predicate).toBeDefined();
    expect(predicate!.name).toBe('Identity Verified');
  });

  it('resolves legacy ID through alias map', () => {
    const predicate = resolvePredicate('tradepass.identity.proven');
    expect(predicate).toBeDefined();
    expect(predicate!.uri).toBe('tradepass://workproof/identity/verified');
  });

  it('returns undefined for unknown identifiers', () => {
    expect(resolvePredicate('unknown.predicate.id')).toBeUndefined();
    expect(resolvePredicate('')).toBeUndefined();
  });

  it('resolves all 57 predicates by canonical URI', () => {
    for (const predicate of Object.values(WORKPROOF_PREDICATES)) {
      const resolved = resolvePredicate(predicate.uri);
      expect(resolved).toBe(predicate);
    }
  });

  it('resolves all legacy aliases to their mapped predicates', () => {
    for (const legacyId of Object.keys(TRADEPASS_LEGACY_ID_ALIASES)) {
      const resolved = resolvePredicate(legacyId);
      expect(resolved).toBeDefined();
    }
  });
});
