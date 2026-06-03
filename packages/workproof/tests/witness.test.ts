import { describe, it, expect } from 'vitest';

import {
  buildCommodityOriginWitness,
  serializeCommodityOriginWitness,
  WitnessBuildError,
  PRODUCTION_ORIGIN_PREDICATE_FAMILY,
  commodityTypeFromLabel,
} from '../src/witness';
import type { WorkProofCredentialSubject } from '../src/workproof/types';

const ghanaBounds: [number, number, number, number] = [
  4_500_000, 11_500_000, -3_500_000, 1_500_000,
];

const baseSubject: WorkProofCredentialSubject = {
  id: 'did:example:miner-1',
  proofType: 'ProductionEvent',
  tradepassId: 'tp-gh-001',
  issuerId: 'did:example:issuer',
  issuerRole: 'producer',
  siteId: 'mine-obuasi-7',
  commodityContext: 'gold',
  claims: [
    {
      predicateType: 'CommodityProduced',
      predicateURI: 'tradepass://workproof/production/commodity-produced',
      value: {
        kind: 'composite',
        components: {
          commodity: { kind: 'enum', value: 'gold', allowedValues: ['gold', 'cocoa'] },
          quantity: { kind: 'numeric', value: 1.0, unit: 'kg' },
        },
      },
      evidence: [
        {
          type: 'gps_location',
          hash: 'sha256:gps1',
          timestamp: 1704067200000,
          metadata: { latitude: 6.2, longitude: -1.68 },
        },
      ],
      confidence: 0.9,
      issuedAt: 1704067200000,
      proof: {
        type: 'Ed25519Signature2020',
        created: '2024-01-01T00:00:00Z',
        verificationMethod: 'did:example:verifier#key-1',
        proofValue: 'z3FX',
      },
    },
    {
      predicateType: 'OriginAuthenticated',
      predicateURI: 'tradepass://workproof/production/origin-authenticated',
      value: { kind: 'boolean', value: true },
      evidence: [
        {
          type: 'photo_evidence',
          hash: 'sha256:photo1',
          timestamp: 1704067200000,
        },
      ],
      confidence: 0.85,
      issuedAt: 1704067200000,
      proof: {
        type: 'Ed25519Signature2020',
        created: '2024-01-01T00:00:00Z',
        verificationMethod: 'did:example:verifier#key-1',
        proofValue: 'z3FX',
      },
    },
  ],
};

describe('PRODUCTION_ORIGIN_PREDICATE_FAMILY', () => {
  it('includes CommodityProduced and OriginAuthenticated', () => {
    expect(PRODUCTION_ORIGIN_PREDICATE_FAMILY).toContain('CommodityProduced');
    expect(PRODUCTION_ORIGIN_PREDICATE_FAMILY).toContain('OriginAuthenticated');
  });
});

describe('buildCommodityOriginWitness', () => {
  it('maps production claims to typed gh-gold-origin witness', () => {
    const witness = buildCommodityOriginWitness({
      credentialSubject: baseSubject,
      supplement: {
        bounds: ghanaBounds,
        minPrimary: 950,
        minSecondary: 500,
        merklePath: { leafIndex: 0, pathDigestsHex: [] },
        primaryRandomnessHex: '0a'.repeat(32),
        secondaryRandomnessHex: '0b'.repeat(32),
        locationRandomnessHex: '0c'.repeat(32),
      },
    });

    expect(witness.circuitTarget).toBe('gh-gold-origin');
    expect(witness.commodityType).toBe(commodityTypeFromLabel('gold'));
    expect(witness.mineIdHex).toHaveLength(64);
    expect(witness.lat).toBe(6_200_000);
    expect(witness.lon).toBe(-1_680_000);
    expect(witness.primaryMetric).toBe(995);
    expect(witness.secondaryMetric).toBe(1000);
    expect(witness.certificationFlags & 1).toBe(1);

    const json = serializeCommodityOriginWitness(witness);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect(parsed.circuitTarget).toBe('gh-gold-origin');
    expect(parsed.mineIdHex).toBe(witness.mineIdHex);
    expect(json).not.toMatch(/Uint8Array/);
  });

  it('rejects when CommodityProduced is missing', () => {
    const subject = {
      ...baseSubject,
      claims: baseSubject.claims.filter((c) => c.predicateType !== 'CommodityProduced'),
    };
    expect(() =>
      buildCommodityOriginWitness({
        credentialSubject: subject,
        supplement: {
          bounds: ghanaBounds,
          minPrimary: 950,
          minSecondary: 500,
          merklePath: { leafIndex: 0, pathDigestsHex: [] },
        },
      })
    ).toThrow(WitnessBuildError);
  });

  it('rejects when GPS evidence is missing', () => {
    const subject = {
      ...baseSubject,
      claims: [
        {
          ...baseSubject.claims[0]!,
          evidence: [
            {
              type: 'photo_evidence' as const,
              hash: 'sha256:x',
              timestamp: 1704067200000,
            },
          ],
        },
      ],
    };
    expect(() =>
      buildCommodityOriginWitness({
        credentialSubject: subject,
        supplement: {
          bounds: ghanaBounds,
          minPrimary: 950,
          minSecondary: 500,
          merklePath: { leafIndex: 0, pathDigestsHex: [] },
        },
      })
    ).toThrow(WitnessBuildError);
  });
});
