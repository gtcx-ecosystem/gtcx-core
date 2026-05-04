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
  const bytes = typeof value === 'string' ? textEncoder.encode(value) : value;
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array => {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(value, 'base64'));
  }
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
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

const ensureCommitment = (publicInputs: string[], commitment: string): string[] => {
  if (publicInputs.includes(commitment)) return publicInputs;
  return [...publicInputs, commitment];
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
 * For real ZK verification, use the Rust NAPI bindings via
 * `@gtcx/crypto-native` which delegates to `gtcx-zkp`.
 *
 * @see rust/gtcx-zkp for production ZK implementation
 */
export class HashCommitmentZkpEngine implements ZkProver, ZkVerifier {
  /** Hash-commitment engine does not produce verification keys. Use Rust NAPI bindings for full ZKP. */
  readonly supportsVerificationKeys = false;
  async generate(input: ZkProofInput): Promise<ZKProof> {
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
   * @simplified Hash-commitment verification only. Real ZKP verification
   * requires Rust arkworks circuits via NAPI bindings (not yet wired).
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
 * returns an engine backed by real arkworks circuits via NAPI. Otherwise returns
 * the hash-commitment fallback.
 *
 * Set `GTCX_REQUIRE_NATIVE=true` in production to throw if native bindings
 * are unavailable instead of falling back to the placeholder engine.
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private native: Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(nativeModule: Record<string, any>) {
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
      const generateKeys = this.pickFn(['groth16_generate_keys', 'groth16GenerateKeys']);
      const proveGci = this.pickFn(['groth16_prove_gci_threshold', 'groth16ProveGciThreshold']);

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
        'bulletproofs_prove_amount_range',
        'bulletproofsProveAmountRange',
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
        'schnorr_prove_identity_attribute',
        'schnorrProveIdentityAttribute',
      ]);
      const subjectHash = input.publicInputs[0] ?? generateSalt(32);
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
      const verifyFn = this.pickFn(['groth16_verify_proof', 'groth16VerifyProof']);
      const publicInputsJson = proof.publicInputs[0] ?? '[]';
      return verifyFn(
        'gci_threshold',
        proof.proof,
        proof.verificationKeyId,
        publicInputsJson
      ) as boolean;
    }

    if (proof.system === 'bulletproofs') {
      const verifyFn = this.pickFn([
        'bulletproofs_verify_amount_range',
        'bulletproofsVerifyAmountRange',
      ]);
      const min = parseInt(proof.publicInputs[0] ?? '0', 10);
      const max = parseInt(proof.publicInputs[1] ?? '0', 10);
      const commitment = proof.publicInputs[2] ?? '';
      const proofData = JSON.parse(proof.proof) as { proofLow: string; proofHigh: string };
      return verifyFn(min, max, commitment, proofData.proofLow, proofData.proofHigh) as boolean;
    }

    if (proof.system === 'schnorr') {
      const verifyFn = this.pickFn([
        'schnorr_verify_identity_attribute',
        'schnorrVerifyIdentityAttribute',
      ]);
      const attributeHash = proof.publicInputs[0] ?? '';
      const subjectHash = proof.publicInputs[1] ?? '';
      const proofData = JSON.parse(proof.proof) as { nonceCommitment: string; response: string };
      return verifyFn(
        attributeHash,
        subjectHash,
        proofData.nonceCommitment,
        proofData.response
      ) as boolean;
    }

    return false;
  }
}
/* v8 ignore stop */
