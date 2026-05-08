import type { QRCodeType, MeasurementUnit, CommodityType, AssetLifecycleState, OperatorRole } from './primitives';
// QR CODE TYPES
// ============================================================================

/**
 * Data encoded in a QR code
 */
export interface QRCodeData {
  certificateId: string;
  verifyUrl: string;
  hash: string;
  timestamp: number;
  type: QRCodeType;
  metadata?: QRCodeMetadata | undefined;
}

/**
 * QR code metadata - commodity-agnostic
 */
export interface QRCodeMetadata {
  location?: { latitude: number; longitude: number } | undefined;
  assetWeight?: number | undefined;
  assetUnit?: MeasurementUnit | undefined;
  commodityType?: CommodityType | undefined;
  assetState?: AssetLifecycleState | undefined;
  purity?: number | undefined;
  producerId?: string | undefined;
  operatorRole?: OperatorRole | undefined;
}

/**
 * Generated QR code with all metadata
 */
export interface GeneratedQRCode {
  id: string;
  data: QRCodeData;
  qrCodeUri: string;
  dataString: string;
  size: number;
  timestamp: number;
}

/**
 * QR code verification result
 */
export interface QRCodeVerificationResult {
  isValid: boolean;
  data?: QRCodeData;
  error?: string;
}

// ============================================================================
