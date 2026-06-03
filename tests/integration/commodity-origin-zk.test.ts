/**
 * Cross-package: WorkProof witness → @gtcx/verification commodity-origin ZK bundle.
 * Lives here (not in packages/verification) to avoid turbo build cycle with @gtcx/workproof.
 */
import {
  commodityOriginWitnessToProfileInput,
  createCommodityOriginZkProofRef,
  createCryptographicProofRef,
  createProofBundle,
  parseProofBundle,
  serializeProofBundle,
  verifyCommodityOriginZkProofStructure,
  verifyProofBundleStructure,
} from '@gtcx/verification';
import { buildCommodityOriginWitness } from '@gtcx/workproof';
import { describe, expect, it } from 'vitest';

const ghanaBounds: [number, number, number, number] = [
  4_700_000, 11_200_000, 176_700_000, 181_200_000,
];

const zwBounds: [number, number, number, number] = [15_000_000, 25_000_000, 25_000_000, 35_000_000];

function baseGoldSubject() {
  return {
    id: 'did:example:miner-1',
    proofType: 'ProductionEvent' as const,
    tradepassId: 'tp-gh-001',
    issuerId: 'did:example:issuer',
    issuerRole: 'producer' as const,
    siteId: 'mine-obuasi-7',
    commodityContext: 'gold',
    claims: [
      {
        predicateType: 'CommodityProduced',
        predicateURI: 'tradepass://workproof/production/commodity-produced',
        value: {
          kind: 'composite' as const,
          components: {
            commodity: { kind: 'enum' as const, value: 'gold', allowedValues: ['gold'] },
            quantity: { kind: 'numeric' as const, value: 1.0, unit: 'kg' },
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
    ],
  };
}

function baseDiamondSubject() {
  return {
    ...baseGoldSubject(),
    commodityContext: 'diamond',
    claims: baseGoldSubject().claims.map((c) =>
      c.predicateType === 'CommodityProduced'
        ? {
            ...c,
            value: {
              kind: 'composite' as const,
              components: {
                commodity: {
                  kind: 'enum' as const,
                  value: 'diamond',
                  allowedValues: ['diamond'],
                },
                quantity: { kind: 'numeric' as const, value: 5.0, unit: 'ct' },
              },
            },
            evidence: [
              {
                type: 'gps_location',
                hash: 'sha256:gps-zw',
                timestamp: 1704067200000,
                metadata: { latitude: -18.5, longitude: 28.0 },
              },
            ],
          }
        : c
    ),
  };
}

describe('commodity-origin ZK integration (workproof → verification bundle)', () => {
  it.each([
    ['gh-gold-origin', baseGoldSubject(), ghanaBounds],
    ['zw-diamond-origin', baseDiamondSubject(), zwBounds],
  ] as const)(
    'workproof witness maps to %s profile prove input',
    (expectedProfile, subject, bounds) => {
      const witness = buildCommodityOriginWitness({
        credentialSubject: subject,
        supplement: {
          bounds,
          minPrimary: expectedProfile === 'gh-gold-origin' ? 950 : 70,
          minSecondary: expectedProfile === 'gh-gold-origin' ? 500 : 100,
          merklePath: { leafIndex: 0, pathDigestsHex: [] },
          primaryRandomnessHex: '0a'.repeat(32),
          secondaryRandomnessHex: '0b'.repeat(32),
          locationRandomnessHex: '0c'.repeat(32),
        },
      });

      expect(witness.circuitTarget).toBe(expectedProfile);

      const input = commodityOriginWitnessToProfileInput(witness, {
        provingKey: 'aa'.repeat(64),
        verifyingKey: 'bb'.repeat(64),
      });
      expect(input.profileId).toBe(expectedProfile);
      expect(input.mineId).toBe(witness.mineIdHex);
      expect(input.certificationFlags).toBe(witness.certificationFlags);
    }
  );

  it.each(['gh-gold-origin', 'zw-diamond-origin'] as const)(
    'proof bundle carries %s zk ref through schema parse',
    (profileId) => {
      const zkRef = createCommodityOriginZkProofRef({
        system: 'groth16',
        proofType: 'commodity_origin',
        profileId,
        proof: 'cc'.repeat(64),
        verificationKeyId: 'bb'.repeat(64),
        publicInputs: ['[]'],
        created: new Date().toISOString(),
      });

      expect(verifyCommodityOriginZkProofStructure(zkRef).valid).toBe(true);

      const bundle = createProofBundle({
        type: 'workflow',
        cryptographicProof: createCryptographicProofRef('datahash', 'sig', 'pk'),
        commodityOriginZkProof: zkRef,
      });

      expect(verifyProofBundleStructure(bundle).valid).toBe(true);

      const roundtrip = parseProofBundle(serializeProofBundle(bundle));
      expect(roundtrip?.proofs.commodityOriginZkProof?.profileId).toBe(profileId);
    }
  );
});
