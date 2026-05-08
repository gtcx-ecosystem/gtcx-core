/**
 * Sanitizer functions for traced verification operations.
 * Extracted for independent unit testing and to keep traced() calls readable.
 */

import type {
  Certificate,
  GeneratedQRCode,
  ProofBundle,
  CertificateLocation,
  Claim,
  AssetLotData,
  CertificateType,
  CertificateSecurityLevel,
  MeasurementUnit,
  CommodityType,
  OperatorRole,
} from '../types';

export interface GenerateCertificateInput {
  type: CertificateType;
  securityLevel: CertificateSecurityLevel;
  location: CertificateLocation;
  assetData?: AssetLotData;
  claims?: Claim[];
  privateKey: string;
  publicKey: string;
}

export interface GenerateQRCodeInput {
  certificateId: string;
  type: 'location' | 'photo' | 'certificate' | 'asset-lot';
  metadata?: Record<string, unknown> | undefined;
  size?: number | undefined;
}

export interface QRMetadataInput {
  hash?: string | undefined;
  photoHash?: string | undefined;
  location?: { latitude: number; longitude: number } | undefined;
  assetWeight?: number | undefined;
  assetUnit?: MeasurementUnit | undefined;
  purity?: number | undefined;
  commodityType?: CommodityType | undefined;
  producerId?: string | undefined;
  operatorRole?: OperatorRole | undefined;
}

export interface CreateProofBundleInput {
  type: 'location' | 'photo' | 'workflow' | 'certificate';
  location?: CertificateLocation | undefined;
  photoHashes?: string[] | undefined;
  certificate?: Certificate | undefined;
  claims?: Claim[] | undefined;
}

export function sanitizeGenerateCertificateInput(input: unknown): Record<string, unknown> {
  const args = input as GenerateCertificateInput[];
  const params = args[0];
  return {
    type: params?.type,
    securityLevel: params?.securityLevel,
    hasAssetData: !!params?.assetData,
    claimCount: params?.claims?.length ?? 0,
    hasPrivateKey: !!params?.privateKey,
  };
}

export function sanitizeGenerateCertificateOutput(output: unknown): Record<string, unknown> {
  const cert = output as Certificate;
  return {
    certificateId: cert?.certificateId,
    type: cert?.type,
    securityLevel: cert?.securityLevel,
    issuedAt: cert?.metadata?.issuedAt,
  };
}

export function sanitizeVerifyCertificateInput(input: unknown): Record<string, unknown> {
  const args = input as Certificate[];
  const cert = args[0];
  return {
    certificateId: cert?.certificateId,
    type: cert?.type,
    securityLevel: cert?.securityLevel,
  };
}

export function sanitizeGenerateQRCodeOutput(output: unknown): Record<string, unknown> {
  const qr = output as GeneratedQRCode;
  return {
    id: qr?.id,
    type: qr?.data?.type,
    size: qr?.size,
  };
}

export function sanitizeCreateProofBundleInput(input: unknown): Record<string, unknown> {
  const args = input as CreateProofBundleInput[];
  const params = args[0];
  return {
    type: params?.type,
    hasLocation: !!params?.location,
    photoCount: params?.photoHashes?.length ?? 0,
    hasCertificate: !!params?.certificate,
    claimCount: params?.claims?.length ?? 0,
  };
}

export function sanitizeCreateProofBundleOutput(output: unknown): Record<string, unknown> {
  const bundle = output as ProofBundle;
  return {
    id: bundle?.id,
    type: bundle?.type,
    hasCertificate: !!bundle?.certificate,
    hasQRCode: !!bundle?.qrCode,
  };
}
