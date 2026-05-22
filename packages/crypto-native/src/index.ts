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
type NativeByteArray = number[];

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

function toNativeBytes(value: Uint8Array): NativeByteArray {
  return Array.from(value);
}

/**
 * Validates that a value is a non-empty even-length hex string at the NAPI
 * boundary. Throws TypeError with a descriptive message when invalid so
 * callers receive a typed error instead of a Rust panic, NAPI conversion
 * failure, or silent corruption downstream.
 *
 * Used by computing/mutating functions (sign, derive*, *Prove*) where
 * invalid input has no sensible return value. Predicate verifiers
 * (verify, *VerifyProof, *VerifyAmountRange, *VerifyIdentityAttribute)
 * use {@link isHex} instead and return `false` for malformed input,
 * preserving verifier-as-predicate semantics.
 *
 * Exported so consumers can pre-validate inputs before invoking the
 * cryptographic surface (e.g., when parsing untrusted input).
 */
export function assertHex(value: unknown, label: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(`${label}: expected hex string, got ${typeof value}`);
  }
  if (value.length === 0) {
    throw new TypeError(`${label}: hex string must not be empty`);
  }
  if (value.length % 2 !== 0) {
    throw new TypeError(`${label}: hex string must have even length (got ${value.length})`);
  }
  if (!/^[0-9a-fA-F]+$/.test(value)) {
    throw new TypeError(`${label}: hex string must contain only [0-9a-fA-F]`);
  }
}

/**
 * Non-throwing variant of {@link assertHex}. Returns `true` if the value is a
 * valid non-empty even-length hex string, `false` otherwise. Used by predicate
 * verifiers so a malformed signature, proof, or commitment returns `false`
 * rather than throwing — matching the verifier-as-predicate convention.
 */
export function isHex(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length % 2 === 0 &&
    /^[0-9a-fA-F]+$/.test(value)
  );
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
const rawSign = pickFn<(message: NativeByteArray, privateKeyHex: string) => string>(
  raw,
  ['sign', 'sign_ed25519'],
  'sign'
);
const rawVerify = pickFn<
  (signatureHex: string, message: NativeByteArray, publicKeyHex: string) => boolean
>(raw, ['verify', 'verify_ed25519'], 'verify');
const rawSha256 = pickFn<(data: NativeByteArray) => string>(raw, ['sha256'], 'sha256');
const rawSha512 = pickFn<(data: NativeByteArray) => string>(raw, ['sha512'], 'sha512');

export const generateKeyPair = (): NativeKeyPair => normalizeKeyPair(rawGenerate());
export const sign = (message: Uint8Array, privateKeyHex: string): string => {
  assertHex(privateKeyHex, 'privateKey');
  return rawSign(toNativeBytes(message), privateKeyHex);
};
export const verify = (
  signatureHex: string,
  message: Uint8Array,
  publicKeyHex: string
): boolean => {
  if (!isHex(signatureHex) || !isHex(publicKeyHex)) {
    return false;
  }
  return rawVerify(signatureHex, toNativeBytes(message), publicKeyHex);
};
export const sha256 = (data: Uint8Array): string => rawSha256(toNativeBytes(data));
export const sha512 = (data: Uint8Array): string => rawSha512(toNativeBytes(data));

export const blake3Hash =
  typeof raw['blake3_hash'] === 'function'
    ? (data: Uint8Array) =>
        (raw['blake3_hash'] as (bytes: NativeByteArray) => string)(toNativeBytes(data))
    : typeof raw['blake3Hash'] === 'function'
      ? (data: Uint8Array) =>
          (raw['blake3Hash'] as (bytes: NativeByteArray) => string)(toNativeBytes(data))
      : undefined;

const rawDeriveChildKey =
  typeof raw['derive_child_key'] === 'function'
    ? (raw['derive_child_key'] as (key: string, idx: number) => string)
    : typeof raw['deriveChildKey'] === 'function'
      ? (raw['deriveChildKey'] as (key: string, idx: number) => string)
      : undefined;

export const deriveChildKey = rawDeriveChildKey
  ? (parentKeyHex: string, index: number): string => {
      assertHex(parentKeyHex, 'parentKey');
      return rawDeriveChildKey(parentKeyHex, index);
    }
  : undefined;

const rawDerivePurposeKey =
  typeof raw['derive_purpose_key'] === 'function'
    ? (raw['derive_purpose_key'] as (key: string, label: string) => string)
    : typeof raw['derivePurposeKey'] === 'function'
      ? (raw['derivePurposeKey'] as (key: string, label: string) => string)
      : undefined;

export const derivePurposeKey = rawDerivePurposeKey
  ? (masterKeyHex: string, purpose: string): string => {
      assertHex(masterKeyHex, 'masterKey');
      return rawDerivePurposeKey(masterKeyHex, purpose);
    }
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

const rawGroth16ProveGciThreshold = optionalNativeFn<
  (
    score: number,
    threshold: number,
    provingKeyHex: string,
    verifyingKeyHex: string
  ) => NativeGroth16ProofBundle
>(['groth16_prove_gci_threshold', 'groth16ProveGciThreshold']);

export const groth16ProveGciThreshold = rawGroth16ProveGciThreshold
  ? (
      score: number,
      threshold: number,
      provingKeyHex: string,
      verifyingKeyHex: string
    ): NativeGroth16ProofBundle => {
      assertHex(provingKeyHex, 'provingKey');
      assertHex(verifyingKeyHex, 'verifyingKey');
      return rawGroth16ProveGciThreshold(score, threshold, provingKeyHex, verifyingKeyHex);
    }
  : undefined;

const rawGroth16VerifyProof = optionalNativeFn<
  (
    circuitType: string,
    proofHex: string,
    verifyingKeyHex: string,
    publicInputsJson: string
  ) => boolean
>(['groth16_verify_proof', 'groth16VerifyProof']);

export const groth16VerifyProof = rawGroth16VerifyProof
  ? (
      circuitType: string,
      proofHex: string,
      verifyingKeyHex: string,
      publicInputsJson: string
    ): boolean => {
      if (!isHex(proofHex) || !isHex(verifyingKeyHex)) {
        return false;
      }
      return rawGroth16VerifyProof(circuitType, proofHex, verifyingKeyHex, publicInputsJson);
    }
  : undefined;

const rawBulletproofsProveAmountRange = optionalNativeFn<
  (amount: number, min: number, max: number, randomnessHex: string) => NativeBulletproofsBundle
>(['bulletproofs_prove_amount_range', 'bulletproofsProveAmountRange']);

export const bulletproofsProveAmountRange = rawBulletproofsProveAmountRange
  ? (amount: number, min: number, max: number, randomnessHex: string): NativeBulletproofsBundle => {
      assertHex(randomnessHex, 'randomness');
      return rawBulletproofsProveAmountRange(amount, min, max, randomnessHex);
    }
  : undefined;

const rawBulletproofsVerifyAmountRange = optionalNativeFn<
  (
    min: number,
    max: number,
    commitmentHex: string,
    proofLowHex: string,
    proofHighHex: string
  ) => boolean
>(['bulletproofs_verify_amount_range', 'bulletproofsVerifyAmountRange']);

export const bulletproofsVerifyAmountRange = rawBulletproofsVerifyAmountRange
  ? (
      min: number,
      max: number,
      commitmentHex: string,
      proofLowHex: string,
      proofHighHex: string
    ): boolean => {
      if (!isHex(commitmentHex) || !isHex(proofLowHex) || !isHex(proofHighHex)) {
        return false;
      }
      return rawBulletproofsVerifyAmountRange(min, max, commitmentHex, proofLowHex, proofHighHex);
    }
  : undefined;

const rawSchnorrProveIdentityAttribute = optionalNativeFn<
  (attribute: NativeByteArray, subjectHashHex: string) => NativeSchnorrBundle
>(['schnorr_prove_identity_attribute', 'schnorrProveIdentityAttribute']);

export const schnorrProveIdentityAttribute = rawSchnorrProveIdentityAttribute
  ? (attribute: Uint8Array, subjectHashHex: string): NativeSchnorrBundle => {
      assertHex(subjectHashHex, 'subjectHash');
      return rawSchnorrProveIdentityAttribute(toNativeBytes(attribute), subjectHashHex);
    }
  : undefined;

const rawSchnorrVerifyIdentityAttribute = optionalNativeFn<
  (
    attributeHashHex: string,
    subjectHashHex: string,
    nonceCommitmentHex: string,
    responseHex: string
  ) => boolean
>(['schnorr_verify_identity_attribute', 'schnorrVerifyIdentityAttribute']);

export const schnorrVerifyIdentityAttribute = rawSchnorrVerifyIdentityAttribute
  ? (
      attributeHashHex: string,
      subjectHashHex: string,
      nonceCommitmentHex: string,
      responseHex: string
    ): boolean => {
      if (
        !isHex(attributeHashHex) ||
        !isHex(subjectHashHex) ||
        !isHex(nonceCommitmentHex) ||
        !isHex(responseHex)
      ) {
        return false;
      }
      return rawSchnorrVerifyIdentityAttribute(
        attributeHashHex,
        subjectHashHex,
        nonceCommitmentHex,
        responseHex
      );
    }
  : undefined;

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
