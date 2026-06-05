import { HashCommitmentZkpEngine } from 'file:///Users/amanianai/Sites/gtcx-ecosystem/gtcx-core/packages/crypto/dist/index.mjs';
import { UnifiedComplianceService } from 'file:///Users/amanianai/Sites/gtcx-ecosystem/gtcx-core/packages/services/dist/compliance.mjs';

const storageService = {
  saveAssetLot: async () => {},
  getAssetLot: async () => null,
  saveCertificate: async () => {},
  saveTransaction: async () => {},
};

const cryptoService = {
  createHash: async () => 'hash',
  sign: async () => 'sig',
  verify: async () => true,
  signTransaction: async () => 'tx-sig',
};

const assetLotBase = {
  id: 'LOT-001',
  commodityType: 'gold',
  producerId: 'producer-1',
  discoveryLocation: {
    latitude: 5.6,
    longitude: -0.18,
    accuracy: 5,
    timestamp: Date.now(),
  },
  discoveryDate: new Date().toISOString(),
  weight: 100,
  weightUnit: 'g',
  status: 'registered',
  cryptoProof: 'proof-hash',
  certificateId: 'CERT-001',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const run = async () => {
  const zkp = new HashCommitmentZkpEngine();
  const proof = await zkp.generate({
    system: 'bulletproofs',
    proofType: 'gci_threshold',
    publicInputs: ['threshold:50'],
    witness: 'score:75',
    verificationKeyId: 'bulletproofs-gci-v1',
  });

  const service = new UnifiedComplianceService({
    storageService,
    cryptoService,
    zkpVerifier: zkp,
  });

  const okRecords = await service.checkAssetLotCompliance({
    ...assetLotBase,
    metadata: { zkProof: proof },
  });

  const badRecords = await service.checkAssetLotCompliance({
    ...assetLotBase,
    metadata: { zkProof: { ...proof, proof: 'not-base64' } },
  });

  console.log(
    'ZKP UAT: valid proof violations',
    okRecords.filter((r) => r.regulation.code === 'ZKP-001').length
  );
  console.log(
    'ZKP UAT: invalid proof violations',
    badRecords.filter((r) => r.regulation.code === 'ZKP-001').length
  );
  console.log('ZKP UAT: okRecords total', okRecords.length, 'badRecords total', badRecords.length);
};

run().catch((error) => {
  console.error('ZKP UAT failed:', error);
  process.exit(1);
});
