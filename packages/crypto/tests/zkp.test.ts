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

  it('rejects proof when publicInputs are tampered', async () => {
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'bulletproofs',
      proofType: 'gci_threshold',
      publicInputs: ['threshold:50'],
      witness: 'score:75',
      verificationKeyId: 'bulletproofs-gci-v1',
    });

    // Valid proof passes
    await expect(engine.verify(proof)).resolves.toBe(true);

    // Tamper with publicInputs — remove the commitment
    const tampered = { ...proof, publicInputs: ['threshold:50'] };
    await expect(engine.verify(tampered)).resolves.toBe(false);
  });

  it('rejects proof when proof payload is tampered', async () => {
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'groth16',
      proofType: 'asset_ownership',
      publicInputs: ['asset:lot-1'],
      witness: 'owner:did:gtcx:abc',
      verificationKeyId: 'groth16-asset-v1',
    });

    await expect(engine.verify(proof)).resolves.toBe(true);

    // Tamper with proof field — replace with a different valid-looking payload
    const fakePayload = Buffer.from(
      JSON.stringify({ salt: 'a'.repeat(64), response: 'b'.repeat(64), commitment: 'c'.repeat(64) })
    ).toString('base64');
    const tampered = { ...proof, proof: fakePayload };
    await expect(engine.verify(tampered)).resolves.toBe(false);
  });

  it('rejects proof when salt is tampered but commitment preserved', async () => {
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'bulletproofs',
      proofType: 'gci_threshold',
      publicInputs: ['threshold:50'],
      witness: 'score:75',
      verificationKeyId: 'bulletproofs-gci-v1',
    });

    await expect(engine.verify(proof)).resolves.toBe(true);

    // Decode the real payload, tamper with only the salt, re-encode
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    decoded.salt = 'f'.repeat(64); // different salt, same commitment
    const tampered = {
      ...proof,
      proof: Buffer.from(JSON.stringify(decoded)).toString('base64'),
    };
    await expect(engine.verify(tampered)).resolves.toBe(false);
  });

  it('rejects proof when response is tampered but commitment preserved', async () => {
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'schnorr',
      proofType: 'identity_proof',
      publicInputs: ['subject:abc'],
      witness: 'secret',
      verificationKeyId: 'schnorr-id-v1',
    });

    await expect(engine.verify(proof)).resolves.toBe(true);

    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    decoded.response = 'e'.repeat(64);
    const tampered = {
      ...proof,
      proof: Buffer.from(JSON.stringify(decoded)).toString('base64'),
    };
    await expect(engine.verify(tampered)).resolves.toBe(false);
  });

  it('different witnesses produce different proofs', async () => {
    const engine = new HashCommitmentZkpEngine();
    const base = {
      system: 'bulletproofs' as const,
      proofType: 'gci_threshold',
      publicInputs: ['threshold:50'],
      verificationKeyId: 'bulletproofs-gci-v1',
    };

    const proof1 = await engine.generate({ ...base, witness: 'score:75' });
    const proof2 = await engine.generate({ ...base, witness: 'score:30' });

    expect(proof1.proof).not.toBe(proof2.proof);
    expect(proof1.publicInputs).not.toEqual(proof2.publicInputs);
  });
});
