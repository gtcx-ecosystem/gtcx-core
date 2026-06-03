// ============================================================================
// Commodity-origin ZK proof attachment (DTF-5.2.2)
// Bridges @gtcx/workproof witnesses and @gtcx/crypto profile proofs into bundles.
// ============================================================================

import type { CommodityOriginProfileProof, CommodityOriginProfileProofInput } from '@gtcx/crypto';

import type { CommodityOriginProfileId, CommodityOriginZkProofRef, ProofBundle } from '../types';

/** Lab merkle path for default 4-leaf tree (leaf index 0) — matches gtcx-zkp samples. */
export const DEFAULT_LAB_MERKLE_PATH_HEX =
  '200000000000000099795c4a032e419d11bf6b126146caf2017d9af9f81069e830c1df1e64c96a230100000000000000200000000000000076f751a99f42cf35974e668242fdc5b4e57486a4e95f7b2fc1bd878b99903b410000000000000000';

/** Minimal witness shape from @gtcx/workproof (avoids runtime dependency in library code). */
export interface CommodityOriginWitnessLike {
  circuitTarget: string;
  mineIdHex: string;
  lat: number;
  lon: number;
  primaryMetric: number;
  secondaryMetric: number;
  primaryRandomnessHex: string;
  secondaryRandomnessHex: string;
  locationRandomnessHex: string;
  certificationFlags: number;
}

/**
 * Map a profile-bound workproof witness to crypto prove input.
 */
export function commodityOriginWitnessToProfileInput(
  witness: CommodityOriginWitnessLike,
  keys: { provingKey: string; verifyingKey: string },
  merklePathHex: string = DEFAULT_LAB_MERKLE_PATH_HEX
): CommodityOriginProfileProofInput {
  const profileId = witness.circuitTarget;
  if (profileId !== 'gh-gold-origin' && profileId !== 'zw-diamond-origin') {
    throw new TypeError(
      `commodityOriginWitnessToProfileInput: unsupported circuitTarget ${witness.circuitTarget}`
    );
  }
  return {
    profileId,
    mineId: witness.mineIdHex,
    lat: witness.lat,
    lon: witness.lon,
    primaryMetric: witness.primaryMetric,
    secondaryMetric: witness.secondaryMetric,
    primaryRandomness: witness.primaryRandomnessHex,
    secondaryRandomness: witness.secondaryRandomnessHex,
    locationRandomness: witness.locationRandomnessHex,
    certificationFlags: witness.certificationFlags,
    merklePath: merklePathHex,
    provingKey: keys.provingKey,
    verifyingKey: keys.verifyingKey,
  };
}

/** Build a bundle-safe ZK proof reference from a crypto profile proof. */
export function createCommodityOriginZkProofRef(
  proof: CommodityOriginProfileProof
): CommodityOriginZkProofRef {
  return {
    profileId: proof.profileId,
    system: 'groth16',
    proofType: 'commodity_origin',
    proof: proof.proof,
    verifyingKey: proof.verificationKeyId,
    publicInputsJson: proof.publicInputs[0] ?? '[]',
  };
}

/** Rehydrate a crypto profile proof for verification. */
export function commodityOriginZkProofRefToProfileProof(
  ref: CommodityOriginZkProofRef
): CommodityOriginProfileProof {
  return {
    system: 'groth16',
    proofType: 'commodity_origin',
    profileId: ref.profileId,
    proof: ref.proof,
    verificationKeyId: ref.verifyingKey,
    publicInputs: [ref.publicInputsJson],
    created: new Date().toISOString(),
  };
}

/** Structural validation for an attached commodity-origin ZK proof. */
export function verifyCommodityOriginZkProofStructure(ref: CommodityOriginZkProofRef): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (ref.system !== 'groth16') errors.push('commodityOriginZkProof.system must be groth16');
  if (ref.proofType !== 'commodity_origin') {
    errors.push('commodityOriginZkProof.proofType must be commodity_origin');
  }
  if (!ref.profileId) errors.push('Missing profileId');
  if (!ref.proof?.length) errors.push('Missing proof bytes');
  if (!ref.verifyingKey?.length) errors.push('Missing verifyingKey');
  if (!ref.publicInputsJson?.length) errors.push('Missing publicInputsJson');
  return { valid: errors.length === 0, errors };
}

/** Cryptographic verification via @gtcx/crypto (native Groth16). */
export async function verifyCommodityOriginZkProofCryptographic(
  ref: CommodityOriginZkProofRef
): Promise<boolean> {
  const structural = verifyCommodityOriginZkProofStructure(ref);
  if (!structural.valid) return false;
  const { verifyCommodityOriginProfile } = await import('@gtcx/crypto');
  return verifyCommodityOriginProfile(commodityOriginZkProofRefToProfileProof(ref));
}

/** Attach a commodity-origin ZK proof to an existing proof bundle (immutable copy). */
export function attachCommodityOriginZkProof(
  bundle: ProofBundle,
  zkProof: CommodityOriginZkProofRef
): ProofBundle {
  return {
    ...bundle,
    proofs: {
      ...bundle.proofs,
      commodityOriginZkProof: zkProof,
    },
  };
}

export type { CommodityOriginProfileId };
