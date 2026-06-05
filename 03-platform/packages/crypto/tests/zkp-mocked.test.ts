import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('CommodityOrigin ZKP (mocked native)', () => {
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
    commodityType: 0,
    mineId: '0202020202020202020202020202020202020202020202020202020202020202',
    lat: 18,
    lon: 30,
    primaryMetric: 950,
    secondaryMetric: 500,
    primaryRandomness: '0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d',
    secondaryRandomness: '0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e',
    locationRandomness: '0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f',
    bounds: [10, 20, 30, 40] as [number, number, number, number],
    minPrimary: 900,
    minSecondary: 400,
    certificationFlags: 1,
    merklePath:
      '200000000000000099795c4a032e419d11bf6b126146caf2017d9af9f81069e830c1df1e64c96a230100000000000000200000000000000076f751a99f42cf35974e668242fdc5b4e57486a4e95f7b2fc1bd878b99903b410000000000000000',
    provingKey: 'aa'.repeat(128),
    verifyingKey: 'bb'.repeat(128),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Inject mock into Node require cache so require('@gtcx/crypto-native') returns it
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

  it('generateCommodityOriginKeys returns keys', async () => {
    const { generateCommodityOriginKeys } = await import('../src/zkp-commodity-origin');
    const keys = await generateCommodityOriginKeys();
    expect(keys.provingKey).toBe('aabbccdd');
    expect(keys.verifyingKey).toBe('eeffaabb');
    expect(mockNative.groth16GenerateKeys).toHaveBeenCalledWith('commodity_origin');
  });

  it('proveCommodityOrigin returns a proof', async () => {
    const { proveCommodityOrigin } = await import('../src/zkp-commodity-origin');
    const proof = await proveCommodityOrigin(validInput);
    expect(proof.system).toBe('groth16');
    expect(proof.proofType).toBe('commodity_origin');
    expect(proof.proof).toBe('deadbeef');
    expect(proof.publicInputs).toEqual(['["input1","input2"]']);
    expect(proof.verificationKeyId).toBe('eeffaabb');
    expect(proof.created).toMatch(/^\d{4}-/);
  });

  it('proveCommodityOrigin validates odd-length merklePath', async () => {
    const { proveCommodityOrigin } = await import('../src/zkp-commodity-origin');
    await expect(
      proveCommodityOrigin({ ...validInput, merklePath: 'abc' } as unknown as typeof validInput)
    ).rejects.toThrow(/merklePath: expected even-length hex string/);
  });

  it('proveCommodityOrigin validates odd-length provingKey', async () => {
    const { proveCommodityOrigin } = await import('../src/zkp-commodity-origin');
    await expect(
      proveCommodityOrigin({ ...validInput, provingKey: 'a' } as unknown as typeof validInput)
    ).rejects.toThrow(/provingKey: expected even-length hex string/);
  });

  it('verifyCommodityOrigin returns true for valid proof', async () => {
    const { verifyCommodityOrigin } = await import('../src/zkp-commodity-origin');
    const result = await verifyCommodityOrigin({
      system: 'groth16',
      proofType: 'commodity_origin',
      publicInputs: ['["input1"]'],
      proof: 'deadbeef',
      verificationKeyId: 'vk',
      created: new Date().toISOString(),
    });
    expect(result).toBe(true);
    expect(mockNative.groth16VerifyProof).toHaveBeenCalledWith(
      'commodity_origin',
      'deadbeef',
      'vk',
      '["input1"]'
    );
  });
});
