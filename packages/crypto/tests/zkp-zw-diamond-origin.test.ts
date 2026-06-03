import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ZwDiamondOrigin ZKP (native)', () => {
  const validInput = {
    mineId: '0707070707070707070707070707070707070707070707070707070707070707',
    lat: 20_000_000,
    lon: 30_000_000,
    clarityScore: 85,
    centiCarats: 500,
    clarityRandomness: '1414141414141414141414141414141414141414141414141414141414141414',
    massRandomness: '1515151515151515151515151515151515151515151515151515151515151515',
    locationRandomness: '1616161616161616161616161616161616161616161616161616161616161616',
    certificationFlags: 1,
    merklePath:
      '200000000000000099795c4a032e419d11bf6b126146caf2017d9af9f81069e830c1df1e64c96a230100000000000000200000000000000076f751a99f42cf35974e668242fdc5b4e57486a4e95f7b2fc1bd878b99903b410000000000000000',
    provingKey: 'aa'.repeat(128),
    verifyingKey: 'bb'.repeat(128),
  };

  it('proveZwDiamondOrigin rejects missing regional certification bit', async () => {
    const { proveZwDiamondOrigin } = await import('../src/zkp-zw-diamond-origin');
    await expect(proveZwDiamondOrigin({ ...validInput, certificationFlags: 0 })).rejects.toThrow(
      /regional certification bit/
    );
  });
});

describe('ZwDiamondOrigin ZKP (mocked native)', () => {
  const mockNative = {
    groth16GenerateKeys: vi.fn(() => ({
      provingKey: 'pk',
      verifyingKey: 'vk',
    })),
    groth16ProveCommodityOriginProfile: vi.fn(() => ({
      proof: 'cc',
      verifyingKey: 'vk',
      publicInputsJson: '[]',
      profileId: 'zw-diamond-origin',
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

  it('proveZwDiamondOrigin calls native profile prove', async () => {
    const { proveZwDiamondOrigin } = await import('../src/zkp-zw-diamond-origin');

    const proof = await proveZwDiamondOrigin({
      mineId: '07'.repeat(32),
      lat: 20_000_000,
      lon: 30_000_000,
      clarityScore: 85,
      centiCarats: 500,
      clarityRandomness: '14'.repeat(32),
      massRandomness: '15'.repeat(32),
      locationRandomness: '16'.repeat(32),
      certificationFlags: 1,
      merklePath: '00'.repeat(8),
      provingKey: 'aa',
      verifyingKey: 'bb',
    });

    expect(proof.profileId).toBe('zw-diamond-origin');
    expect(mockNative.groth16ProveCommodityOriginProfile).toHaveBeenCalled();
  });
});
