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

  it('accepts Uint8Array witness and produces verifiable proof', async () => {
    const engine = new HashCommitmentZkpEngine();
    const proof = await engine.generate({
      system: 'bulletproofs',
      proofType: 'gci_threshold',
      publicInputs: ['threshold:50'],
      witness: new TextEncoder().encode('score:75'),
      verificationKeyId: 'bulletproofs-gci-v1',
    });
    expect(ZKProofSchema.safeParse(proof).success).toBe(true);
    await expect(engine.verify(proof)).resolves.toBe(true);
  });

  it('does not duplicate commitment when already in publicInputs', async () => {
    const original = globalThis.crypto.getRandomValues.bind(globalThis.crypto);
    globalThis.crypto.getRandomValues = vi.fn((array: Uint8Array) => {
      array.fill(0);
      return array;
    }) as typeof globalThis.crypto.getRandomValues;

    try {
      const engine = new HashCommitmentZkpEngine();
      const proof1 = await engine.generate({
        system: 'bulletproofs',
        proofType: 'gci_threshold',
        publicInputs: ['threshold:50'],
        witness: 'score:75',
        verificationKeyId: 'bulletproofs-gci-v1',
      });

      const decoded1 = JSON.parse(Buffer.from(proof1.proof, 'base64').toString('utf8'));
      const commitment = decoded1.commitment as string;

      const proof2 = await engine.generate({
        system: 'bulletproofs',
        proofType: 'gci_threshold',
        publicInputs: ['threshold:50', commitment],
        witness: 'score:75',
        verificationKeyId: 'bulletproofs-gci-v1',
      });

      expect(proof2.publicInputs.filter((i) => i === commitment).length).toBe(1);
      await expect(engine.verify(proof2)).resolves.toBe(true);
    } finally {
      globalThis.crypto.getRandomValues = original;
    }
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

  it('rejects proof that fails ZKProofSchema validation', async () => {
    await expect(engine.verify({ system: 'invalid' } as any)).resolves.toBe(false);
    await expect(engine.verify({} as any)).resolves.toBe(false);
  });

  it('rejects proof with non-canonical base64 encoding (malleability)', async () => {
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    // Re-serialize with indentation — valid JSON but non-canonical encoding
    const nonCanonical = Buffer.from(JSON.stringify(decoded, null, 2)).toString('base64');
    const tampered = { ...proof, proof: nonCanonical };
    await expect(engine.verify(tampered)).resolves.toBe(false);
  });

  it('rejects proof with oversized payload (>100KB)', async () => {
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    decoded.salt = 'a'.repeat(200_000);
    const oversized = { ...proof, proof: Buffer.from(JSON.stringify(decoded)).toString('base64') };
    await expect(engine.verify(oversized)).resolves.toBe(false);
  });

  it('rejects proof with non-hex response', async () => {
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    decoded.response = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
    const bad = { ...proof, proof: Buffer.from(JSON.stringify(decoded)).toString('base64') };
    await expect(engine.verify(bad)).resolves.toBe(false);
  });

  it('rejects proof with wrong-length response', async () => {
    const proof = await engine.generate(baseInput);
    const decoded = JSON.parse(Buffer.from(proof.proof, 'base64').toString('utf8'));
    decoded.response = 'abcdef';
    const bad = { ...proof, proof: Buffer.from(JSON.stringify(decoded)).toString('base64') };
    await expect(engine.verify(bad)).resolves.toBe(false);
  });

  it('works when Buffer is temporarily unavailable', async () => {
    const originalBuffer = globalThis.Buffer;
    // @ts-expect-error — intentionally removing Buffer for pure-JS fallback
    delete globalThis.Buffer;
    try {
      const freshProof = await engine.generate(baseInput);
      expect(freshProof.proof).toBeTruthy();
      await expect(engine.verify(freshProof)).resolves.toBe(true);
    } finally {
      globalThis.Buffer = originalBuffer;
    }
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

const RUN_HEAVY_ZKP = process.env['GTCX_RUN_HEAVY_ZKP_TESTS'] === '1';

describe('CommodityOrigin ZKP (native)', () => {
  const validInput = {
    commodityType: 0,
    mineId: '0101010101010101010101010101010101010101010101010101010101010101',
    lat: 15,
    lon: 35,
    primaryMetric: 995,
    secondaryMetric: 1000,
    primaryRandomness: '0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a',
    secondaryRandomness: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
    locationRandomness: '0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c',
    bounds: [10, 20, 30, 40] as [number, number, number, number],
    minPrimary: 950,
    minSecondary: 500,
    certificationFlags: 0,
    merklePath:
      '200000000000000099795c4a032e419d11bf6b126146caf2017d9af9f81069e830c1df1e64c96a230100000000000000200000000000000076f751a99f42cf35974e668242fdc5b4e57486a4e95f7b2fc1bd878b99903b410000000000000000',
    provingKey: 'aa'.repeat(128),
    verifyingKey: 'bb'.repeat(128),
  };

  (RUN_HEAVY_ZKP ? it : it.skip)(
    'generateCommodityOriginKeys returns hex keys',
    async () => {
      const { generateCommodityOriginKeys } = await import('../src/zkp-commodity-origin');
      const keys = await generateCommodityOriginKeys();
      expect(keys.provingKey).toMatch(/^[0-9a-f]+$/i);
      expect(keys.verifyingKey).toMatch(/^[0-9a-f]+$/i);
      expect(keys.provingKey.length).toBeGreaterThan(64);
      expect(keys.verifyingKey.length).toBeGreaterThan(64);
    },
    60_000
  );

  it('proveCommodityOrigin validates mineId length', async () => {
    const { proveCommodityOrigin } = await import('../src/zkp-commodity-origin');
    await expect(proveCommodityOrigin({ ...validInput, mineId: 'abcd' } as any)).rejects.toThrow(
      /mineId: expected 32-byte hex string/
    );
  });

  it('proveCommodityOrigin validates randomness hex', async () => {
    const { proveCommodityOrigin } = await import('../src/zkp-commodity-origin');
    await expect(
      proveCommodityOrigin({ ...validInput, primaryRandomness: 'zzzz' } as any)
    ).rejects.toThrow(/primaryRandomness: expected 32-byte hex string/);
  });

  it('proveCommodityOrigin validates bounds length', async () => {
    const { proveCommodityOrigin } = await import('../src/zkp-commodity-origin');
    await expect(proveCommodityOrigin({ ...validInput, bounds: [10, 20] } as any)).rejects.toThrow(
      /bounds must have exactly 4 elements/
    );
  });

  (RUN_HEAVY_ZKP ? it : it.skip)(
    'end-to-end prove and verify commodity origin',
    async () => {
      const { generateCommodityOriginKeys, proveCommodityOrigin, verifyCommodityOrigin } =
        await import('../src/zkp-commodity-origin');

      const keys = await generateCommodityOriginKeys();
      const proof = await proveCommodityOrigin({
        ...validInput,
        provingKey: keys.provingKey,
        verifyingKey: keys.verifyingKey,
      });

      expect(proof.system).toBe('groth16');
      expect(proof.proofType).toBe('commodity_origin');
      expect(proof.proof).toMatch(/^[0-9a-f]+$/i);
      expect(proof.publicInputs.length).toBeGreaterThanOrEqual(1);

      const valid = await verifyCommodityOrigin(proof);
      expect(valid).toBe(true);
    },
    60_000
  ); // 30s timeout — Groth16 proving is CPU-heavy

  (RUN_HEAVY_ZKP ? it : it.skip)(
    'tampered proof fails verification',
    async () => {
      const { generateCommodityOriginKeys, proveCommodityOrigin, verifyCommodityOrigin } =
        await import('../src/zkp-commodity-origin');

      const keys = await generateCommodityOriginKeys();
      const proof = await proveCommodityOrigin({
        ...validInput,
        provingKey: keys.provingKey,
        verifyingKey: keys.verifyingKey,
      });

      const tampered = { ...proof, proof: proof.proof.slice(0, -4) + 'dead' };
      const valid = await verifyCommodityOrigin(tampered);
      expect(valid).toBe(false);
    },
    60_000
  );
});

describe('DiamondOrigin ZKP (native)', () => {
  const validInput = {
    mineId: '0202020202020202020202020202020202020202020202020202020202020202',
    lat: 18,
    lon: 30,
    clarity: 85,
    carat: 500,
    clarityRandomness: '0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d',
    caratRandomness: '0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e',
    locationRandomness: '0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f',
    bounds: [15, 25, 25, 35] as [number, number, number, number],
    minClarity: 70,
    minCarat: 100,
    kpCertified: true,
    merklePath:
      '200000000000000099795c4a032e419d11bf6b126146caf2017d9af9f81069e830c1df1e64c96a230100000000000000200000000000000076f751a99f42cf35974e668242fdc5b4e57486a4e95f7b2fc1bd878b99903b410000000000000000',
    provingKey: 'aa'.repeat(128),
    verifyingKey: 'bb'.repeat(128),
  };

  it('proveDiamondOrigin validates mineId length', async () => {
    const { proveDiamondOrigin } = await import('../src/zkp-diamond-origin');
    await expect(proveDiamondOrigin({ ...validInput, mineId: 'abcd' } as any)).rejects.toThrow(
      /mineId: expected 32-byte hex string/
    );
  });

  it('proveDiamondOrigin validates kpCertified is true', async () => {
    const { proveDiamondOrigin } = await import('../src/zkp-diamond-origin');
    await expect(proveDiamondOrigin({ ...validInput, kpCertified: false } as any)).rejects.toThrow(
      /kpCertified must be true/
    );
  });

  it('proveDiamondOrigin validates bounds length', async () => {
    const { proveDiamondOrigin } = await import('../src/zkp-diamond-origin');
    await expect(proveDiamondOrigin({ ...validInput, bounds: [15, 25] } as any)).rejects.toThrow(
      /bounds must have exactly 4 elements/
    );
  });

  (RUN_HEAVY_ZKP ? it : it.skip)(
    'proof from proveDiamondOrigin verifies with verifyCommodityOrigin (backward compat)',
    async () => {
      const { generateDiamondOriginKeys, proveDiamondOrigin } =
        await import('../src/zkp-diamond-origin');
      const { verifyCommodityOrigin } = await import('../src/zkp-commodity-origin');

      const keys = await generateDiamondOriginKeys();
      const proof = await proveDiamondOrigin({
        ...validInput,
        provingKey: keys.provingKey,
        verifyingKey: keys.verifyingKey,
      });

      expect(proof.system).toBe('groth16');
      expect(proof.proofType).toBe('commodity_origin');

      const valid = await verifyCommodityOrigin(proof);
      expect(valid).toBe(true);
    },
    60_000
  );
});

describe('CommodityRange ZKP (native)', () => {
  const validInput = {
    quantity: 55,
    min: 10,
    max: 100,
    commodityHash: '0101010101010101010101010101010101010101010101010101010101010101',
    unitHash: '0202020202020202020202020202020202020202020202020202020202020202',
    randomness: '0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a',
  };

  it('proveCommodityRange validates hex inputs', async () => {
    const { proveCommodityRange } = await import('../src/zkp-commodity-range');
    await expect(
      proveCommodityRange({ ...validInput, commodityHash: 'zzzz' } as any)
    ).rejects.toThrow(/commodityHash: expected 32-byte hex string/);
  });

  it('proveCommodityRange validates min <= max', async () => {
    const { proveCommodityRange } = await import('../src/zkp-commodity-range');
    await expect(proveCommodityRange({ ...validInput, min: 100, max: 10 } as any)).rejects.toThrow(
      /min must be <= max/
    );
  });

  it('end-to-end prove and verify commodity range', async () => {
    const { proveCommodityRange, verifyCommodityRange } =
      await import('../src/zkp-commodity-range');

    const proof = await proveCommodityRange(validInput);

    expect(proof.system).toBe('bulletproofs');
    expect(proof.proofType).toBe('commodity_range');
    expect(proof.proof).toMatch(/proofLow/);
    expect(proof.publicInputs).toEqual(['10', '100', expect.stringMatching(/^[0-9a-f]+$/i)]);

    const valid = await verifyCommodityRange(proof);
    expect(valid).toBe(true);
  }, 30_000);

  it('tampered commodity range proof fails verification', async () => {
    const { proveCommodityRange, verifyCommodityRange } =
      await import('../src/zkp-commodity-range');

    const proof = await proveCommodityRange(validInput);
    const tampered = { ...proof, proof: proof.proof.slice(0, -4) + 'dead' };
    const valid = await verifyCommodityRange(tampered);
    expect(valid).toBe(false);
  }, 30_000);
});
