import type { ZKProof } from './zkp';
import {
  type CommodityOriginProfileProof,
  generateCommodityOriginProfileKeys,
  proveCommodityOriginProfile,
  verifyCommodityOriginProfile,
} from './zkp-circuit-profile';

/** Regulatory export license bit (profile `gh-gold-origin`). */
export const GH_GOLD_REGULATORY_EXPORT_MASK = 4;

export interface GhGoldOriginProofInput {
  mineId: string;
  lat: number;
  lon: number;
  /** Purity in basis points (995 = 99.5%). */
  purityBps: number;
  /** Mass in grams. */
  weightGrams: number;
  purityRandomness: string;
  weightRandomness: string;
  locationRandomness: string;
  /** Must include regulatory export license bit (mask 4). */
  certificationFlags: number;
  merklePath: string;
  provingKey: string;
  verifyingKey: string;
}

export interface GhGoldOriginProof extends ZKProof {
  system: 'groth16';
  proofType: 'commodity_origin';
  profileId: 'gh-gold-origin';
}

function toProfileInput(input: GhGoldOriginProofInput) {
  if (
    (input.certificationFlags & GH_GOLD_REGULATORY_EXPORT_MASK) !==
    GH_GOLD_REGULATORY_EXPORT_MASK
  ) {
    throw new TypeError(
      `certificationFlags must include regulatory export license bit (mask ${GH_GOLD_REGULATORY_EXPORT_MASK})`
    );
  }
  return {
    profileId: 'gh-gold-origin' as const,
    mineId: input.mineId,
    lat: input.lat,
    lon: input.lon,
    primaryMetric: input.purityBps,
    secondaryMetric: input.weightGrams,
    primaryRandomness: input.purityRandomness,
    secondaryRandomness: input.weightRandomness,
    locationRandomness: input.locationRandomness,
    certificationFlags: input.certificationFlags,
    merklePath: input.merklePath,
    provingKey: input.provingKey,
    verifyingKey: input.verifyingKey,
  };
}

/** Generate Groth16 keys for gh-gold-origin (underlying commodity-origin R1CS). */
export async function generateGhGoldOriginKeys(): Promise<{
  provingKey: string;
  verifyingKey: string;
}> {
  return generateCommodityOriginProfileKeys();
}

/** Prove gh-gold-origin profile (policy validation + CommodityOrigin R1CS). */
export async function proveGhGoldOrigin(input: GhGoldOriginProofInput): Promise<GhGoldOriginProof> {
  const proof = await proveCommodityOriginProfile(toProfileInput(input));
  return { ...proof, profileId: 'gh-gold-origin' };
}

/** Verify a gh-gold-origin proof. */
export async function verifyGhGoldOrigin(proof: GhGoldOriginProof): Promise<boolean> {
  return verifyCommodityOriginProfile(proof as CommodityOriginProfileProof);
}
