import type { ZKProof } from './zkp';
import {
  type CommodityOriginProofInput,
  generateCommodityOriginKeys,
  proveCommodityOrigin,
  verifyCommodityOrigin,
} from './zkp-commodity-origin';

export interface DiamondOriginProofInput {
  /** Mine identifier — 32-byte hex string (64 characters). */
  mineId: string;
  /** GPS latitude in micro-degrees or appropriate fixed-point representation. */
  lat: number;
  /** GPS longitude in micro-degrees or appropriate fixed-point representation. */
  lon: number;
  /** Clarity score (e.g. 0–100). */
  clarity: number;
  /** Carat weight in centi-carats (e.g. 50 = 0.5ct). */
  carat: number;
  /** 32-byte hex randomness for clarity commitment. */
  clarityRandomness: string;
  /** 32-byte hex randomness for carat commitment. */
  caratRandomness: string;
  /** 32-byte hex randomness for location commitment. */
  locationRandomness: string;
  /** Geographic bounds: [minLat, maxLat, minLon, maxLon]. */
  bounds: [number, number, number, number];
  /** Minimum clarity threshold the proof must satisfy. */
  minClarity: number;
  /** Minimum carat threshold the proof must satisfy. */
  minCarat: number;
  /** Kimberley Process certification flag (must be true). */
  kpCertified: boolean;
  /** Serialized Merkle path proving mine registry membership (hex). */
  merklePath: string;
  /** Proving key from {@link generateDiamondOriginKeys}. */
  provingKey: string;
  /** Verifying key from {@link generateDiamondOriginKeys}. */
  verifyingKey: string;
}

export interface DiamondOriginProof extends ZKProof {
  system: 'groth16';
  proofType: 'commodity_origin';
}

const KP_CERTIFIED_FLAG = 1; // bit 0

function toCommodityInput(input: DiamondOriginProofInput): CommodityOriginProofInput {
  return {
    commodityType: 1, // diamond
    mineId: input.mineId,
    lat: input.lat,
    lon: input.lon,
    primaryMetric: input.clarity,
    secondaryMetric: input.carat,
    primaryRandomness: input.clarityRandomness,
    secondaryRandomness: input.caratRandomness,
    locationRandomness: input.locationRandomness,
    bounds: input.bounds,
    minPrimary: input.minClarity,
    minSecondary: input.minCarat,
    certificationFlags: input.kpCertified ? KP_CERTIFIED_FLAG : 0,
    merklePath: input.merklePath,
    provingKey: input.provingKey,
    verifyingKey: input.verifyingKey,
  };
}

/**
 * Generate Groth16 proving and verifying keys for the diamond origin circuit.
 *
 * Diamonds use the unified commodity origin circuit; this is a convenience
 * wrapper that calls the generic key generator.
 *
 * @returns Hex-encoded proving and verifying keys.
 */
export async function generateDiamondOriginKeys(): Promise<{
  provingKey: string;
  verifyingKey: string;
}> {
  return generateCommodityOriginKeys();
}

/**
 * Prove a diamond origin statement.
 *
 * Proves that a Zimbabwean diamond mine is within licensed geographic bounds,
 * meets minimum clarity and carat thresholds, is registered in the approved
 * mines Merkle tree, and is Kimberley Process certified — without revealing
 * the exact location or mine identity.
 *
 * This is a convenience wrapper over the commodity-agnostic
 * {@link proveCommodityOrigin} circuit with `commodityType = 1` (diamond).
 *
 * @param input - Structured witness and circuit parameters.
 * @returns A {@link DiamondOriginProof} ready for serialization or verification.
 */
export async function proveDiamondOrigin(
  input: DiamondOriginProofInput
): Promise<DiamondOriginProof> {
  if (!input.kpCertified) {
    throw new TypeError('kpCertified must be true for diamond origin proofs');
  }
  const proof = await proveCommodityOrigin(toCommodityInput(input));
  return {
    ...proof,
    proofType: 'commodity_origin',
  };
}

/**
 * Verify a diamond origin proof.
 *
 * @param proof - The proof returned by {@link proveDiamondOrigin}.
 * @returns `true` if the proof is valid, `false` otherwise.
 */
export async function verifyDiamondOrigin(proof: DiamondOriginProof): Promise<boolean> {
  return verifyCommodityOrigin(proof);
}
