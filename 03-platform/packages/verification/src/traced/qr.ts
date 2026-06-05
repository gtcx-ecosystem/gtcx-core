/**
 * Traced QR code operations.
 */

import { hash256 } from '@gtcx/crypto';

import {
  createAssetLotQRData,
  createCertificateQRData,
  createLocationQRData,
  createPhotoQRData,
  createQRCodeStructure,
  verifyQRCodeData,
} from '../qr/generator.js';
import { traced } from '../tracing.js';
import type { GeneratedQRCode, QRCodeVerificationResult } from '../types';

import { GenerateQRCodeInput, QRMetadataInput, sanitizeGenerateQRCodeOutput } from './sanitizers';

export const tracedGenerateQRCode = traced(
  async (params: GenerateQRCodeInput): Promise<GeneratedQRCode> => {
    const metadata = (params.metadata ?? {}) as QRMetadataInput;
    const hash = metadata.hash ?? hash256(JSON.stringify({ certificateId: params.certificateId }));
    const location = metadata.location ?? { latitude: 0, longitude: 0 };

    const qrData =
      params.type === 'location'
        ? createLocationQRData(params.certificateId, location, hash)
        : params.type === 'photo'
          ? createPhotoQRData(params.certificateId, metadata.photoHash ?? hash, location)
          : params.type === 'asset-lot'
            ? createAssetLotQRData(
                params.certificateId,
                {
                  weight: metadata.assetWeight ?? 0,
                  unit: metadata.assetUnit,
                  purity: metadata.purity,
                  commodityType: metadata.commodityType ?? 'other',
                  producerId: metadata.producerId,
                  operatorRole: metadata.operatorRole,
                  location,
                },
                hash
              )
            : createCertificateQRData(
                {
                  certificateId: params.certificateId,
                  issuedAt: Date.now(),
                  location,
                  assetLotData:
                    metadata.assetWeight !== undefined ||
                    metadata.assetUnit !== undefined ||
                    metadata.purity !== undefined ||
                    metadata.commodityType !== undefined
                      ? {
                          estimatedWeight: metadata.assetWeight,
                          unit: metadata.assetUnit,
                          purity: metadata.purity,
                          commodityType: metadata.commodityType,
                          producerId: metadata.producerId,
                          operatorRole: metadata.operatorRole,
                        }
                      : undefined,
                },
                hash
              );

    const generated = createQRCodeStructure(qrData, params.size);
    const qrCodeUri = `data:application/json;base64,${Buffer.from(generated.dataString).toString('base64')}`;

    return { ...generated, qrCodeUri };
  },
  'verification.generateQRCode',
  {
    category: 'verification',
    logInput: true,
    logOutput: true,
    sanitizeOutput: sanitizeGenerateQRCodeOutput,
  }
);

export const tracedVerifyQRCode = traced(
  async (qrData: string): Promise<QRCodeVerificationResult> => {
    return verifyQRCodeData(qrData);
  },
  'verification.verifyQRCode',
  {
    category: 'verification',
    logInput: false,
    logOutput: true,
  }
);
