import type { ZKProof } from './zkp';
import {
  type CommodityOriginProfileProof,
  generateCommodityOriginProfileKeys,
  proveCommodityOriginProfile,
  verifyCommodityOriginProfile,
} from './zkp-circuit-profile';

/** Origin-authenticated / LICOR traceability bit (profile `gh-cocoa-origin`). */
export const GH_COCOA_ORIGIN_AUTHENTICATED_MASK = 2;

export interface GhCocoaOriginProofInput {
  /** Farm or buying-station site id (hashed to mineId in circuit). */
  farmId: string;
  lat: number;
  lon: number;
  /** Cocoa grade score (profile primary metric). */
  gradeScore: number;
  /** Mass in grams. */
  weightGrams: number;
  gradeRandomness: string;
  weightRandomness: string;
  locationRandomness: string;
  /** Must include origin-authenticated bit (mask 2). */
  certificationFlags: number;
  merklePath: string;
  provingKey: string;
  verifyingKey: string;
}

export interface GhCocoaOriginProof extends ZKProof {
  system: 'groth16';
  proofType: 'commodity_origin';
  profileId: 'gh-cocoa-origin';
}

function toProfileInput(input: GhCocoaOriginProofInput) {
  if (
    (input.certificationFlags & GH_COCOA_ORIGIN_AUTHENTICATED_MASK) !==
    GH_COCOA_ORIGIN_AUTHENTICATED_MASK
  ) {
    throw new TypeError(
      `certificationFlags must include origin-authenticated bit (mask ${GH_COCOA_ORIGIN_AUTHENTICATED_MASK})`
    );
  }
  return {
    profileId: 'gh-cocoa-origin' as const,
    mineId: input.farmId,
    lat: input.lat,
    lon: input.lon,
    primaryMetric: input.gradeScore,
    secondaryMetric: input.weightGrams,
    primaryRandomness: input.gradeRandomness,
    secondaryRandomness: input.weightRandomness,
    locationRandomness: input.locationRandomness,
    certificationFlags: input.certificationFlags,
    merklePath: input.merklePath,
    provingKey: input.provingKey,
    verifyingKey: input.verifyingKey,
  };
}

/** Generate Groth16 keys for gh-cocoa-origin (underlying commodity-origin R1CS). */
export async function generateGhCocoaOriginKeys(): Promise<{
  provingKey: string;
  verifyingKey: string;
}> {
  return generateCommodityOriginProfileKeys();
}

/** Prove gh-cocoa-origin profile (policy validation + CommodityOrigin R1CS). */
export async function proveGhCocoaOrigin(
  input: GhCocoaOriginProofInput
): Promise<GhCocoaOriginProof> {
  const proof = await proveCommodityOriginProfile(toProfileInput(input));
  return { ...proof, profileId: 'gh-cocoa-origin' };
}

/** Verify a gh-cocoa-origin proof. */
export async function verifyGhCocoaOrigin(proof: GhCocoaOriginProof): Promise<boolean> {
  return verifyCommodityOriginProfile(proof as CommodityOriginProfileProof);
}
