import { bytesToHex } from '@noble/hashes/utils';
import { z } from 'zod';

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
  getVerificationKey(proofType: string): Promise<Uint8Array>;
}

interface ProofPayload {
  salt: string;
  response: string;
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
    const parsed = JSON.parse(json) as ProofPayload;
    if (!parsed?.salt || !parsed?.response) return null;
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
 * Hash-commitment proof engine (placeholder).
 *
 * This is not a real ZK proof system; it provides a compatible API surface
 * while full circuits are implemented in Rust (arkworks).
 */
export class HashCommitmentZkpEngine implements ZkProver, ZkVerifier {
  async generate(input: ZkProofInput): Promise<ZKProof> {
    const witnessBytes = toBytes(input.witness);
    const witnessHex = bytesToHex(witnessBytes);
    const salt = generateSalt(32);
    const response = hash256(`${salt}:${witnessHex}`);
    const commitment = hash256(`${input.proofType}:${salt}:${witnessHex}`);
    const proofPayload: ProofPayload = { salt, response };

    return {
      system: input.system,
      proofType: input.proofType,
      publicInputs: ensureCommitment(input.publicInputs, commitment),
      proof: encodePayload(proofPayload),
      verificationKeyId: input.verificationKeyId,
      created: input.created ?? new Date().toISOString(),
    };
  }

  async verify(proof: ZKProof): Promise<boolean> {
    const parsed = ZKProofSchema.safeParse(proof);
    if (!parsed.success) return false;
    const payload = decodePayload(proof.proof);
    if (!payload) return false;
    if (!isHex(payload.salt) || !isHex(payload.response)) return false;
    if (payload.salt.length !== 64 || payload.response.length !== 64) return false;
    return true;
  }

  async getVerificationKey(_proofType: string): Promise<Uint8Array> {
    return new Uint8Array();
  }
}

export const createHashCommitmentZkpEngine = (): HashCommitmentZkpEngine =>
  new HashCommitmentZkpEngine();
