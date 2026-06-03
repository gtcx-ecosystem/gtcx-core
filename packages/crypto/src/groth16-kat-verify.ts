import type { CommodityOriginProfileId, CommodityOriginProfileProof } from './zkp-circuit-profile';
import { verifyCommodityOriginProfile } from './zkp-circuit-profile';

/** Minimal CommodityOrigin KAT shape (matches `@gtcx/zkp-kat-vectors` artifacts). */
export interface CommodityOriginKatLike {
  circuit: string;
  expected_verify: boolean;
  generated_at?: number;
  public_inputs: Record<string, unknown>;
  public_inputs_json?: string;
  proof_bytes: string;
  verifying_key_bytes: string;
}

/** Compressed ark_bn254::Fr(0) / Fr(1) for bit-decomposed CommodityOrigin public inputs. */
const FR_BIT_HEX: readonly [string, string] = [
  '0000000000000000000000000000000000000000000000000000000000000000',
  '0100000000000000000000000000000000000000000000000000000000000000',
];

function pushBitsLE(values: string[], value: number, width: number): void {
  for (let i = 0; i < width; i++) {
    values.push(FR_BIT_HEX[(value >> i) & 1]!);
  }
}

function pushHexBytesLE(values: string[], hex: string): void {
  const bytes = Buffer.from(hex, 'hex');
  for (const byte of bytes) {
    for (let i = 0; i < 8; i++) {
      values.push(FR_BIT_HEX[(byte >> i) & 1]!);
    }
  }
}

/**
 * Build NAPI `public_inputs_json` from a CommodityOrigin KAT `public_inputs` object.
 * Mirrors `public_inputs_from_kat` in `rust/gtcx-zkp`.
 */
export function commodityOriginPublicInputsJsonFromKat(pi: Record<string, unknown>): string {
  const values: string[] = [];

  const commodityType = Number(pi['commodity_type'] ?? 0);
  pushBitsLE(values, commodityType, 64);

  for (const field of [
    'region_hash',
    'primary_commitment',
    'secondary_commitment',
    'mines_root',
  ] as const) {
    pushHexBytesLE(values, String(pi[field] ?? ''));
  }

  pushBitsLE(values, Number(pi['min_primary'] ?? 0), 64);
  pushBitsLE(values, Number(pi['min_secondary'] ?? 0), 64);
  pushBitsLE(values, Number(pi['certification_flags'] ?? 0), 64);

  return JSON.stringify(values);
}

export function katToCommodityOriginProfileProof(
  kat: CommodityOriginKatLike,
  profileId: CommodityOriginProfileId
): CommodityOriginProfileProof {
  const publicInputsJson =
    typeof kat.public_inputs_json === 'string' && kat.public_inputs_json.length > 0
      ? kat.public_inputs_json
      : commodityOriginPublicInputsJsonFromKat(kat.public_inputs);

  return {
    system: 'groth16',
    proofType: 'commodity_origin',
    profileId,
    publicInputs: [publicInputsJson],
    proof: kat.proof_bytes,
    verificationKeyId: kat.verifying_key_bytes,
    created: new Date((kat.generated_at ?? 0) * 1000).toISOString(),
  };
}

/**
 * Verify a CommodityOrigin Groth16 KAT through the same native path as protocol services.
 */
export async function verifyGroth16CommodityOriginKat(
  kat: CommodityOriginKatLike,
  profileId: CommodityOriginProfileId
): Promise<boolean> {
  if (kat.circuit !== 'CommodityOrigin' || !kat.expected_verify) {
    return false;
  }
  const proof = katToCommodityOriginProfileProof(kat, profileId);
  return verifyCommodityOriginProfile(proof);
}
