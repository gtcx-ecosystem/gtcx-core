/**
 * Type definitions for GTCX ZKP Known Answer Test (KAT) vectors.
 *
 * These types describe the canonical JSON structure of KAT artifacts
 * used for cross-implementation validation and regression testing.
 */

export interface Groth16KatPublicInputs {
  /** Circuit-specific public inputs as bit-decomposed field elements. */
  [key: string]: unknown;
}

export interface Groth16KatWitness {
  /** Circuit-specific witness values (private inputs). */
  [key: string]: unknown;
}

export interface Groth16KatArtifact {
  version: '1.0.0';
  circuit: string;
  generated_at: number;
  vk_hash: string;
  witness: Groth16KatWitness;
  public_inputs: Groth16KatPublicInputs;
  proof_bytes: string;
  verifying_key_bytes: string;
  expected_verify: boolean;
  /** Policy profile ID when this KAT is an alias on CommodityOrigin (e.g. gh-gold-origin). */
  profile_id?: string;
  /** Underlying R1CS circuit name for profile aliases. */
  underlying_circuit?: string;
}

export interface BulletproofsKatPublicInputs {
  commitment: string;
  min: number;
  max: number;
  commodity_hash?: string;
  unit_hash?: string;
}

export interface BulletproofsKatWitness {
  value: number;
  randomness: string;
  commodity_hash?: string;
  unit_hash?: string;
}

export interface BulletproofsKatArtifact {
  version: '1.0.0';
  circuit: string;
  generated_at: number;
  witness: BulletproofsKatWitness;
  public_inputs: BulletproofsKatPublicInputs;
  proof_low_bytes: string;
  proof_high_bytes: string;
  expected_verify: boolean;
}

/** Union of all supported KAT artifact types. */
export type KatArtifact = Groth16KatArtifact | BulletproofsKatArtifact;

/** All available circuit names for KAT vectors. */
export type KatCircuitName =
  | 'groth16-gci-threshold'
  | 'groth16-asset-ownership'
  | 'groth16-location-region'
  | 'groth16-commodity-origin'
  | 'groth16-gh-gold-origin'
  | 'bulletproofs-amount-range'
  | 'bulletproofs-commodity-range';
