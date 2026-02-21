import { describe, it, expect } from 'vitest';

import { HashCommitmentZkpEngine, ZKProofSchema } from '../src/zkp';

describe('HashCommitmentZkpEngine', () => {
  it('generates a valid proof payload', async () => {
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'bulletproofs',
      proofType: 'gci_threshold',
      publicInputs: ['threshold:50'],
      witness: 'score:75',
      verificationKeyId: 'bulletproofs-gci-v1',
    });

    expect(ZKProofSchema.safeParse(proof).success).toBe(true);
    expect(proof.publicInputs.length).toBeGreaterThan(1);
    await expect(engine.verify(proof)).resolves.toBe(true);
  });

  it('rejects malformed proof payloads', async () => {
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'schnorr',
      proofType: 'identity_proof',
      publicInputs: ['subject:abc'],
      witness: 'secret',
      verificationKeyId: 'schnorr-id-v1',
    });

    const badProof = { ...proof, proof: 'not-base64' };
    await expect(engine.verify(badProof)).resolves.toBe(false);
  });
});
