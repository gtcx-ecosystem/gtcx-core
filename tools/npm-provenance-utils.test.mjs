import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { hasRegistryAttestation } from './npm-provenance-utils.mjs';

describe('hasRegistryAttestation', () => {
  it('returns true when attestations.url is set', () => {
    assert.equal(
      hasRegistryAttestation({
        url: 'https://registry.npmjs.org/-/npm/v1/attestations/@gtcx/types@3.1.4',
      }),
      true
    );
  });

  it('returns true when attestations.provenance is set', () => {
    assert.equal(
      hasRegistryAttestation({
        provenance: { predicateType: 'https://slsa.dev/provenance/v1' },
      }),
      true
    );
  });

  it('returns false for null or empty attestations', () => {
    assert.equal(hasRegistryAttestation(null), false);
    assert.equal(hasRegistryAttestation(undefined), false);
    assert.equal(hasRegistryAttestation({}), false);
  });
});
