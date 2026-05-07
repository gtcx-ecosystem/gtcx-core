/**
 * Registration helper methods — ID generation, crypto proofs, certificates, asset lot building.
 */

import { randomUUID } from 'node:crypto';

import type {
  AssetCertificate,
  AssetLot,
  CryptographicProof,
  ICryptoService,
  ValidatedRegistrationData,
} from '@gtcx/domain';

export function generateSessionId(): string {
  return `reg_${Date.now()}_${randomUUID()}`;
}

export function generateLotId(data: ValidatedRegistrationData): string {
  const prefix = data.commodityType.substring(0, 3).toUpperCase();
  const lat = Math.abs(data.discoveryLocation.latitude).toFixed(2).replace('.', '');
  const lng = Math.abs(data.discoveryLocation.longitude).toFixed(2).replace('.', '');
  const time = Date.now().toString(36).toUpperCase();
  const random = randomUUID().substring(0, 4).toUpperCase();

  return `${prefix}-${lat}-${lng}-${time}-${random}`;
}

export async function generateCryptoProof(
  data: ValidatedRegistrationData,
  cryptoService: ICryptoService
): Promise<{ hash: string; signature: string }> {
  const proofData = {
    commodityType: data.commodityType,
    producerId: data.producerId,
    location: data.discoveryLocation,
    weight: data.estimatedWeight,
    photoHashes: data.photos.map((p) => p.hash).filter(Boolean),
    timestamp: Date.now(),
  };

  const hash = await cryptoService.createHash(JSON.stringify(proofData));
  const signature = await cryptoService.sign(hash);

  return { hash, signature };
}

export async function generateCertificate(
  lotId: string,
  data: ValidatedRegistrationData,
  proof: { hash: string; signature: string }
): Promise<AssetCertificate> {
  const certificateId = `CERT-${lotId}`;

  return {
    id: certificateId,
    lotId,
    hash: proof.hash,
    signature: proof.signature,
    timestamp: new Date().toISOString(),
    producerLicense: data.producerId,
    location: {
      latitude: data.discoveryLocation.latitude,
      longitude: data.discoveryLocation.longitude,
      accuracy: data.discoveryLocation.accuracy,
      altitude: data.discoveryLocation.altitude,
      timestamp: data.discoveryLocation.timestamp,
    },
    assetCharacteristics: data.assetDetails || {},
    verificationLevel: 'preliminary',
    issuedBy: 'GTCX Protocol',
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

export function buildAssetLot(
  lotId: string,
  validData: ValidatedRegistrationData,
  cryptoProof: CryptographicProof,
  certificate: AssetCertificate,
  sessionId: string
): AssetLot {
  const qualityGrade =
    validData.quality === 'high'
      ? 'A'
      : validData.quality === 'medium'
        ? 'B'
        : validData.quality === 'low'
          ? 'C'
          : 'ungraded';

  return {
    id: lotId,
    commodityType: validData.commodityType,
    producerId: validData.producerId,
    discoveryLocation: {
      latitude: validData.discoveryLocation.latitude,
      longitude: validData.discoveryLocation.longitude,
      altitude: validData.discoveryLocation.altitude,
      accuracy: validData.discoveryLocation.accuracy,
      timestamp: validData.discoveryLocation.timestamp,
    },
    discoveryDate: validData.discoveryDate || new Date().toISOString(),
    weight: validData.estimatedWeight,
    weightUnit: validData.weightUnit,
    form: validData.form,
    purity: validData.purity,
    qualityGrade,
    status: 'registered',
    cryptoProof: cryptoProof.hash,
    certificateId: certificate.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      photos: validData.photos,
      assetDetails: validData.assetDetails || {},
      registrationSessionId: sessionId,
      cryptoProof,
    },
  };
}
