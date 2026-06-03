import { describe, it, expect } from 'vitest';

import {
  groth16GciThreshold,
  groth16AssetOwnership,
  groth16LocationRegion,
  groth16CommodityOrigin,
  groth16GhGoldOrigin,
  groth16ZwDiamondOrigin,
  bulletproofsAmountRange,
  bulletproofsCommodityRange,
  katArtifacts,
  katCircuitNames,
} from '../src/index.js';

describe('KAT artifact exports', () => {
  it('exports all 8 KAT artifacts individually', () => {
    expect(groth16GciThreshold).toBeDefined();
    expect(groth16AssetOwnership).toBeDefined();
    expect(groth16LocationRegion).toBeDefined();
    expect(groth16CommodityOrigin).toBeDefined();
    expect(groth16GhGoldOrigin).toBeDefined();
    expect(groth16ZwDiamondOrigin).toBeDefined();
    expect(bulletproofsAmountRange).toBeDefined();
    expect(bulletproofsCommodityRange).toBeDefined();
  });

  it('katArtifacts contains all 8 circuits', () => {
    expect(Object.keys(katArtifacts)).toHaveLength(8);
    expect(katArtifacts['groth16-gci-threshold']).toBe(groth16GciThreshold);
    expect(katArtifacts['groth16-asset-ownership']).toBe(groth16AssetOwnership);
    expect(katArtifacts['groth16-location-region']).toBe(groth16LocationRegion);
    expect(katArtifacts['groth16-commodity-origin']).toBe(groth16CommodityOrigin);
    expect(katArtifacts['groth16-gh-gold-origin']).toBe(groth16GhGoldOrigin);
    expect(katArtifacts['groth16-zw-diamond-origin']).toBe(groth16ZwDiamondOrigin);
    expect(katArtifacts['bulletproofs-amount-range']).toBe(bulletproofsAmountRange);
    expect(katArtifacts['bulletproofs-commodity-range']).toBe(bulletproofsCommodityRange);
  });

  it('katCircuitNames matches katArtifacts keys', () => {
    expect(katCircuitNames.sort()).toEqual(Object.keys(katArtifacts).sort());
  });
});

describe('Groth16 KAT artifact structure', () => {
  const groth16Artifacts = [
    { name: 'groth16-gci-threshold', artifact: groth16GciThreshold },
    { name: 'groth16-asset-ownership', artifact: groth16AssetOwnership },
    { name: 'groth16-location-region', artifact: groth16LocationRegion },
    { name: 'groth16-commodity-origin', artifact: groth16CommodityOrigin },
    { name: 'groth16-gh-gold-origin', artifact: groth16GhGoldOrigin },
    { name: 'groth16-zw-diamond-origin', artifact: groth16ZwDiamondOrigin },
  ];

  it.each(groth16Artifacts)('$name has required fields', ({ artifact }) => {
    expect(artifact.version).toBe('1.0.0');
    expect(typeof artifact.circuit).toBe('string');
    expect(artifact.circuit.length).toBeGreaterThan(0);
    expect(typeof artifact.generated_at).toBe('number');
    expect(typeof artifact.vk_hash).toBe('string');
    expect(artifact.vk_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(typeof artifact.proof_bytes).toBe('string');
    expect(artifact.proof_bytes).toMatch(/^[0-9a-f]+$/i);
    expect(typeof artifact.verifying_key_bytes).toBe('string');
    expect(artifact.verifying_key_bytes).toMatch(/^[0-9a-f]+$/i);
    expect(typeof artifact.expected_verify).toBe('boolean');
    expect(artifact.witness).toBeDefined();
    expect(artifact.public_inputs).toBeDefined();
  });
});

describe('Bulletproofs KAT artifact structure', () => {
  const bulletproofsArtifacts = [
    { name: 'bulletproofs-amount-range', artifact: bulletproofsAmountRange },
    { name: 'bulletproofs-commodity-range', artifact: bulletproofsCommodityRange },
  ];

  it.each(bulletproofsArtifacts)('$name has required fields', ({ artifact }) => {
    expect(artifact.version).toBe('1.0.0');
    expect(typeof artifact.circuit).toBe('string');
    expect(artifact.circuit.length).toBeGreaterThan(0);
    expect(typeof artifact.generated_at).toBe('number');
    expect(typeof artifact.proof_low_bytes).toBe('string');
    expect(artifact.proof_low_bytes).toMatch(/^[0-9a-f]+$/i);
    expect(typeof artifact.proof_high_bytes).toBe('string');
    expect(artifact.proof_high_bytes).toMatch(/^[0-9a-f]+$/i);
    expect(typeof artifact.expected_verify).toBe('boolean');
    expect(artifact.witness).toBeDefined();
    expect(artifact.public_inputs).toBeDefined();
    expect(typeof artifact.public_inputs.commitment).toBe('string');
    expect(typeof artifact.public_inputs.min).toBe('number');
    expect(typeof artifact.public_inputs.max).toBe('number');
  });
});

describe('KAT artifact consistency', () => {
  it('all artifacts have expected_verify = true', () => {
    for (const [name, artifact] of Object.entries(katArtifacts)) {
      expect(artifact.expected_verify, `expected_verify for ${name}`).toBe(true);
    }
  });

  it('gh-gold-origin KAT is a CommodityOrigin profile alias', () => {
    expect(groth16GhGoldOrigin.circuit).toBe('CommodityOrigin');
    expect(groth16GhGoldOrigin.profile_id).toBe('gh-gold-origin');
    expect(groth16GhGoldOrigin.underlying_circuit).toBe('CommodityOrigin');
  });

  it('all artifacts have valid hex byte strings', () => {
    for (const [name, artifact] of Object.entries(katArtifacts)) {
      const hexFields =
        'proof_bytes' in artifact
          ? ['proof_bytes', 'verifying_key_bytes']
          : ['proof_low_bytes', 'proof_high_bytes'];

      for (const field of hexFields) {
        const value = (artifact as Record<string, unknown>)[field] as string;
        expect(value, `${name}.${field}`).toMatch(/^[0-9a-f]+$/i);
        // Even-length hex after 0x prefix
        expect(value.length % 2, `${name}.${field} hex length`).toBe(0);
      }
    }
  });
});
