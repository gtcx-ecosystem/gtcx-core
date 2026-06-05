/**
 * Tier-5 (DTF-5.3.2) redacted WorkProof fixtures for five engagement jurisdictions.
 *
 * **No PII** — synthetic DIDs, site IDs, and GPS anchors only. Public regulator
 * names appear in comments; fixture payloads use hashed/redacted identifiers.
 *
 * Maps each jurisdiction to a **policy pack** on the shared CommodityOrigin R1CS:
 * - Named profiles: `gh-gold-origin`, `gh-cocoa-origin`, `zw-diamond-origin`
 * - Lab generic: `commodity-origin` (until DTF-5.4 registry adds NA/BW/CD packs)
 */

import type {
  CommodityOriginWitnessSupplement,
  WitnessCircuitTarget,
  WorkProofCredentialSubject,
} from '@gtcx/workproof';

/** Tier-5 registry profile or lab generic alias. */
export type Tier5PolicyPackId =
  | 'gh-gold-origin'
  | 'gh-cocoa-origin'
  | 'zw-diamond-origin'
  | 'commodity-origin';

export interface Tier5JurisdictionProofFixture {
  /** ISO 3166-1 alpha-2 */
  code: 'ZW' | 'GH' | 'NA' | 'BW' | 'CD';
  /** Display name (public) */
  name: string;
  /** Expected policy pack after witness build */
  profileId: Tier5PolicyPackId;
  expectedCircuitTarget: WitnessCircuitTarget;
  /** Redacted credential subject (no personal data) */
  subject: WorkProofCredentialSubject;
  /** Witness supplement (bounds, merkle, optional explicit target) */
  supplement: CommodityOriginWitnessSupplement;
}

const LAB_MERKLE = { leafIndex: 0, pathDigestsHex: [] as string[] };
const LAB_RANDOMNESS = {
  primaryRandomnessHex: '0a'.repeat(32),
  secondaryRandomnessHex: '0b'.repeat(32),
  locationRandomnessHex: '0c'.repeat(32),
};

const GHANA_BOUNDS: [number, number, number, number] = [
  4_700_000, 11_200_000, 176_700_000, 181_200_000,
];
const ZW_BOUNDS: [number, number, number, number] = [
  15_000_000, 25_000_000, 25_000_000, 35_000_000,
];
/** Wide Africa lab box for generic commodity-origin (NA/CD until registry packs). */
const GENERIC_AFRICA_BOUNDS: [number, number, number, number] = [
  4_000_000, 12_000_000, 170_000_000, 210_000_000,
];

function redactedProof() {
  return {
    type: 'Ed25519Signature2020' as const,
    created: '2024-01-01T00:00:00Z',
    verificationMethod: 'did:example:fixture-issuer#key-1',
    proofValue: 'z3FX',
  };
}

function productionClaim(
  commodity: string,
  quantity: number,
  unit: string,
  lat: number,
  lon: number
) {
  return {
    predicateType: 'CommodityProduced',
    predicateURI: 'tradepass://workproof/production/commodity-produced',
    value: {
      kind: 'composite' as const,
      components: {
        commodity: {
          kind: 'enum' as const,
          value: commodity,
          allowedValues: [commodity],
        },
        quantity: { kind: 'numeric' as const, value: quantity, unit },
      },
    },
    evidence: [
      {
        type: 'gps_location' as const,
        hash: 'sha256:gps-fixture',
        timestamp: 1704067200000,
        metadata: { latitude: lat, longitude: lon },
      },
    ],
    confidence: 0.9,
    issuedAt: 1704067200000,
    proof: redactedProof(),
  };
}

function baseRedactedSubject(
  siteId: string,
  commodityContext: string,
  claims: WorkProofCredentialSubject['claims']
): WorkProofCredentialSubject {
  return {
    id: 'did:example:fixture-subject',
    proofType: 'ProductionEvent',
    tradepassId: 'tp-fixture-0001',
    issuerId: 'did:example:fixture-issuer',
    issuerRole: 'producer',
    siteId,
    commodityContext,
    claims,
  };
}

/** Zimbabwe — MMMD / Kimberley regional cert → zw-diamond-origin */
function zimbabweFixture(): Tier5JurisdictionProofFixture {
  return {
    code: 'ZW',
    name: 'Zimbabwe',
    profileId: 'zw-diamond-origin',
    expectedCircuitTarget: 'zw-diamond-origin',
    subject: baseRedactedSubject('site-zw-lab-001', 'diamond', [
      productionClaim('diamond', 5, 'ct', -18.5, 28.0),
      {
        predicateType: 'KimberleyProcessCertified',
        predicateURI: 'tradepass://workproof/compliance/kimberley-process',
        value: { kind: 'boolean', value: true },
        evidence: [],
        confidence: 1,
        issuedAt: 1704067200000,
        proof: redactedProof(),
      },
    ]),
    supplement: { ...LAB_RANDOMNESS, merklePath: LAB_MERKLE },
  };
}

/** Ghana (gold) — Minerals Commission / export license → gh-gold-origin */
function ghanaGoldFixture(): Tier5JurisdictionProofFixture {
  return {
    code: 'GH',
    name: 'Ghana (gold)',
    profileId: 'gh-gold-origin',
    expectedCircuitTarget: 'gh-gold-origin',
    subject: baseRedactedSubject('site-gh-gold-001', 'gold', [
      productionClaim('gold', 1.0, 'kg', 6.2, -1.68),
      {
        predicateType: 'GoldBuyingLicenseValid',
        predicateURI: 'tradepass://workproof/compliance/gold-buying-license',
        value: { kind: 'boolean', value: true },
        evidence: [],
        confidence: 1,
        issuedAt: 1704067200000,
        proof: redactedProof(),
      },
    ]),
    supplement: { ...LAB_RANDOMNESS, merklePath: LAB_MERKLE },
  };
}

/** Ghana (cocoa) — LICOR / origin traceability → gh-cocoa-origin (EUDR narrative) */
export function ghanaCocoaFixture(): Tier5JurisdictionProofFixture {
  return {
    code: 'GH',
    name: 'Ghana (cocoa)',
    profileId: 'gh-cocoa-origin',
    expectedCircuitTarget: 'gh-cocoa-origin',
    subject: baseRedactedSubject('site-gh-cocoa-001', 'cocoa', [
      productionClaim('cocoa', 750, 'kg', 6.7, -1.6),
      {
        predicateType: 'OriginAuthenticated',
        predicateURI: 'tradepass://workproof/production/origin-authenticated',
        value: { kind: 'boolean', value: true },
        evidence: [],
        confidence: 1,
        issuedAt: 1704067200000,
        proof: redactedProof(),
      },
      {
        predicateType: 'QualityGraded',
        predicateURI: 'tradepass://workproof/production/quality-graded',
        value: { kind: 'enum', value: 'high', allowedValues: ['high', 'medium'] },
        evidence: [],
        confidence: 0.95,
        issuedAt: 1704067200000,
        proof: redactedProof(),
      },
    ]),
    supplement: { ...LAB_RANDOMNESS, merklePath: LAB_MERKLE },
  };
}

/** Namibia — generic commodity-origin until NA pack in registry (DTF-5.4) */
function namibiaFixture(): Tier5JurisdictionProofFixture {
  return {
    code: 'NA',
    name: 'Namibia',
    profileId: 'commodity-origin',
    expectedCircuitTarget: 'commodity-origin',
    subject: baseRedactedSubject('site-na-lab-001', 'gold', [
      productionClaim('gold', 0.5, 'kg', 6.5, 17.0),
      {
        predicateType: 'OriginAuthenticated',
        predicateURI: 'tradepass://workproof/production/origin-authenticated',
        value: { kind: 'boolean', value: true },
        evidence: [],
        confidence: 1,
        issuedAt: 1704067200000,
        proof: redactedProof(),
      },
    ]),
    supplement: {
      circuitTarget: 'commodity-origin',
      bounds: GENERIC_AFRICA_BOUNDS,
      minPrimary: 950,
      minSecondary: 500,
      ...LAB_RANDOMNESS,
      merklePath: LAB_MERKLE,
    },
  };
}

/** Botswana — diamond → zw-diamond-origin (regional Kimberley pack) */
function botswanaFixture(): Tier5JurisdictionProofFixture {
  return {
    code: 'BW',
    name: 'Botswana',
    profileId: 'zw-diamond-origin',
    expectedCircuitTarget: 'zw-diamond-origin',
    subject: baseRedactedSubject('site-bw-lab-001', 'diamond', [
      productionClaim('diamond', 3, 'ct', -19.0, 24.0),
      {
        predicateType: 'KimberleyProcessCertified',
        predicateURI: 'tradepass://workproof/compliance/kimberley-process',
        value: { kind: 'boolean', value: true },
        evidence: [],
        confidence: 1,
        issuedAt: 1704067200000,
        proof: redactedProof(),
      },
    ]),
    supplement: { ...LAB_RANDOMNESS, merklePath: LAB_MERKLE },
  };
}

/** DR Congo — generic commodity-origin (CAMI / minerals — lab pack) */
function drcFixture(): Tier5JurisdictionProofFixture {
  return {
    code: 'CD',
    name: 'DR Congo',
    profileId: 'commodity-origin',
    expectedCircuitTarget: 'commodity-origin',
    subject: baseRedactedSubject('site-cd-lab-001', 'gold', [
      productionClaim('gold', 2.0, 'kg', 6.0, 25.0),
      {
        predicateType: 'OriginAuthenticated',
        predicateURI: 'tradepass://workproof/production/origin-authenticated',
        value: { kind: 'boolean', value: true },
        evidence: [],
        confidence: 1,
        issuedAt: 1704067200000,
        proof: redactedProof(),
      },
    ]),
    supplement: {
      circuitTarget: 'commodity-origin',
      bounds: GENERIC_AFRICA_BOUNDS,
      minPrimary: 950,
      minSecondary: 500,
      ...LAB_RANDOMNESS,
      merklePath: LAB_MERKLE,
    },
  };
}

/** Five engagement jurisdictions — one primary fixture each (GH = gold). */
export const TIER5_JURISDICTION_PROOF_FIXTURES: Tier5JurisdictionProofFixture[] = [
  zimbabweFixture(),
  ghanaGoldFixture(),
  namibiaFixture(),
  botswanaFixture(),
  drcFixture(),
];

export const TIER5_NAMED_PROFILE_IDS = [
  'gh-gold-origin',
  'gh-cocoa-origin',
  'zw-diamond-origin',
] as const;

export { GHANA_BOUNDS, ZW_BOUNDS, GENERIC_AFRICA_BOUNDS };
