// ============================================================================
// CIRCUIT PROFILES (DTF-5.1.2) — registry IDs over commodity-origin R1CS
// ============================================================================

/** Registry profile IDs (not separate cryptographic circuits). */
export type CircuitProfileId = 'gh-gold-origin' | 'zw-diamond-origin' | 'commodity-origin';

/** Underlying Groth16 circuit type (always commodity-origin for origin profiles). */
export type UnderlyingGroth16Circuit = 'CommodityOrigin';

/** Metric interpretation for verifiers (off-chain policy). */
export type ProfileMetricSemantics = 'purity-basis-points-and-grams' | 'clarity-and-centi-carats';

/** Configurable policy pack — no jurisdiction literals in crypto code. */
export interface CommodityOriginProfileConfig {
  profileId: CircuitProfileId;
  underlyingCircuit: UnderlyingGroth16Circuit;
  jurisdictionCode: string;
  commodityType: number;
  bounds: [number, number, number, number];
  minPrimary: number;
  minSecondary: number;
  requiredCertificationMask: number;
  metricSemantics: ProfileMetricSemantics;
  policyNotes: string;
}
