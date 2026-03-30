// ============================================================================
// QR CODE GENERATOR - UNIVERSAL (Platform-Agnostic)
// Generates QR code data structures for verification
// Platform adapters handle actual image generation
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================

import { randomUUID } from 'node:crypto';

import { hash256 } from '@gtcx/crypto';

import type {
  QRCodeData,
  QRCodeType,
  QRCodeMetadata,
  GeneratedQRCode,
  QRCodeVerificationResult,
  CommodityType,
  MeasurementUnit,
  OperatorRole,
} from '../types';

/**
 * Configuration for QR code generation
 */
export interface QRCodeConfig {
  /** Base URL for verification endpoint */
  verifyBaseUrl: string;
  /** Default QR code size in pixels */
  defaultSize: number;
  /** Certificate ID pattern for validation */
  certificateIdPattern: RegExp;
  /** Maximum age for valid certificates (ms) */
  maxCertificateAge: number;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: QRCodeConfig = {
  verifyBaseUrl: 'https://verify.gtcx.io',
  defaultSize: 256,
  certificateIdPattern: /^[A-Z0-9_-]+$/,
  maxCertificateAge: 365 * 24 * 60 * 60 * 1000, // 1 year
};

/**
 * Generate unique QR code ID
 */
export function generateQRCodeId(): string {
  return `qr_${randomUUID()}`;
}

/**
 * Create QR code data structure for a location
 */
export function createLocationQRData(
  certificateId: string,
  location: { latitude: number; longitude: number },
  hash: string,
  config: Partial<QRCodeConfig> = {}
): QRCodeData {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  return {
    certificateId,
    verifyUrl: `${cfg.verifyBaseUrl}/verify/${certificateId}`,
    hash: hash.substring(0, 16),
    timestamp: Date.now(),
    type: 'location',
    metadata: { location },
  };
}

/**
 * Create QR code data structure for a photo
 */
export function createPhotoQRData(
  certificateId: string,
  photoHash: string,
  location?: { latitude: number; longitude: number },
  config: Partial<QRCodeConfig> = {}
): QRCodeData {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  return {
    certificateId,
    verifyUrl: `${cfg.verifyBaseUrl}/verify/${certificateId}`,
    hash: photoHash.substring(0, 16),
    timestamp: Date.now(),
    type: 'photo',
    metadata: location ? { location } : undefined,
  };
}

/**
 * Create QR code data structure for an asset lot - COMMODITY-AGNOSTIC
 * Works for gold, silver, cocoa, coffee, or any other commodity
 */
export function createAssetLotQRData(
  certificateId: string,
  assetLotData: {
    weight: number;
    unit?: MeasurementUnit;
    purity?: number;
    commodityType: CommodityType;
    producerId?: string;
    operatorRole?: OperatorRole;
    location: { latitude: number; longitude: number };
  },
  hash: string,
  config: Partial<QRCodeConfig> = {}
): QRCodeData {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  return {
    certificateId,
    verifyUrl: `${cfg.verifyBaseUrl}/verify/${certificateId}`,
    hash: hash.substring(0, 16),
    timestamp: Date.now(),
    type: 'asset-lot',
    metadata: {
      location: assetLotData.location,
      assetWeight: assetLotData.weight,
      assetUnit: assetLotData.unit,
      commodityType: assetLotData.commodityType,
      purity: assetLotData.purity,
      producerId: assetLotData.producerId,
      operatorRole: assetLotData.operatorRole,
    },
  };
}

/**
 * @deprecated Use createAssetLotQRData instead
 * Legacy function for gold-specific lot QR codes
 */
export function createGoldLotQRData(
  certificateId: string,
  goldLotData: {
    weight: number;
    purity: number;
    miner: string;
    location: { latitude: number; longitude: number };
  },
  hash: string,
  config: Partial<QRCodeConfig> = {}
): QRCodeData {
  // Delegate to commodity-agnostic function
  return createAssetLotQRData(
    certificateId,
    {
      weight: goldLotData.weight,
      unit: 'troy_oz',
      purity: goldLotData.purity,
      commodityType: 'gold',
      producerId: goldLotData.miner,
      operatorRole: 'producer',
      location: goldLotData.location,
    },
    hash,
    config
  );
}

/**
 * Create QR code data structure for a certificate - COMMODITY-AGNOSTIC
 */
export function createCertificateQRData(
  certificateData: {
    certificateId: string;
    issuedAt: number;
    location?: { latitude: number; longitude: number };
    /** Primary: commodity-agnostic asset lot data */
    assetLotData?: {
      estimatedWeight?: number;
      unit?: MeasurementUnit;
      purity?: number;
      commodityType?: CommodityType;
      producerId?: string;
      operatorRole?: OperatorRole;
    };
    /** @deprecated Use assetLotData instead */
    goldLotData?: {
      estimatedWeight?: number;
      purity?: number;
      miner?: string;
    };
  },
  proofHash: string,
  config: Partial<QRCodeConfig> = {}
): QRCodeData {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const metadata: QRCodeMetadata = {};

  if (certificateData.location) {
    metadata.location = certificateData.location;
  }

  // Prefer assetLotData over goldLotData
  const lotData = certificateData.assetLotData ?? certificateData.goldLotData;

  if (lotData) {
    if ('estimatedWeight' in lotData && lotData.estimatedWeight) {
      metadata.assetWeight = lotData.estimatedWeight;
    }

    if ('unit' in lotData && lotData.unit) {
      metadata.assetUnit = lotData.unit;
    }

    if ('purity' in lotData && lotData.purity) {
      metadata.purity = lotData.purity;
    }

    if ('commodityType' in lotData && lotData.commodityType) {
      metadata.commodityType = lotData.commodityType;
    } else if (certificateData.goldLotData) {
      // Legacy gold data
      metadata.commodityType = 'gold';
    }

    if ('producerId' in lotData && lotData.producerId) {
      metadata.producerId = lotData.producerId;
    } else if ('miner' in lotData && lotData.miner) {
      // Legacy miner field
      metadata.producerId = lotData.miner;
    }

    if ('operatorRole' in lotData && lotData.operatorRole) {
      metadata.operatorRole = lotData.operatorRole;
    }
  }

  return {
    certificateId: certificateData.certificateId,
    verifyUrl: `${cfg.verifyBaseUrl}/verify/${certificateData.certificateId}`,
    hash: proofHash.substring(0, 16),
    timestamp: certificateData.issuedAt,
    type: 'certificate',
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
  };
}

/**
 * Serialize QR code data to string
 */
export function serializeQRData(data: QRCodeData): string {
  return JSON.stringify(data);
}

/**
 * Parse QR code data from string
 */
export function parseQRData(dataString: string): QRCodeData | null {
  try {
    if (dataString.length > 50_000) return null; // 50KB max for QR data
    return JSON.parse(dataString) as QRCodeData;
  } catch {
    return null;
  }
}

/**
 * Verify QR code data structure and integrity
 */
export function verifyQRCodeData(
  qrCodeData: string | QRCodeData,
  config: Partial<QRCodeConfig> = {}
): QRCodeVerificationResult {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  try {
    const data = typeof qrCodeData === 'string' ? parseQRData(qrCodeData) : qrCodeData;

    if (!data) {
      return {
        isValid: false,
        error: 'Invalid QR code data format',
      };
    }

    // Required fields check
    if (!data.certificateId || !data.verifyUrl || !data.hash) {
      return {
        isValid: false,
        error: 'Missing required QR code data fields',
      };
    }

    // Certificate ID format validation
    if (!cfg.certificateIdPattern.test(data.certificateId)) {
      return {
        isValid: false,
        error: 'Invalid certificate ID format',
      };
    }

    // Timestamp validation
    const now = Date.now();
    const age = now - data.timestamp;

    if (age < 0) {
      return {
        isValid: false,
        error: 'Certificate timestamp is in the future',
      };
    }

    if (age > cfg.maxCertificateAge) {
      return {
        isValid: false,
        error: 'Certificate has expired',
      };
    }

    // Type validation - support both old and new types
    const validTypes: QRCodeType[] = ['location', 'photo', 'certificate', 'asset-lot'];
    // Also accept legacy 'gold-lot' type
    const legacyTypes = ['gold-lot'];

    if (!validTypes.includes(data.type) && !legacyTypes.includes(data.type as string)) {
      return {
        isValid: false,
        error: 'Invalid QR code type',
      };
    }

    return {
      isValid: true,
      data,
    };
  } catch (_error) {
    return {
      isValid: false,
      error: 'QR code verification failed',
    };
  }
}

/**
 * Create a GeneratedQRCode structure (without image - platform adapter adds that)
 */
export function createQRCodeStructure(
  data: QRCodeData,
  size: number = DEFAULT_CONFIG.defaultSize
): Omit<GeneratedQRCode, 'qrCodeUri'> {
  return {
    id: generateQRCodeId(),
    data,
    dataString: serializeQRData(data),
    size,
    timestamp: Date.now(),
  };
}

/**
 * Generate data hash for QR code content
 */
export function hashQRCodeContent(content: unknown): string {
  const dataString = typeof content === 'string' ? content : JSON.stringify(content);
  return hash256(dataString);
}

/**
 * Extract commodity type from QR code data
 */
export function getQRCodeCommodityType(data: QRCodeData): CommodityType | undefined {
  return data.metadata?.commodityType;
}
