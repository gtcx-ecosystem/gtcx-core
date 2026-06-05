import { describe, expect, it, vi } from 'vitest';

const RUN_HEAVY_ZKP = process.env['GTCX_RUN_HEAVY_ZKP_TESTS'] === '1';

describe('GhGoldOrigin ZKP (native)', () => {
  const validInput = {
    mineId: '0707070707070707070707070707070707070707070707070707070707070707',
    lat: 7_950_000,
    lon: 178_950_000,
    purityBps: 995,
    weightGrams: 1000,
    purityRandomness: '1414141414141414141414141414141414141414141414141414141414141414',
    weightRandomness: '1515151515151515151515151515151515151515151515151515151515151515',
    locationRandomness: '1616161616161616161616161616161616161616161616161616161616161616',
    certificationFlags: 4,
    merklePath:
      '200000000000000099795c4a032e419d11bf6b126146caf2017d9af9f81069e830c1df1e64c96a230100000000000000200000000000000076f751a99f42cf35974e668242fdc5b4e57486a4e95f7b2fc1bd878b99903b410000000000000000',
    provingKey: 'aa'.repeat(128),
    verifyingKey: 'bb'.repeat(128),
  };

  it('proveGhGoldOrigin rejects missing regulatory export bit', async () => {
    const { proveGhGoldOrigin } = await import('../src/zkp-gh-gold-origin');
    await expect(proveGhGoldOrigin({ ...validInput, certificationFlags: 0 })).rejects.toThrow(
      /regulatory export license bit/
    );
  });

  it('proveGhGoldOrigin validates mineId length', async () => {
    const { proveGhGoldOrigin } = await import('../src/zkp-gh-gold-origin');
    await expect(proveGhGoldOrigin({ ...validInput, mineId: 'abcd' } as any)).rejects.toThrow(
      /mineId: expected 32-byte hex string/
    );
  });

  (RUN_HEAVY_ZKP ? it : it.skip)(
    'end-to-end prove and verify gh-gold-origin profile',
    async () => {
      const { generateGhGoldOriginKeys, proveGhGoldOrigin, verifyGhGoldOrigin } =
        await import('../src/zkp-gh-gold-origin');

      const keys = await generateGhGoldOriginKeys();
      const proof = await proveGhGoldOrigin({
        ...validInput,
        provingKey: keys.provingKey,
        verifyingKey: keys.verifyingKey,
      });

      expect(proof.system).toBe('groth16');
      expect(proof.proofType).toBe('commodity_origin');
      expect(proof.profileId).toBe('gh-gold-origin');
      expect(proof.proof).toMatch(/^[0-9a-f]+$/i);

      const valid = await verifyGhGoldOrigin(proof);
      expect(valid).toBe(true);
    },
    60_000
  );
});

describe('GhGoldOrigin ZKP (mocked native)', () => {
  const mockNative = {
    groth16GenerateKeys: vi.fn(() => ({
      provingKey: 'pk',
      verifyingKey: 'vk',
    })),
    groth16ProveCommodityOriginProfile: vi.fn(() => ({
      proof: 'cc',
      verifyingKey: 'vk',
      publicInputsJson: '[]',
      profileId: 'gh-gold-origin',
    })),
    groth16VerifyProof: vi.fn(() => true),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('module') as typeof import('module');
    const resolved = mod.createRequire(import.meta.url).resolve('@gtcx/crypto-native');

    (require as NodeJS.Require).cache[resolved] = {
      id: resolved,
      filename: resolved,
      loaded: true,
      exports: mockNative,
    } as NodeJS.Module;
  });

  it('proveGhGoldOrigin calls native profile prove', async () => {
    const { proveGhGoldOrigin } = await import('../src/zkp-gh-gold-origin');

    const proof = await proveGhGoldOrigin({
      mineId: '07'.repeat(32),
      lat: 1,
      lon: 2,
      purityBps: 995,
      weightGrams: 1000,
      purityRandomness: '14'.repeat(32),
      weightRandomness: '15'.repeat(32),
      locationRandomness: '16'.repeat(32),
      certificationFlags: 4,
      merklePath: 'ab',
      provingKey: 'aa',
      verifyingKey: 'bb',
    });

    expect(mockNative.groth16ProveCommodityOriginProfile).toHaveBeenCalledWith(
      'gh-gold-origin',
      '07'.repeat(32),
      1,
      2,
      995,
      1000,
      '14'.repeat(32),
      '15'.repeat(32),
      '16'.repeat(32),
      4,
      'ab',
      'aa',
      'bb'
    );
    expect(proof.profileId).toBe('gh-gold-origin');
  });
});
