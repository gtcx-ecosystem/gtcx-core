/**
 * DTF-5.3.2 — Five-jurisdiction redacted integration fixtures on one CommodityOrigin R1CS.
 *
 * Proves WorkProof → witness → verification bundle for ZW/GH/NA/BW/CD without PII.
 * Complements `jurisdictions.test.ts` (config + signing) with Tier-5 policy packs.
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
import {
  GH_COCOA_ORIGIN_PROFILE,
  GH_GOLD_ORIGIN_PROFILE,
  ZW_DIAMOND_ORIGIN_PROFILE,
  profileById,
} from '@gtcx/workproof/circuit-profiles';
import { describe, expect, it } from 'vitest';

import {
  TIER5_JURISDICTION_PROOF_FIXTURES,
  TIER5_NAMED_PROFILE_IDS,
  ghanaCocoaFixture,
} from './fixtures/tier5-jurisdiction-proof-fixtures';

describe('Tier-5 jurisdiction proof fixtures (redacted)', () => {
  it('defines five engagement jurisdictions without PII in subjects', () => {
    expect(TIER5_JURISDICTION_PROOF_FIXTURES).toHaveLength(5);
    const codes = TIER5_JURISDICTION_PROOF_FIXTURES.map((f) => f.code);
    expect(codes.sort()).toEqual(['BW', 'CD', 'GH', 'NA', 'ZW']);

    for (const f of TIER5_JURISDICTION_PROOF_FIXTURES) {
      expect(f.subject.id).toMatch(/^did:example:/);
      expect(f.subject.siteId).toMatch(/^site-/);
      expect(JSON.stringify(f.subject)).not.toMatch(
        /@(gmail|gov\.zw|gov\.gh)|\+263|Obuasi|Kinshasa/i
      );
    }
  });

  it('covers all three named Tier-5 profile packs across fixtures', () => {
    const profiles = new Set([
      ...TIER5_JURISDICTION_PROOF_FIXTURES.map((f) => f.profileId),
      ghanaCocoaFixture().profileId,
    ]);
    for (const id of TIER5_NAMED_PROFILE_IDS) {
      expect(profiles.has(id)).toBe(true);
    }
  });

  const isNamedProfile = (id: string): id is (typeof TIER5_NAMED_PROFILE_IDS)[number] =>
    (TIER5_NAMED_PROFILE_IDS as readonly string[]).includes(id);

  for (const fixture of TIER5_JURISDICTION_PROOF_FIXTURES) {
    it(`${fixture.code} (${fixture.name}) — witness matches ${fixture.profileId} policy pack`, () => {
      const witness = buildCommodityOriginWitness({
        credentialSubject: fixture.subject,
        supplement: fixture.supplement,
      });

      expect(witness.circuitTarget).toBe(fixture.expectedCircuitTarget);

      const profile = profileById(
        fixture.profileId === 'commodity-origin' ? 'commodity-origin' : fixture.profileId
      );
      if (fixture.profileId !== 'commodity-origin') {
        expect(witness.bounds).toEqual(profile.bounds);
        expect(witness.minPrimary).toBe(profile.minPrimary);
        expect(witness.commodityType).toBe(profile.commodityType);
      } else {
        expect(witness.bounds).toEqual(fixture.supplement.bounds);
        expect(witness.minPrimary).toBe(fixture.supplement.minPrimary);
      }

      if (isNamedProfile(fixture.profileId)) {
        const input = commodityOriginWitnessToProfileInput(witness, {
          provingKey: 'aa'.repeat(64),
          verifyingKey: 'bb'.repeat(64),
        });
        expect(input.profileId).toBe(fixture.profileId);
      }
    });

    it(`${fixture.code} (${fixture.name}) — verification bundle roundtrip`, () => {
      buildCommodityOriginWitness({
        credentialSubject: fixture.subject,
        supplement: fixture.supplement,
      });

      const bundleInput: Parameters<typeof createProofBundle>[0] = {
        type: 'workflow',
        cryptographicProof: createCryptographicProofRef('datahash', 'sig', 'pk'),
      };

      if (isNamedProfile(fixture.profileId)) {
        const zkRef = createCommodityOriginZkProofRef({
          system: 'groth16',
          proofType: 'commodity_origin',
          profileId: fixture.profileId,
          proof: 'cc'.repeat(64),
          verificationKeyId: 'bb'.repeat(64),
          publicInputs: ['[]'],
          created: new Date().toISOString(),
        });
        expect(verifyCommodityOriginZkProofStructure(zkRef).valid).toBe(true);
        bundleInput.commodityOriginZkProof = zkRef;
      }

      const bundle = createProofBundle(bundleInput);
      expect(verifyProofBundleStructure(bundle).valid).toBe(true);
      const roundtrip = parseProofBundle(serializeProofBundle(bundle));
      expect(roundtrip?.type).toBe('workflow');
      if (isNamedProfile(fixture.profileId)) {
        expect(roundtrip?.proofs.commodityOriginZkProof?.profileId).toBe(fixture.profileId);
      } else {
        expect(roundtrip?.proofs.commodityOriginZkProof).toBeUndefined();
      }
    });
  }

  it('Ghana cocoa — gh-cocoa-origin pack (EUDR / LICOR narrative)', () => {
    const fixture = ghanaCocoaFixture();
    const witness = buildCommodityOriginWitness({
      credentialSubject: fixture.subject,
      supplement: fixture.supplement,
    });

    expect(witness.circuitTarget).toBe('gh-cocoa-origin');
    expect(witness.bounds).toEqual(GH_COCOA_ORIGIN_PROFILE.bounds);
    expect(witness.certificationFlags & GH_COCOA_ORIGIN_PROFILE.requiredCertificationMask).toBe(
      GH_COCOA_ORIGIN_PROFILE.requiredCertificationMask
    );
  });

  it('profile registry aligns workproof packs with circuit_profiles', () => {
    expect(profileById('gh-gold-origin').jurisdictionCode).toBe('GH');
    expect(profileById('gh-cocoa-origin').commodityType).toBe(2);
    expect(profileById('zw-diamond-origin').requiredCertificationMask).toBe(
      ZW_DIAMOND_ORIGIN_PROFILE.requiredCertificationMask
    );
    expect(GH_GOLD_ORIGIN_PROFILE.underlyingCircuit).toBe('CommodityOrigin');
  });
});
