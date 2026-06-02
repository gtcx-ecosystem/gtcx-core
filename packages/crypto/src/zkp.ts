import { bytesToHex } from '@noble/hashes/utils';
import { z } from 'zod';

import { fipsWarn } from './fips';
import { hash256, generateSalt } from './hashing';

export const ZKProofSystemSchema = z.enum(['schnorr', 'bulletproofs', 'groth16', 'plonk']);

export type ZKProofSystem = z.infer<typeof ZKProofSystemSchema>;

export const ZKProofSchema = z.object({
  system: ZKProofSystemSchema,
  proofType: z.string(),
  publicInputs: z.array(z.string()),
  proof: z.string(),
  verificationKeyId: z.string(),
  created: z.string().datetime(),
});

export type ZKProof = z.infer<typeof ZKProofSchema>;

export interface ZkProofInput {
  system: ZKProofSystem;
  proofType: string;
  publicInputs: string[];
  witness: Uint8Array | string;
  verificationKeyId: string;
  created?: string;
}

export interface ZkProver {
  generate(input: ZkProofInput): Promise<ZKProof>;
}

export interface ZkVerifier {
  verify(proof: ZKProof): Promise<boolean>;
}

export interface ZkFullVerifier extends ZkVerifier {
  getVerificationKey(proofType: string): Promise<Uint8Array>;
}

interface ProofPayload {
  salt: string;
  response: string;
  commitment: string;
  /** HMAC-like binding: hash(salt:response:commitment). Detects field-level tampering. */
  binding: string;
}

const textEncoder = new TextEncoder();

const toBytes = (value: Uint8Array | string): Uint8Array =>
  typeof value === 'string' ? textEncoder.encode(value) : value;

const toBase64 = (value: Uint8Array | string): string => {
  /* v8 ignore next -- unreachable: toBase64 is only called with strings */
  const bytes = typeof value === 'string' ? textEncoder.encode(value) : value;
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  /* v8 ignore start -- pure-JS fallback only runs when Buffer is unavailable (non-Node env) */
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
  /* v8 ignore stop */
};

const fromBase64 = (value: string): Uint8Array => {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(value, 'base64'));
  }
  /* v8 ignore start -- pure-JS fallback only runs when Buffer is unavailable (non-Node env) */
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
  /* v8 ignore stop */
};

const encodePayload = (payload: ProofPayload): string => toBase64(JSON.stringify(payload));

const decodePayload = (value: string): ProofPayload | null => {
  try {
    const json = new TextDecoder().decode(fromBase64(value));
    if (json.length > 100_000) return null; // 100KB max for ZKP payloads
    const parsed = JSON.parse(json) as ProofPayload;
    if (!parsed?.salt || !parsed?.response || !parsed?.commitment || !parsed?.binding) return null;
    return parsed;
  } catch {
    return null;
  }
};

const isHex = (value: string): boolean => /^[0-9a-f]+$/i.test(value);

/**
 * Check whether the placeholder hash-commitment ZKP engine is explicitly
 * permitted to generate proofs. Reads `GTCX_ALLOW_HASH_COMMITMENT_ZKP` on
 * every call so test environments can toggle the flag with `vi.stubEnv`.
 *
 * The flag must be set to the literal string `'1'` to opt in. Any other
 * value — including `'true'`, `'yes'`, or unset — keeps the engine disabled.
 */
const isHashCommitmentZkpAllowed = (): boolean =>
  typeof process !== 'undefined' && process.env?.['GTCX_ALLOW_HASH_COMMITMENT_ZKP'] === '1';

const HASH_COMMITMENT_DISABLED_MESSAGE =
  'HashCommitmentZkpEngine.generate() is disabled by default because it is a placeholder, ' +
  'not a real zero-knowledge proof system. Output from this engine is indistinguishable ' +
  'from random bytes to a verifier and must not be relied on for compliance claims, ' +
  'regulatory submissions, or any context where proof correctness matters.\n\n' +
  'For real ZK proofs: install @gtcx/crypto-native and use createZkpEngine() — it ' +
  'auto-selects the native arkworks backend (Groth16, Bulletproofs, Schnorr).\n\n' +
  'To explicitly opt into the placeholder (testing, non-regulatory contexts), set ' +
  'GTCX_ALLOW_HASH_COMMITMENT_ZKP=1.\n\n' +
  'See docs/security/threat-model.md (SA-002) for the full rationale.';

const ensureCommitment = (publicInputs: string[], commitment: string): string[] => {
  if (publicInputs.includes(commitment)) return publicInputs;
  return [...publicInputs, commitment];
};

/**
 * Normalize an arbitrary string to a 32-byte (64-char) hex string.
 * If the input is already a valid 64-char hex string, return it as-is.
 * Otherwise, hash it with SHA-256 to produce a deterministic 32-byte digest.
 */
/* c8 ignore next 6 -- only called by NativeZkpEngine inside v8 ignore block */
const normalizeToHash256 = (value: string): string => {
  if (value.length === 64 && isHex(value)) {
    return value.toLowerCase();
  }
  return hash256(value);
};

/**
 * Hash-commitment proof engine — **PLACEHOLDER, NOT PRODUCTION ZK**.
 *
 * WARNING: This engine does NOT provide zero-knowledge proofs. It uses
 * hash commitments to provide a compatible API surface while full ZK
 * circuits are implemented in Rust (arkworks/Groth16/Bulletproofs).
 *
 * A verifier using this engine cannot distinguish a valid proof from
 * any 64 random non-zero bytes. Do not rely on this for compliance
 * claims, regulatory submissions, or any context where proof
 * correctness matters.
 *
 * `generate()` throws by default — opt in with `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1`
 * if you understand the placeholder semantics. `verify()` remains open so
 * services receiving such proofs can validate them without holding the flag.
 *
 * For real ZK verification, use the Rust NAPI bindings via
 * `@gtcx/crypto-native` which delegates to `gtcx-zkp`.
 *
 * @see rust/gtcx-zkp for production ZK implementation
 * @see docs/security/threat-model.md SA-002 for the rationale behind the default-deny
 */
export class HashCommitmentZkpEngine implements ZkProver, ZkVerifier {
  /** Hash-commitment engine does not produce verification keys. Use Rust NAPI bindings for full ZKP. */
  readonly supportsVerificationKeys = false;
  async generate(input: ZkProofInput): Promise<ZKProof> {
    if (!isHashCommitmentZkpAllowed()) {
      throw new Error(HASH_COMMITMENT_DISABLED_MESSAGE);
    }
    fipsWarn('ZKP/HashCommitment', 'No FIPS ZKP standard exists — document as supplementary');
    const witnessBytes = toBytes(input.witness);
    const witnessHex = bytesToHex(witnessBytes);
    const salt = generateSalt(32);
    const response = hash256(`${salt}:${witnessHex}`);
    const commitment = hash256(`${input.proofType}:${salt}:${witnessHex}`);
    const binding = hash256(`${salt}:${response}:${commitment}`);
    const proofPayload: ProofPayload = { salt, response, commitment, binding };

    return {
      system: input.system,
      proofType: input.proofType,
      publicInputs: ensureCommitment(input.publicInputs, commitment),
      proof: encodePayload(proofPayload),
      verificationKeyId: input.verificationKeyId,
      created: input.created ?? new Date().toISOString(),
    };
  }

  /**
   * Simplified hash-commitment verification only.
   * Real ZKP verification requires Rust arkworks circuits via NAPI bindings.
   */
  async verify(proof: ZKProof): Promise<boolean> {
    const parsed = ZKProofSchema.safeParse(proof);
    if (!parsed.success) return false;
    const payload = decodePayload(proof.proof);
    if (!payload) return false;

    // Strict integrity check: The proof string must be the canonical encoding of the payload.
    // This prevents malleability attacks on the base64 padding or redundant fields.
    if (encodePayload(payload) !== proof.proof) return false;

    if (!isHex(payload.salt) || !isHex(payload.response)) return false;
    if (payload.salt.length !== 64 || payload.response.length !== 64) return false;

    // Verify the commitment stored in the proof payload appears in publicInputs.
    // The commitment binds the proof to its declared public inputs — tampering
    // with either the proof or publicInputs breaks this link.
    if (!payload.commitment || !isHex(payload.commitment) || payload.commitment.length !== 64) {
      return false;
    }
    if (!proof.publicInputs.includes(payload.commitment)) return false;

    // Recompute binding to detect field-level tampering (salt, response, or commitment).
    const expectedBinding = hash256(`${payload.salt}:${payload.response}:${payload.commitment}`);
    if (payload.binding !== expectedBinding) return false;

    return true;
  }
}

export const createHashCommitmentZkpEngine = (): HashCommitmentZkpEngine =>
  new HashCommitmentZkpEngine();

/* v8 ignore start -- NativeZkpEngine and createZkpEngine require compiled NAPI binary; tested in crypto-native-ci */

/**
 * Create the best available ZKP engine.
 *
 * When `@gtcx/crypto-native` is installed and the Groth16 bindings are available,
 * returns an engine backed by real arkworks circuits via NAPI.
 *
 * If native bindings are unavailable, the factory throws by default. Two opt-in
 * paths exist:
 *
 * - Set `GTCX_ALLOW_HASH_COMMITMENT_ZKP=1` to fall back to the placeholder
 *   hash-commitment engine. Only appropriate for testing or non-regulatory
 *   contexts. The placeholder is NOT a zero-knowledge proof system.
 * - Set `GTCX_REQUIRE_NATIVE=true` to make the factory's "no native" branch
 *   surface a more pointed error message (kept for backwards compatibility;
 *   default behavior already throws).
 */
export function createZkpEngine(): ZkProver & ZkVerifier {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const native = require('@gtcx/crypto-native');
    if (native?.groth16GenerateKeys || native?.groth16_generate_keys) {
      return new NativeZkpEngine(native);
    }
  } catch {
    // Native bindings not available
  }

  if (process.env['GTCX_REQUIRE_NATIVE'] === 'true' || process.env['GTCX_REQUIRE_NATIVE'] === '1') {
    throw new Error(
      'GTCX_REQUIRE_NATIVE is set but native ZKP bindings are unavailable. ' +
        'Install @gtcx/crypto-native and ensure the native binary is compiled.'
    );
  }

  if (!isHashCommitmentZkpAllowed()) {
    throw new Error(
      'createZkpEngine() could not load native ZKP bindings and the placeholder ' +
        'hash-commitment engine is disabled by default.\n\n' +
        'For real ZK proofs: install @gtcx/crypto-native and ensure the native binary is compiled.\n\n' +
        'To explicitly opt into the placeholder (testing, non-regulatory contexts), set ' +
        'GTCX_ALLOW_HASH_COMMITMENT_ZKP=1.\n\n' +
        'See docs/security/threat-model.md (SA-002).'
    );
  }

  return new HashCommitmentZkpEngine();
}

/**
 * ZKP engine backed by real arkworks circuits via NAPI-RS native bindings.
 *
 * Supports Groth16 (GCI threshold, asset ownership, location region),
 * Bulletproofs (amount range), and Schnorr (identity attribute) proofs.
 */
export class NativeZkpEngine implements ZkProver, ZkVerifier {
  readonly supportsVerificationKeys = true;
  private native: Record<string, unknown>;

  constructor(nativeModule: Record<string, unknown>) {
    this.native = nativeModule;
  }

  private pickFn(names: string[]): (...args: unknown[]) => unknown {
    for (const name of names) {
      if (typeof this.native[name] === 'function') {
        return this.native[name] as (...args: unknown[]) => unknown;
      }
    }
    throw new Error(`Native ZKP binding not found: ${names.join(', ')}`);
  }

  async generate(input: ZkProofInput): Promise<ZKProof> {
    const witnessBytes = toBytes(input.witness);

    if (input.system === 'groth16') {
      const generateKeys = this.pickFn(['groth16GenerateKeys', 'groth16_generate_keys']);
      const proveGci = this.pickFn(['groth16ProveGciThreshold', 'groth16_prove_gci_threshold']);

      const keys = generateKeys('gci_threshold') as {
        provingKey: string;
        verifyingKey: string;
        proving_key?: string;
        verifying_key?: string;
      };
      const pk = keys.provingKey ?? keys['proving_key'] ?? '';
      const vk = keys.verifyingKey ?? keys['verifying_key'] ?? '';

      const score = new DataView(witnessBytes.buffer, witnessBytes.byteOffset).getUint32(0, true);
      const threshold =
        input.publicInputs.length > 0 ? parseInt(input.publicInputs[0] ?? '0', 10) : 0;
      const bundle = proveGci(score, threshold, pk, vk) as {
        proof: string;
        verifyingKey: string;
        verifying_key?: string;
        publicInputsJson: string;
        public_inputs_json?: string;
      };

      return {
        system: 'groth16',
        proofType: input.proofType,
        publicInputs: [bundle.publicInputsJson ?? bundle['public_inputs_json'] ?? ''],
        proof: bundle.proof,
        verificationKeyId: input.verificationKeyId,
        created: input.created ?? new Date().toISOString(),
      };
    }

    if (input.system === 'bulletproofs') {
      const prove = this.pickFn([
        'bulletproofsProveAmountRange',
        'bulletproofs_prove_amount_range',
      ]);
      const amount = new DataView(witnessBytes.buffer, witnessBytes.byteOffset).getUint32(0, true);
      const min = input.publicInputs.length > 0 ? parseInt(input.publicInputs[0] ?? '0', 10) : 0;
      const max = input.publicInputs.length > 1 ? parseInt(input.publicInputs[1] ?? '0', 10) : 0;
      const randomness = generateSalt(32);
      const bundle = prove(amount, min, max, randomness) as {
        commitment: string;
        proofLow: string;
        proofHigh: string;
        proof_low?: string;
        proof_high?: string;
      };

      return {
        system: 'bulletproofs',
        proofType: input.proofType,
        publicInputs: [String(min), String(max), bundle.commitment],
        proof: JSON.stringify({
          proofLow: bundle.proofLow ?? bundle['proof_low'],
          proofHigh: bundle.proofHigh ?? bundle['proof_high'],
        }),
        verificationKeyId: input.verificationKeyId,
        created: input.created ?? new Date().toISOString(),
      };
    }

    if (input.system === 'schnorr') {
      const prove = this.pickFn([
        'schnorrProveIdentityAttribute',
        'schnorr_prove_identity_attribute',
      ]);
      const subjectHash = normalizeToHash256(input.publicInputs[0] ?? generateSalt(32));
      const bundle = prove(witnessBytes, subjectHash) as {
        attributeHash: string;
        attribute_hash?: string;
        subjectHash: string;
        subject_hash?: string;
        nonceCommitment: string;
        nonce_commitment?: string;
        response: string;
      };

      return {
        system: 'schnorr',
        proofType: input.proofType,
        publicInputs: [
          bundle.attributeHash ?? bundle['attribute_hash'] ?? '',
          bundle.subjectHash ?? bundle['subject_hash'] ?? '',
        ],
        proof: JSON.stringify({
          nonceCommitment: bundle.nonceCommitment ?? bundle['nonce_commitment'],
          response: bundle.response,
        }),
        verificationKeyId: input.verificationKeyId,
        created: input.created ?? new Date().toISOString(),
      };
    }

    throw new Error(`Unsupported proof system: ${input.system}`);
  }

  async verify(proof: ZKProof): Promise<boolean> {
    const parsed = ZKProofSchema.safeParse(proof);
    if (!parsed.success) return false;

    if (proof.system === 'groth16') {
      const verifyFn = this.pickFn(['groth16VerifyProof', 'groth16_verify_proof']);
      const publicInputsJson = proof.publicInputs[0] ?? '[]';
      const circuitType =
        proof.proofType === 'commodity_origin' ? 'commodity_origin' : 'gci_threshold';
      return verifyFn(
        circuitType,
        proof.proof,
        proof.verificationKeyId,
        publicInputsJson
      ) as boolean;
    }

    if (proof.system === 'bulletproofs') {
      const verifyFn = this.pickFn([
        'bulletproofsVerifyAmountRange',
        'bulletproofs_verify_amount_range',
      ]);
      const min = parseInt(proof.publicInputs[0] ?? '0', 10);
      const max = parseInt(proof.publicInputs[1] ?? '0', 10);
      const commitment = proof.publicInputs[2] ?? '';
      const proofData = JSON.parse(proof.proof) as { proofLow: string; proofHigh: string };
      return verifyFn(min, max, commitment, proofData.proofLow, proofData.proofHigh) as boolean;
    }

    if (proof.system === 'schnorr') {
      const verifyFn = this.pickFn([
        'schnorrVerifyIdentityAttribute',
        'schnorr_verify_identity_attribute',
      ]);
      const attributeHash = normalizeToHash256(proof.publicInputs[0] ?? '');
      const subjectHash = normalizeToHash256(proof.publicInputs[1] ?? '');
      let proofData: { nonceCommitment: string; response: string };
      try {
        proofData = JSON.parse(proof.proof) as { nonceCommitment: string; response: string };
      } catch {
        return false;
      }
      try {
        return verifyFn(
          attributeHash,
          subjectHash,
          proofData.nonceCommitment,
          proofData.response
        ) as boolean;
      } catch {
        return false;
      }
    }

    return false;
  }
}
/* v8 ignore stop */
