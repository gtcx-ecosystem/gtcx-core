import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

export interface NativeKeyPair {
  privateKey: string;
  publicKey: string;
}

export interface NativeCryptoBindings {
  generateKeyPair: () => NativeKeyPair;
  sign: (message: Uint8Array, privateKeyHex: string) => string;
  verify: (signatureHex: string, message: Uint8Array, publicKeyHex: string) => boolean;
  sha256: (data: Uint8Array) => string;
  sha512: (data: Uint8Array) => string;
  blake3Hash?: ((data: Uint8Array) => string) | undefined;
  deriveChildKey?: ((parentKeyHex: string, index: number) => string) | undefined;
  derivePurposeKey?: ((masterKeyHex: string, purpose: string) => string) | undefined;
  version?: (() => string) | undefined;
}

type RawBindings = Record<string, unknown>;

const requireFn =
  typeof require === 'function' ? require : createRequire(path.join(process.cwd(), 'package.json'));

function normalizeKeyPair(value: unknown): NativeKeyPair {
  if (!value || typeof value !== 'object') {
    throw new Error('Native generateKeyPair returned invalid value');
  }
  const record = value as Record<string, unknown>;
  const privateKey = record['privateKey'] ?? record['private_key'];
  const publicKey = record['publicKey'] ?? record['public_key'];
  if (typeof privateKey !== 'string' || typeof publicKey !== 'string') {
    throw new Error('Native generateKeyPair returned invalid key data');
  }
  return { privateKey, publicKey };
}

function pickFn<T extends (...args: never[]) => unknown>(
  raw: RawBindings,
  keys: string[],
  label: string
): T {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'function') {
      return value as T;
    }
  }
  throw new Error(`Native bindings missing function: ${label}`);
}

function resolveCandidates(): string[] {
  const envOverride = process.env['GTCX_CRYPTO_NATIVE_PATH'];
  const candidates = [] as string[];
  if (envOverride) {
    candidates.push(envOverride);
  }
  candidates.push(path.join(__dirname, 'native', 'gtcx_node.node'));
  candidates.push(path.join(__dirname, '..', 'native', 'gtcx_node.node'));
  candidates.push(
    path.join(process.cwd(), 'packages', 'crypto-native', 'native', 'gtcx_node.node')
  );
  candidates.push(path.join(process.cwd(), 'rust', 'target', 'release', 'gtcx_node.node'));
  candidates.push(path.join(process.cwd(), 'rust', 'target', 'debug', 'gtcx_node.node'));
  return candidates;
}

function loadRawBindings(): RawBindings {
  const errors: string[] = [];
  for (const candidate of resolveCandidates()) {
    if (!existsSync(candidate)) {
      continue;
    }
    try {
      return requireFn(candidate) as RawBindings;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push(`${candidate}: ${message}`);
    }
  }
  const errorSuffix = errors.length > 0 ? `\nErrors:\n- ${errors.join('\n- ')}` : '';
  throw new Error(
    `Native bindings not found. Expected gtcx_node.node in known locations.${errorSuffix}`
  );
}

const raw = loadRawBindings();

const rawGenerate = pickFn<() => unknown>(
  raw,
  ['generateKeyPair', 'generate_key_pair'],
  'generateKeyPair'
);
const rawSign = pickFn<(message: Uint8Array, privateKeyHex: string) => string>(
  raw,
  ['sign', 'sign_ed25519'],
  'sign'
);
const rawVerify = pickFn<
  (signatureHex: string, message: Uint8Array, publicKeyHex: string) => boolean
>(raw, ['verify', 'verify_ed25519'], 'verify');
const rawSha256 = pickFn<(data: Uint8Array) => string>(raw, ['sha256'], 'sha256');
const rawSha512 = pickFn<(data: Uint8Array) => string>(raw, ['sha512'], 'sha512');

export const generateKeyPair = (): NativeKeyPair => normalizeKeyPair(rawGenerate());
export const sign = (message: Uint8Array, privateKeyHex: string): string =>
  rawSign(message, privateKeyHex);
export const verify = (signatureHex: string, message: Uint8Array, publicKeyHex: string): boolean =>
  rawVerify(signatureHex, message, publicKeyHex);
export const sha256 = (data: Uint8Array): string => rawSha256(data);
export const sha512 = (data: Uint8Array): string => rawSha512(data);

export const blake3Hash =
  typeof raw['blake3_hash'] === 'function'
    ? (data: Uint8Array) => (raw['blake3_hash'] as (bytes: Uint8Array) => string)(data)
    : typeof raw['blake3Hash'] === 'function'
      ? (data: Uint8Array) => (raw['blake3Hash'] as (bytes: Uint8Array) => string)(data)
      : undefined;

export const deriveChildKey =
  typeof raw['derive_child_key'] === 'function'
    ? (parentKeyHex: string, index: number) =>
        (raw['derive_child_key'] as (key: string, idx: number) => string)(parentKeyHex, index)
    : typeof raw['deriveChildKey'] === 'function'
      ? (parentKeyHex: string, index: number) =>
          (raw['deriveChildKey'] as (key: string, idx: number) => string)(parentKeyHex, index)
      : undefined;

export const derivePurposeKey =
  typeof raw['derive_purpose_key'] === 'function'
    ? (masterKeyHex: string, purpose: string) =>
        (raw['derive_purpose_key'] as (key: string, label: string) => string)(masterKeyHex, purpose)
    : typeof raw['derivePurposeKey'] === 'function'
      ? (masterKeyHex: string, purpose: string) =>
          (raw['derivePurposeKey'] as (key: string, label: string) => string)(masterKeyHex, purpose)
      : undefined;

export const version =
  typeof raw['version'] === 'function' ? () => (raw['version'] as () => string)() : undefined;

// =============================================================================
// ZKP BINDINGS (Groth16, Bulletproofs, Schnorr)
// =============================================================================

export interface NativeGroth16Keys {
  circuit: string;
  provingKey: string;
  verifyingKey: string;
}

export interface NativeGroth16ProofBundle {
  circuit: string;
  proof: string;
  verifyingKey: string;
  publicInputsJson: string;
}

export interface NativeBulletproofsBundle {
  min: number;
  max: number;
  commitment: string;
  proofLow: string;
  proofHigh: string;
}

export interface NativeSchnorrBundle {
  attributeHash: string;
  subjectHash: string;
  nonceCommitment: string;
  response: string;
}

function optionalNativeFn<T extends (...args: never[]) => unknown>(keys: string[]): T | undefined {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'function') {
      return value as T;
    }
  }
  return undefined;
}

export const groth16GenerateKeys = optionalNativeFn<(circuitType: string) => NativeGroth16Keys>([
  'groth16_generate_keys',
  'groth16GenerateKeys',
]);

export const groth16ProveGciThreshold = optionalNativeFn<
  (
    score: number,
    threshold: number,
    provingKeyHex: string,
    verifyingKeyHex: string
  ) => NativeGroth16ProofBundle
>(['groth16_prove_gci_threshold', 'groth16ProveGciThreshold']);

export const groth16VerifyProof = optionalNativeFn<
  (
    circuitType: string,
    proofHex: string,
    verifyingKeyHex: string,
    publicInputsJson: string
  ) => boolean
>(['groth16_verify_proof', 'groth16VerifyProof']);

export const bulletproofsProveAmountRange = optionalNativeFn<
  (amount: number, min: number, max: number, randomnessHex: string) => NativeBulletproofsBundle
>(['bulletproofs_prove_amount_range', 'bulletproofsProveAmountRange']);

export const bulletproofsVerifyAmountRange = optionalNativeFn<
  (
    min: number,
    max: number,
    commitmentHex: string,
    proofLowHex: string,
    proofHighHex: string
  ) => boolean
>(['bulletproofs_verify_amount_range', 'bulletproofsVerifyAmountRange']);

export const schnorrProveIdentityAttribute = optionalNativeFn<
  (attribute: Uint8Array, subjectHashHex: string) => NativeSchnorrBundle
>(['schnorr_prove_identity_attribute', 'schnorrProveIdentityAttribute']);

export const schnorrVerifyIdentityAttribute = optionalNativeFn<
  (
    attributeHashHex: string,
    subjectHashHex: string,
    nonceCommitmentHex: string,
    responseHex: string
  ) => boolean
>(['schnorr_verify_identity_attribute', 'schnorrVerifyIdentityAttribute']);

export const nativeBindings: NativeCryptoBindings = {
  generateKeyPair,
  sign,
  verify,
  sha256,
  sha512,
  blake3Hash,
  deriveChildKey,
  derivePurposeKey,
  version,
};
