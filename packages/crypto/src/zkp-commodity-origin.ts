import type { ZKProof } from './zkp';

export interface CommodityOriginProofInput {
  /** Mine identifier — 32-byte hex string (64 characters). */
  mineId: string;
  /** GPS latitude in micro-degrees or appropriate fixed-point representation. */
  lat: number;
  /** GPS longitude in micro-degrees or appropriate fixed-point representation. */
  lon: number;
  /** Assayed purity value (e.g. parts per billion). */
  purity: number;
  /** Weight value in appropriate units. */
  weight: number;
  /** 32-byte hex randomness for purity commitment. */
  purityRandomness: string;
  /** 32-byte hex randomness for weight commitment. */
  weightRandomness: string;
  /** 32-byte hex randomness for location commitment. */
  locationRandomness: string;
  /** Geographic bounds: [minLat, maxLat, minLon, maxLon]. */
  bounds: [number, number, number, number];
  /** Minimum purity threshold the proof must satisfy. */
  minPurity: number;
  /** Minimum weight threshold the proof must satisfy. */
  minWeight: number;
  /** Serialized Merkle path proving mine registry membership (hex). */
  merklePath: string;
  /** Proving key from {@link generateCommodityOriginKeys}. */
  provingKey: string;
  /** Verifying key from {@link generateCommodityOriginKeys}. */
  verifyingKey: string;
}

export interface CommodityOriginProof extends ZKProof {
  system: 'groth16';
  proofType: 'commodity_origin';
}

const hex64Re = /^[0-9a-fA-F]{64}$/;
const hexRe = /^[0-9a-fA-F]+$/;

function assertHex64(value: string, label: string): void {
  if (!hex64Re.test(value)) {
    throw new TypeError(
      `${label}: expected 32-byte hex string (64 hex chars), got ${value.length}`
    );
  }
}

function assertHexEven(value: string, label: string): void {
  if (!hexRe.test(value) || value.length % 2 !== 0) {
    throw new TypeError(`${label}: expected even-length hex string`);
  }
}

interface NativeZkpModule {
  groth16GenerateKeys: (circuitType: string) => { provingKey: string; verifyingKey: string };
  groth16ProveCommodityOrigin: (
    mineIdHex: string,
    lat: number,
    lon: number,
    purity: number,
    weight: number,
    purityRandomnessHex: string,
    weightRandomnessHex: string,
    locationRandomnessHex: string,
    bounds: number[],
    minPurity: number,
    minWeight: number,
    merklePathHex: string,
    provingKeyHex: string,
    verifyingKeyHex: string
  ) => { proof: string; verifyingKey: string; publicInputsJson: string };
  groth16VerifyProof: (
    circuitType: string,
    proofHex: string,
    verifyingKeyHex: string,
    publicInputsJson: string
  ) => boolean;
}

async function loadNativeZkp(): Promise<NativeZkpModule> {
  let mod: Record<string, unknown>;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('@gtcx/crypto-native') as Record<string, unknown>;
  } catch {
    throw new Error(
      'Native ZKP bindings are required for commodity origin proofs but @gtcx/crypto-native is not installed or the binary is not compiled. ' +
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
    groth16GenerateKeys: pick(
      ['groth16GenerateKeys', 'groth16_generate_keys'],
      'groth16GenerateKeys'
    ),
    groth16ProveCommodityOrigin: pick(
      ['groth16ProveCommodityOrigin', 'groth16_prove_commodity_origin'],
      'groth16ProveCommodityOrigin'
    ),
    groth16VerifyProof: pick(['groth16VerifyProof', 'groth16_verify_proof'], 'groth16VerifyProof'),
  };
}

/**
 * Generate Groth16 proving and verifying keys for the commodity origin circuit.
 *
 * @returns Hex-encoded proving and verifying keys.
 */
export async function generateCommodityOriginKeys(): Promise<{
  provingKey: string;
  verifyingKey: string;
}> {
  const native = await loadNativeZkp();
  const keys = native.groth16GenerateKeys('commodity_origin');
  return {
    provingKey: keys.provingKey,
    verifyingKey: keys.verifyingKey,
  };
}

/**
 * Prove a commodity origin statement.
 *
 * Proves that a mine (identified by `mineId`) is within licensed geographic
 * bounds, meets minimum purity and weight thresholds, and is registered in the
 * approved mines Merkle tree — without revealing the exact location or identity.
 *
 * @param input - Structured witness and circuit parameters.
 * @returns A {@link CommodityOriginProof} ready for serialization or verification.
 */
export async function proveCommodityOrigin(
  input: CommodityOriginProofInput
): Promise<CommodityOriginProof> {
  assertHex64(input.mineId, 'mineId');
  assertHex64(input.purityRandomness, 'purityRandomness');
  assertHex64(input.weightRandomness, 'weightRandomness');
  assertHex64(input.locationRandomness, 'locationRandomness');
  assertHexEven(input.merklePath, 'merklePath');
  assertHexEven(input.provingKey, 'provingKey');
  assertHexEven(input.verifyingKey, 'verifyingKey');
  if (input.bounds.length !== 4) {
    throw new TypeError('bounds must have exactly 4 elements [minLat, maxLat, minLon, maxLon]');
  }

  const native = await loadNativeZkp();
  const bundle = native.groth16ProveCommodityOrigin(
    input.mineId,
    input.lat,
    input.lon,
    input.purity,
    input.weight,
    input.purityRandomness,
    input.weightRandomness,
    input.locationRandomness,
    Array.from(input.bounds),
    input.minPurity,
    input.minWeight,
    input.merklePath,
    input.provingKey,
    input.verifyingKey
  );

  return {
    system: 'groth16',
    proofType: 'commodity_origin',
    publicInputs: [bundle.publicInputsJson],
    proof: bundle.proof,
    verificationKeyId: bundle.verifyingKey,
    created: new Date().toISOString(),
  };
}

/**
 * Verify a commodity origin proof.
 *
 * @param proof - The proof returned by {@link proveCommodityOrigin}.
 * @returns `true` if the proof is valid, `false` otherwise.
 */
export async function verifyCommodityOrigin(proof: CommodityOriginProof): Promise<boolean> {
  const native = await loadNativeZkp();
  const publicInputsJson = proof.publicInputs[0] ?? '[]';
  return native.groth16VerifyProof(
    'commodity_origin',
    proof.proof,
    proof.verificationKeyId,
    publicInputsJson
  );
}
