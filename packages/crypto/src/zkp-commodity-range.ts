export interface CommodityRangeProofInput {
  /** Quantity value to prove is within range. */
  quantity: number;
  /** Minimum acceptable quantity (inclusive). */
  min: number;
  /** Maximum acceptable quantity (inclusive). */
  max: number;
  /** 32-byte hex hash of the commodity type (e.g. SHA-256 of "gold"). */
  commodityHash: string;
  /** 32-byte hex hash of the unit of measurement (e.g. SHA-256 of "grams"). */
  unitHash: string;
  /** 32-byte hex randomness for the Pedersen commitment. */
  randomness: string;
}

export interface CommodityRangeProof {
  system: 'bulletproofs';
  proofType: 'commodity_range';
  publicInputs: [string, string, string];
  proof: string;
  verificationKeyId: string;
  created: string;
}

const hex64Re = /^[0-9a-fA-F]{64}$/;

function assertHex64(value: string, label: string): void {
  if (!hex64Re.test(value)) {
    throw new TypeError(
      `${label}: expected 32-byte hex string (64 hex chars), got ${value.length}`
    );
  }
}

interface NativeZkpModule {
  bulletproofsProveCommodityRange: (
    quantity: number,
    min: number,
    max: number,
    commodityHashHex: string,
    unitHashHex: string,
    randomnessHex: string
  ) => {
    min: number;
    max: number;
    commitment: string;
    commodityHash: string;
    unitHash: string;
    proofLow: string;
    proofHigh: string;
  };
  bulletproofsVerifyCommodityRange: (
    min: number,
    max: number,
    commitmentHex: string,
    commodityHashHex: string,
    unitHashHex: string,
    proofLowHex: string,
    proofHighHex: string
  ) => boolean;
}

async function loadNativeZkp(): Promise<NativeZkpModule> {
  let mod: Record<string, unknown>;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('@gtcx/crypto-native') as Record<string, unknown>;
  } catch {
    throw new Error(
      'Native ZKP bindings are required for commodity range proofs but @gtcx/crypto-native is not installed or the binary is not compiled. ' +
        'Run `pnpm install` and build the native module.'
    );
  }

  const pick = <T>(keys: string[], label: string): T => {
    for (const key of keys) {
      const fn = mod[key];
      if (typeof fn === 'function') {
        return fn as T;
      }
    }
    throw new Error(`Native ZKP binding missing: ${label}`);
  };

  return {
    bulletproofsProveCommodityRange: pick(
      ['bulletproofsProveCommodityRange', 'bulletproofs_prove_commodity_range'],
      'bulletproofsProveCommodityRange'
    ),
    bulletproofsVerifyCommodityRange: pick(
      ['bulletproofsVerifyCommodityRange', 'bulletproofs_verify_commodity_range'],
      'bulletproofsVerifyCommodityRange'
    ),
  };
}

/**
 * Prove a commodity quantity lies within [min, max] using Bulletproofs.
 *
 * @param input - Quantity, range bounds, commodity hash, unit hash, and randomness.
 * @returns A {@link CommodityRangeProof} ready for serialization or verification.
 */
export async function proveCommodityRange(
  input: CommodityRangeProofInput
): Promise<CommodityRangeProof> {
  assertHex64(input.commodityHash, 'commodityHash');
  assertHex64(input.unitHash, 'unitHash');
  assertHex64(input.randomness, 'randomness');
  if (input.min > input.max) {
    throw new TypeError('min must be <= max');
  }

  const native = await loadNativeZkp();
  const bundle = native.bulletproofsProveCommodityRange(
    input.quantity,
    input.min,
    input.max,
    input.commodityHash,
    input.unitHash,
    input.randomness
  );

  return {
    system: 'bulletproofs',
    proofType: 'commodity_range',
    publicInputs: [String(input.min), String(input.max), bundle.commitment],
    proof: JSON.stringify({
      proofLow: bundle.proofLow,
      proofHigh: bundle.proofHigh,
      commodityHash: bundle.commodityHash,
      unitHash: bundle.unitHash,
    }),
    verificationKeyId: '',
    created: new Date().toISOString(),
  };
}

/**
 * Verify a commodity range proof.
 *
 * @param proof - The proof returned by {@link proveCommodityRange}.
 * @returns `true` if the proof is valid, `false` otherwise.
 */
export async function verifyCommodityRange(proof: CommodityRangeProof): Promise<boolean> {
  const native = await loadNativeZkp();
  const min = parseInt(proof.publicInputs[0] ?? '0', 10);
  const max = parseInt(proof.publicInputs[1] ?? '0', 10);
  const commitment = proof.publicInputs[2] ?? '';

  let proofData: { proofLow: string; proofHigh: string; commodityHash: string; unitHash: string };
  try {
    proofData = JSON.parse(proof.proof) as typeof proofData;
  } catch {
    return false;
  }

  return native.bulletproofsVerifyCommodityRange(
    min,
    max,
    commitment,
    proofData.commodityHash,
    proofData.unitHash,
    proofData.proofLow,
    proofData.proofHigh
  );
}
