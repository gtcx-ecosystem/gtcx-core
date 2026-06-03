import type { ZKProof } from './zkp';

/** Registry profile IDs over the commodity-origin R1CS. */
export type CommodityOriginProfileId = 'gh-gold-origin' | 'gh-cocoa-origin' | 'zw-diamond-origin';

export interface CommodityOriginProfileProofInput {
  profileId: CommodityOriginProfileId;
  mineId: string;
  lat: number;
  lon: number;
  primaryMetric: number;
  secondaryMetric: number;
  primaryRandomness: string;
  secondaryRandomness: string;
  locationRandomness: string;
  certificationFlags: number;
  merklePath: string;
  provingKey: string;
  verifyingKey: string;
}

export interface CommodityOriginProfileProof extends ZKProof {
  system: 'groth16';
  proofType: 'commodity_origin';
  profileId: CommodityOriginProfileId;
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

interface NativeZkpProfileModule {
  groth16GenerateKeys: (circuitType: string) => { provingKey: string; verifyingKey: string };
  groth16ProveCommodityOriginProfile: (
    profileId: string,
    mineIdHex: string,
    lat: number,
    lon: number,
    primaryMetric: number,
    secondaryMetric: number,
    primaryRandomnessHex: string,
    secondaryRandomnessHex: string,
    locationRandomnessHex: string,
    certificationFlags: number,
    merklePathHex: string,
    provingKeyHex: string,
    verifyingKeyHex: string
  ) => { proof: string; verifyingKey: string; publicInputsJson: string; profileId?: string };
  groth16VerifyProof: (
    circuitType: string,
    proofHex: string,
    verifyingKeyHex: string,
    publicInputsJson: string
  ) => boolean;
}

async function loadNativeZkp(): Promise<NativeZkpProfileModule> {
  let mod: Record<string, unknown>;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    mod = require('@gtcx/crypto-native') as Record<string, unknown>;
  } catch {
    throw new Error(
      'Native ZKP bindings are required for profile commodity origin proofs but @gtcx/crypto-native is not installed or the binary is not compiled. ' +
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
    groth16ProveCommodityOriginProfile: pick(
      ['groth16ProveCommodityOriginProfile', 'groth16_prove_commodity_origin_profile'],
      'groth16ProveCommodityOriginProfile'
    ),
    groth16VerifyProof: pick(['groth16VerifyProof', 'groth16_verify_proof'], 'groth16VerifyProof'),
  };
}

/**
 * Generate Groth16 keys for a profile (always underlying `commodity_origin` R1CS).
 */
export async function generateCommodityOriginProfileKeys(): Promise<{
  provingKey: string;
  verifyingKey: string;
}> {
  const native = await loadNativeZkp();
  const keys = native.groth16GenerateKeys('commodity_origin');
  return { provingKey: keys.provingKey, verifyingKey: keys.verifyingKey };
}

/**
 * Prove commodity origin with a registry profile policy pack (pre-prove validation in native).
 */
export async function proveCommodityOriginProfile(
  input: CommodityOriginProfileProofInput
): Promise<CommodityOriginProfileProof> {
  assertHex64(input.mineId, 'mineId');
  assertHex64(input.primaryRandomness, 'primaryRandomness');
  assertHex64(input.secondaryRandomness, 'secondaryRandomness');
  assertHex64(input.locationRandomness, 'locationRandomness');
  assertHexEven(input.merklePath, 'merklePath');
  assertHexEven(input.provingKey, 'provingKey');
  assertHexEven(input.verifyingKey, 'verifyingKey');

  const native = await loadNativeZkp();
  const bundle = native.groth16ProveCommodityOriginProfile(
    input.profileId,
    input.mineId,
    input.lat,
    input.lon,
    input.primaryMetric,
    input.secondaryMetric,
    input.primaryRandomness,
    input.secondaryRandomness,
    input.locationRandomness,
    input.certificationFlags,
    input.merklePath,
    input.provingKey,
    input.verifyingKey
  );

  return {
    system: 'groth16',
    proofType: 'commodity_origin',
    profileId: input.profileId,
    publicInputs: [bundle.publicInputsJson],
    proof: bundle.proof,
    verificationKeyId: bundle.verifyingKey,
    created: new Date().toISOString(),
  };
}

/**
 * Verify a profile-bound commodity origin proof (same verifier as generic commodity origin).
 */
export async function verifyCommodityOriginProfile(
  proof: CommodityOriginProfileProof
): Promise<boolean> {
  const native = await loadNativeZkp();
  const publicInputsJson = proof.publicInputs[0] ?? '[]';
  return native.groth16VerifyProof(
    'commodity_origin',
    proof.proof,
    proof.verificationKeyId,
    publicInputsJson
  );
}
