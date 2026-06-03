import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('GhCocoaOrigin ZKP (native)', () => {
  const validInput = {
    farmId: '0707070707070707070707070707070707070707070707070707070707070707',
    lat: 8_000_000,
    lon: 179_000_000,
    gradeScore: 85,
    weightGrams: 1000,
    gradeRandomness: '1414141414141414141414141414141414141414141414141414141414141414',
    weightRandomness: '1515151515151515151515151515151515151515151515151515151515151515',
    locationRandomness: '1616161616161616161616161616161616161616161616161616161616161616',
    certificationFlags: 2,
    merklePath:
      '200000000000000099795c4a032e419d11bf6b126146caf2017d9af9f81069e830c1df1e64c96a230100000000000000200000000000000076f751a99f42cf35974e668242fdc5b4e57486a4e95f7b2fc1bd878b99903b410000000000000000',
    provingKey: 'aa'.repeat(128),
    verifyingKey: 'bb'.repeat(128),
  };

  it('proveGhCocoaOrigin rejects missing origin-authenticated bit', async () => {
    const { proveGhCocoaOrigin } = await import('../src/zkp-gh-cocoa-origin');
    await expect(proveGhCocoaOrigin({ ...validInput, certificationFlags: 0 })).rejects.toThrow(
      /origin-authenticated bit/
    );
  });
});

describe('GhCocoaOrigin ZKP (mocked native)', () => {
  const mockNative = {
    groth16GenerateKeys: vi.fn(() => ({
      provingKey: 'pk',
      verifyingKey: 'vk',
    })),
    groth16ProveCommodityOriginProfile: vi.fn(() => ({
      proof: 'cc',
      verifyingKey: 'vk',
      publicInputsJson: '[]',
      profileId: 'gh-cocoa-origin',
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

  it('proveGhCocoaOrigin calls native profile prove', async () => {
    const { proveGhCocoaOrigin } = await import('../src/zkp-gh-cocoa-origin');

    const proof = await proveGhCocoaOrigin({
      farmId: '07'.repeat(32),
      lat: 8_000_000,
      lon: 179_000_000,
      gradeScore: 85,
      weightGrams: 1000,
      gradeRandomness: '14'.repeat(32),
      weightRandomness: '15'.repeat(32),
      locationRandomness: '16'.repeat(32),
      certificationFlags: 2,
      merklePath: '00'.repeat(8),
      provingKey: 'aa',
      verifyingKey: 'bb',
    });

    expect(proof.profileId).toBe('gh-cocoa-origin');
    expect(mockNative.groth16ProveCommodityOriginProfile).toHaveBeenCalledWith(
      'gh-cocoa-origin',
      expect.any(String),
      expect.any(Number),
      expect.any(Number),
      85,
      1000,
      expect.any(String),
      expect.any(String),
      expect.any(String),
      2,
      expect.any(String),
      'aa',
      'bb'
    );
  });
});
