import type { ZKProof } from './zkp';
import {
  type CommodityOriginProfileProof,
  generateCommodityOriginProfileKeys,
  proveCommodityOriginProfile,
  verifyCommodityOriginProfile,
} from './zkp-circuit-profile';

/** Regional certification bit (profile `zw-diamond-origin`). */
export const ZW_DIAMOND_REGIONAL_CERT_MASK = 1;

export interface ZwDiamondOriginProofInput {
  mineId: string;
  lat: number;
  lon: number;
  /** Clarity score (profile primary metric). */
  clarityScore: number;
  /** Mass in centi-carats. */
  centiCarats: number;
  clarityRandomness: string;
  massRandomness: string;
  locationRandomness: string;
  /** Must include regional certification bit (mask 1). */
  certificationFlags: number;
  merklePath: string;
  provingKey: string;
  verifyingKey: string;
}

export interface ZwDiamondOriginProof extends ZKProof {
  system: 'groth16';
  proofType: 'commodity_origin';
  profileId: 'zw-diamond-origin';
}

function toProfileInput(input: ZwDiamondOriginProofInput) {
  if (
    (input.certificationFlags & ZW_DIAMOND_REGIONAL_CERT_MASK) !==
    ZW_DIAMOND_REGIONAL_CERT_MASK
  ) {
    throw new TypeError(
      `certificationFlags must include regional certification bit (mask ${ZW_DIAMOND_REGIONAL_CERT_MASK})`
    );
  }
  return {
    profileId: 'zw-diamond-origin' as const,
    mineId: input.mineId,
    lat: input.lat,
    lon: input.lon,
    primaryMetric: input.clarityScore,
    secondaryMetric: input.centiCarats,
    primaryRandomness: input.clarityRandomness,
    secondaryRandomness: input.massRandomness,
    locationRandomness: input.locationRandomness,
    certificationFlags: input.certificationFlags,
    merklePath: input.merklePath,
    provingKey: input.provingKey,
    verifyingKey: input.verifyingKey,
  };
}

/** Generate Groth16 keys for zw-diamond-origin (underlying commodity-origin R1CS). */
export async function generateZwDiamondOriginKeys(): Promise<{
  provingKey: string;
  verifyingKey: string;
}> {
  return generateCommodityOriginProfileKeys();
}

/** Prove zw-diamond-origin profile (policy validation + CommodityOrigin R1CS). */
export async function proveZwDiamondOrigin(
  input: ZwDiamondOriginProofInput
): Promise<ZwDiamondOriginProof> {
  const proof = await proveCommodityOriginProfile(toProfileInput(input));
  return { ...proof, profileId: 'zw-diamond-origin' };
}

/** Verify a zw-diamond-origin proof. */
export async function verifyZwDiamondOrigin(proof: ZwDiamondOriginProof): Promise<boolean> {
  return verifyCommodityOriginProfile(proof as CommodityOriginProfileProof);
}
