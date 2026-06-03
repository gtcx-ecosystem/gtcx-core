import { describe, expect, it } from 'vitest';

import {
  CircuitRegistryError,
  circuitRegistry,
  NATIVE_PROVABLE_PROFILE_IDS,
  resolveCircuitProfile,
} from '../src/circuit-registry';

describe('CircuitRegistry (DTF-5.4.1)', () => {
  it('lists active Tier-5 profile IDs with semver', () => {
    const active = circuitRegistry.listActiveIds();
    expect(active).toContain('gh-gold-origin');
    expect(active).toContain('zw-diamond-origin');
    expect(active).toContain('gh-cocoa-origin');

    const gold = circuitRegistry.get('gh-gold-origin');
    expect(gold?.version).toBe('1.0.0');
    expect(gold?.status).toBe('active');
    expect(gold?.underlyingCircuit).toBe('CommodityOrigin');
  });

  it('rejects unknown profile with structured error', () => {
    expect(() => resolveCircuitProfile('na-gold-origin')).toThrow(CircuitRegistryError);
    try {
      resolveCircuitProfile('na-gold-origin');
    } catch (e) {
      expect(e).toBeInstanceOf(CircuitRegistryError);
      const err = e as CircuitRegistryError;
      expect(err.code).toBe('UNKNOWN_PROFILE');
      expect(err.profileId).toBe('na-gold-origin');
    }
  });

  it('rejects deprecated profile unless allowDeprecated', () => {
    expect(() => resolveCircuitProfile('gh-gold-origin-preview')).toThrow(CircuitRegistryError);
    try {
      resolveCircuitProfile('gh-gold-origin-preview');
    } catch (e) {
      const err = e as CircuitRegistryError;
      expect(err.code).toBe('DEPRECATED_PROFILE');
      expect(err.supersededBy).toBe('gh-gold-origin');
    }

    const allowed = resolveCircuitProfile('gh-gold-origin-preview', { allowDeprecated: true });
    expect(allowed.status).toBe('deprecated');
  });

  it('native provable subset matches named profiles', () => {
    for (const id of NATIVE_PROVABLE_PROFILE_IDS) {
      expect(circuitRegistry.isNativeProvable(id)).toBe(true);
    }
    expect(circuitRegistry.isNativeProvable('commodity-origin')).toBe(false);
  });
});
