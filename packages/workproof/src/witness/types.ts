// ============================================================================
// TYPED CIRCUIT WITNESSES (DTF-5.1.1)
// Structured witnesses for Groth16 circuits — no opaque Uint8Array blobs.
// ============================================================================

/** Groth16 circuit target for commodity-origin family. */
export type WitnessCircuitTarget =
  | 'commodity-origin'
  | 'gh-gold-origin'
  | 'gh-cocoa-origin'
  | 'zw-diamond-origin';

/** Merkle path witness for approved-mine membership. */
export interface CommodityOriginMerklePathWitness {
  leafIndex: number;
  /** Hex-encoded 32-byte sibling digests (optional for default 4-leaf lab tree). */
  pathDigestsHex: string[];
}

/**
 * Prove-ready commodity-origin witness (interchange with `gtcx-zkp` JSON DTO).
 * Field names use camelCase to match Rust `serde`.
 */
export interface CommodityOriginWitness {
  circuitTarget: WitnessCircuitTarget;
  commodityType: number;
  /** 32-byte mine/site id (hex, no 0x prefix). */
  mineIdHex: string;
  lat: number;
  lon: number;
  /** e.g. purity in basis points (995 = 99.5%) for gold. */
  primaryMetric: number;
  /** e.g. weight in grams. */
  secondaryMetric: number;
  primaryRandomnessHex: string;
  secondaryRandomnessHex: string;
  locationRandomnessHex: string;
  /** [minLat, maxLat, minLon, maxLon] — same encoding as Rust circuit. */
  bounds: [number, number, number, number];
  minPrimary: number;
  minSecondary: number;
  /** Bit flags (e.g. COCOBOD license, origin authenticated). */
  certificationFlags: number;
  merklePath: CommodityOriginMerklePathWitness;
}

/** Policy inputs not derivable from WorkProof claims alone. */
export interface CommodityOriginWitnessSupplement {
  bounds: [number, number, number, number];
  minPrimary: number;
  minSecondary: number;
  merklePath: CommodityOriginMerklePathWitness;
  primaryRandomnessHex?: string;
  secondaryRandomnessHex?: string;
  locationRandomnessHex?: string;
  certificationFlags?: number;
  circuitTarget?: WitnessCircuitTarget;
}

/** Predicate types in the production-origin family (feeds commodity-origin circuits). */
export const PRODUCTION_ORIGIN_PREDICATE_FAMILY = [
  'CommodityProduced',
  'OriginAuthenticated',
  'QuantityVerified',
  'QualityGraded',
] as const;

export type ProductionOriginPredicateType = (typeof PRODUCTION_ORIGIN_PREDICATE_FAMILY)[number];
