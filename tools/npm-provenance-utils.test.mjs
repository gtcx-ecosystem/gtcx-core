import { describe, expect, it } from 'vitest';

import { hasRegistryAttestation } from './npm-provenance-utils.mjs';

describe('hasRegistryAttestation', () => {
  it('returns true when attestations.url is set', () => {
    expect(
      hasRegistryAttestation({
        url: 'https://registry.npmjs.org/-/npm/v1/attestations/@gtcx/types@3.1.4',
      })
    ).toBe(true);
  });

  it('returns true when attestations.provenance is set', () => {
    expect(
      hasRegistryAttestation({
        provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
      })
    ).toBe(true);
  });

  it('returns false for null or empty attestations', () => {
    expect(hasRegistryAttestation(null)).toBe(false);
    expect(hasRegistryAttestation(undefined)).toBe(false);
    expect(hasRegistryAttestation({})).toBe(false);
  });
});
