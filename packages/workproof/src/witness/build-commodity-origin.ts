import { certificationBitMask, CertificationBit } from '../circuit-profiles/certification';
import { GH_GOLD_ORIGIN_PROFILE } from '../circuit-profiles/gh-gold-origin';
import type { WorkProofClaim, WorkProofCredentialSubject } from '../workproof/types';

import { WitnessBuildError } from './errors';
import type {
  CommodityOriginWitness,
  CommodityOriginWitnessSupplement,
  WitnessCircuitTarget,
} from './types';
import {
  commodityTypeFromLabel,
  coordToCircuitU64,
  lonToCircuitU64,
  digestHex32,
  parseGpsFromEvidenceMetadata,
  randomnessHex32,
} from './utils';

export interface BuildCommodityOriginWitnessInput {
  credentialSubject: WorkProofCredentialSubject;
  supplement: CommodityOriginWitnessSupplement;
}

/**
 * Map WorkProof production-origin predicate family to a typed commodity-origin witness.
 * Does not return raw witness bytes — use `serializeCommodityOriginWitness` for JSON DTO.
 */
export function buildCommodityOriginWitness(
  input: BuildCommodityOriginWitnessInput
): CommodityOriginWitness {
  const { credentialSubject, supplement } = input;
  const claims = credentialSubject.claims;

  const produced = findClaim(claims, 'CommodityProduced');
  if (!produced) {
    throw new WitnessBuildError(
      'MISSING_PRODUCTION_CLAIM',
      'CommodityProduced claim required for production-origin witness'
    );
  }

  const siteId = credentialSubject.siteId;
  if (!siteId?.trim()) {
    throw new WitnessBuildError(
      'MISSING_SITE_ID',
      'credentialSubject.siteId required to derive mineId'
    );
  }

  const gps =
    extractGpsFromClaims(claims) ??
    parseGpsFromEvidenceMetadata(produced.evidence[0]?.metadata as Record<string, unknown>);
  if (!gps) {
    throw new WitnessBuildError(
      'MISSING_GPS',
      'gps_location evidence (metadata.latitude/longitude) required'
    );
  }

  const commodityLabel =
    credentialSubject.commodityContext?.trim() || extractCommodityLabel(produced);
  const commodityType = commodityTypeFromLabel(commodityLabel);
  const { primaryMetric, secondaryMetric } = extractMetrics(claims, produced);

  const useGhGoldProfile =
    supplement.circuitTarget === 'gh-gold-origin' ||
    (supplement.circuitTarget === undefined && commodityType === 0);

  const circuitTarget: WitnessCircuitTarget = useGhGoldProfile
    ? 'gh-gold-origin'
    : (supplement.circuitTarget ?? 'commodity-origin');

  const profileBounds = useGhGoldProfile ? GH_GOLD_ORIGIN_PROFILE.bounds : supplement.bounds;
  const profileMinPrimary = useGhGoldProfile
    ? GH_GOLD_ORIGIN_PROFILE.minPrimary
    : supplement.minPrimary;
  const profileMinSecondary = useGhGoldProfile
    ? GH_GOLD_ORIGIN_PROFILE.minSecondary
    : supplement.minSecondary;

  let certificationFlags = supplement.certificationFlags ?? 0;
  if (findClaim(claims, 'OriginAuthenticated')) {
    certificationFlags |= certificationBitMask(CertificationBit.OriginAuthenticated);
  }
  if (findClaim(claims, 'GoldBuyingLicenseValid')) {
    certificationFlags |= certificationBitMask(CertificationBit.RegulatoryExportLicense);
  }
  if (useGhGoldProfile) {
    certificationFlags |= GH_GOLD_ORIGIN_PROFILE.requiredCertificationMask;
  }

  return {
    circuitTarget,
    commodityType,
    mineIdHex: digestHex32(`gtcx:mine:${siteId}`),
    lat: coordToCircuitU64(gps.lat),
    lon: lonToCircuitU64(gps.lon),
    primaryMetric,
    secondaryMetric,
    primaryRandomnessHex: supplement.primaryRandomnessHex ?? randomnessHex32(),
    secondaryRandomnessHex: supplement.secondaryRandomnessHex ?? randomnessHex32(),
    locationRandomnessHex: supplement.locationRandomnessHex ?? randomnessHex32(),
    bounds: profileBounds,
    minPrimary: profileMinPrimary,
    minSecondary: profileMinSecondary,
    certificationFlags,
    merklePath: supplement.merklePath,
  };
}

/** JSON DTO for `gtcx-zkp::CommodityOriginWitness::from_json`. */
export function serializeCommodityOriginWitness(witness: CommodityOriginWitness): string {
  return JSON.stringify(witness);
}

function findClaim(claims: WorkProofClaim[], predicateType: string): WorkProofClaim | undefined {
  return claims.find((c) => c.predicateType === predicateType);
}

function extractGpsFromClaims(claims: WorkProofClaim[]) {
  for (const claim of claims) {
    for (const item of claim.evidence) {
      if (item.type === 'gps_location') {
        const gps = parseGpsFromEvidenceMetadata(item.metadata as Record<string, unknown>);
        if (gps) return gps;
      }
    }
  }
  return undefined;
}

function extractCommodityLabel(claim: WorkProofClaim): string {
  const v = claim.value;
  if (v.kind === 'composite' && typeof v.components['commodity'] === 'object') {
    const c = v.components['commodity'];
    if (c && typeof c === 'object' && 'kind' in c) {
      if (c.kind === 'localized' && c.value['en']) return c.value['en'];
      if (c.kind === 'enum') return c.value;
    }
  }
  return 'gold';
}

function extractMetrics(
  claims: WorkProofClaim[],
  produced: WorkProofClaim
): { primaryMetric: number; secondaryMetric: number } {
  const quantity = findClaim(claims, 'QuantityVerified');
  if (quantity?.value.kind === 'numeric') {
    const grams = Math.round(quantity.value.value * 1000);
    return { primaryMetric: 995, secondaryMetric: grams };
  }

  if (produced.value.kind === 'numeric') {
    const grams = Math.round(produced.value.value * 1000);
    return { primaryMetric: 995, secondaryMetric: grams };
  }

  if (produced.value.kind === 'composite') {
    const q = produced.value.components['quantity'];
    if (q && typeof q === 'object' && 'kind' in q && q.kind === 'numeric') {
      const grams = Math.round(q.value * 1000);
      return { primaryMetric: 995, secondaryMetric: grams };
    }
  }

  const graded = findClaim(claims, 'QualityGraded');
  if (graded?.value.kind === 'enum') {
    const purity =
      graded.value.value === 'high' ? 995 : graded.value.value === 'medium' ? 900 : 800;
    return { primaryMetric: purity, secondaryMetric: 1000 };
  }

  if (produced.value.kind === 'boolean' && produced.value.value) {
    return { primaryMetric: 995, secondaryMetric: 1000 };
  }

  throw new WitnessBuildError(
    'INVALID_QUANTITY',
    'numeric quantity or QualityGraded claim required for metrics'
  );
}
