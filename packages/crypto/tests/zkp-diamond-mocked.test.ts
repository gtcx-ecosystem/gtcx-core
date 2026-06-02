import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('DiamondOrigin ZKP (mocked native)', () => {
  const mockNative = {
    groth16GenerateKeys: vi.fn(() => ({
      provingKey: 'aabbccdd',
      verifyingKey: 'eeffaabb',
    })),
    groth16ProveCommodityOrigin: vi.fn(() => ({
      proof: 'deadbeef',
      verifyingKey: 'eeffaabb',
      publicInputsJson: '["input1","input2"]',
    })),
    groth16VerifyProof: vi.fn(() => true),
  };

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

  it('generateDiamondOriginKeys delegates to generic keys', async () => {
    const { generateDiamondOriginKeys } = await import('../src/zkp-diamond-origin');
    const keys = await generateDiamondOriginKeys();
    expect(keys.provingKey).toBe('aabbccdd');
    expect(keys.verifyingKey).toBe('eeffaabb');
    expect(mockNative.groth16GenerateKeys).toHaveBeenCalledWith('commodity_origin');
  });

  it('proveDiamondOrigin returns a proof when kpCertified is true', async () => {
    const { proveDiamondOrigin } = await import('../src/zkp-diamond-origin');
    const proof = await proveDiamondOrigin(validInput);
    expect(proof.system).toBe('groth16');
    expect(proof.proofType).toBe('commodity_origin');
    expect(proof.proof).toBe('deadbeef');
  });

  it('verifyDiamondOrigin delegates to generic verify', async () => {
    const { verifyDiamondOrigin } = await import('../src/zkp-diamond-origin');
    const result = await verifyDiamondOrigin({
      system: 'groth16',
      proofType: 'commodity_origin',
      publicInputs: ['["input1"]'],
      proof: 'deadbeef',
      verificationKeyId: 'vk',
      created: new Date().toISOString(),
    });
    expect(result).toBe(true);
  });
});
