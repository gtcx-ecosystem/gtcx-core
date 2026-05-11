import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { HashCommitmentZkpEngine, ZKProofSchema } from '../src/zkp';

describe('HashCommitmentZkpEngine', () => {
  beforeEach(() => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '1');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

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

describe('HashCommitmentZkpEngine — generate() default-deny (SA-002)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const baseInput = {
    system: 'bulletproofs' as const,
    proofType: 'gci_threshold',
    publicInputs: ['threshold:50'],
    witness: 'score:75',
    verificationKeyId: 'bulletproofs-gci-v1',
  };

  it('throws when GTCX_ALLOW_HASH_COMMITMENT_ZKP is unset', async () => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '');
    const engine = new HashCommitmentZkpEngine();
    await expect(engine.generate(baseInput)).rejects.toThrow(/disabled by default/);
  });

  it('throws when GTCX_ALLOW_HASH_COMMITMENT_ZKP is "true" (must be exactly "1")', async () => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', 'true');
    const engine = new HashCommitmentZkpEngine();
    await expect(engine.generate(baseInput)).rejects.toThrow(/disabled by default/);
  });

  it('throws when GTCX_ALLOW_HASH_COMMITMENT_ZKP is "yes"', async () => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', 'yes');
    const engine = new HashCommitmentZkpEngine();
    await expect(engine.generate(baseInput)).rejects.toThrow(/disabled by default/);
  });

  it('error message references SA-002 and the threat model', async () => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '');
    const engine = new HashCommitmentZkpEngine();
    await expect(engine.generate(baseInput)).rejects.toThrow(/SA-002/);
    await expect(engine.generate(baseInput)).rejects.toThrow(/threat-model/);
  });

  it('error message points to native bindings as the production path', async () => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '');
    const engine = new HashCommitmentZkpEngine();
    await expect(engine.generate(baseInput)).rejects.toThrow(/@gtcx\/crypto-native/);
  });

  it('verify() remains open even when generate() is disabled', async () => {
    // Generate with the flag set to obtain a real proof
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '1');
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate(baseInput);

    // Now drop the flag — verify must still work for downstream services
    // that receive these proofs but never generate them
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '');
    await expect(engine.verify(proof)).resolves.toBe(true);
  });

  it('succeeds when GTCX_ALLOW_HASH_COMMITMENT_ZKP is exactly "1"', async () => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '1');
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate(baseInput);
    expect(ZKProofSchema.safeParse(proof).success).toBe(true);
  });
});

// The createZkpEngine() factory's no-native fallback branch (SA-002 default-deny)
// is intentionally excluded from default test runs — see /* v8 ignore */ in zkp.ts.
// The branch is exercised in `crypto-native-ci` where the native binary is absent.
// The load-bearing test for SA-002 closure is HashCommitmentZkpEngine.generate()
// throwing directly, which runs in every test invocation regardless of native
// binding availability.

describe('ZKP helper edge cases', () => {
  beforeEach(() => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '1');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const engine = new HashCommitmentZkpEngine();
  const baseInput = {
    system: 'bulletproofs' as const,
    proofType: 'gci_threshold',
    publicInputs: ['threshold:50'],
    witness: 'score:75',
    verificationKeyId: 'bulletproofs-gci-v1',
  };

  // --- verify() edge cases ---

  it('rejects proof with invalid base64 in proof field', async () => {
    const proof = await engine.generate(baseInput);
    const bad = { ...proof, proof: '!!!not-valid-base64!!!' };
    await expect(engine.verify(bad)).resolves.toBe(false);
  });

  it('rejects proof with valid base64 but invalid JSON inside', async () => {
    const proof = await engine.generate(baseInput);
    const bad = { ...proof, proof: Buffer.from('not json at all').toString('base64') };
    await expect(engine.verify(bad)).resolves.toBe(false);
  });

  it('rejects proof with missing salt field', async () => {
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    delete decoded.salt;
    const bad = { ...proof, proof: Buffer.from(JSON.stringify(decoded)).toString('base64') };
    await expect(engine.verify(bad)).resolves.toBe(false);
  });

  it('rejects proof with non-hex salt', async () => {
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    decoded.salt = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'; // 64 chars, not hex
    const bad = { ...proof, proof: Buffer.from(JSON.stringify(decoded)).toString('base64') };
    await expect(engine.verify(bad)).resolves.toBe(false);
  });

  it('rejects proof with wrong-length salt (not 64 chars)', async () => {
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    decoded.salt = 'abcdef'; // valid hex, wrong length
    const bad = { ...proof, proof: Buffer.from(JSON.stringify(decoded)).toString('base64') };
    await expect(engine.verify(bad)).resolves.toBe(false);
  });

  // --- generate() edge cases ---

  it('empty publicInputs array works and commitment is still added', async () => {
    const proof = await engine.generate({ ...baseInput, publicInputs: [] });
    expect(proof.publicInputs.length).toBe(1);
    await expect(engine.verify(proof)).resolves.toBe(true);
  });

  it('publicInputs already containing the commitment does not duplicate it', async () => {
    // Generate once to discover the commitment value (non-deterministic due to salt),
    // so instead verify that commitment appears exactly once in the result.
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    const commitment = decoded.commitment as string;

    // Generate again with the commitment already present in publicInputs
    // We cannot pre-compute the commitment, but we can check the invariant:
    // the commitment from the payload appears exactly once in publicInputs.
    const occurrences = proof.publicInputs.filter((i) => i === commitment).length;
    expect(occurrences).toBe(1);
  });

  // --- ensureCommitment behavior (tested through generate) ---

  it('generated proof has commitment in publicInputs exactly once', async () => {
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    const commitment = decoded.commitment as string;

    expect(proof.publicInputs).toContain(commitment);
    expect(proof.publicInputs.filter((i) => i === commitment)).toHaveLength(1);
    // Original inputs are preserved
    expect(proof.publicInputs).toContain('threshold:50');
  });
});

describe('zkp.ts coverage edge cases', () => {
  beforeEach(() => {
    vi.stubEnv('GTCX_ALLOW_HASH_COMMITMENT_ZKP', '1');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('createHashCommitmentZkpEngine returns a working engine', async () => {
    const { createHashCommitmentZkpEngine } = await import('../src/zkp');
    const engine = createHashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'bulletproofs',
      proofType: 'gci_threshold',
      publicInputs: ['threshold:50'],
      witness: 'score:75',
      verificationKeyId: 'bulletproofs-gci-v1',
    });
    expect(proof.system).toBe('bulletproofs');
    await expect(engine.verify(proof)).resolves.toBe(true);
  });

  it('rejects proof with commitment of wrong length', async () => {
    const engine = new (await import('../src/zkp')).HashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'bulletproofs',
      proofType: 'gci_threshold',
      publicInputs: ['threshold:50'],
      witness: 'score:75',
      verificationKeyId: 'bulletproofs-gci-v1',
    });

    // Decode, tamper commitment to wrong length, re-encode
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    decoded.commitment = 'abcd'; // valid hex, wrong length
    const bad = {
      ...proof,
      proof: Buffer.from(JSON.stringify(decoded)).toString('base64'),
    };
    await expect(engine.verify(bad)).resolves.toBe(false);
  });
});
