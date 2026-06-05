// ============================================================================
// QR CODE MODULE - PUBLIC API
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================

export {
  // Generator functions - commodity-agnostic
  createLocationQRData,
  createPhotoQRData,
  createAssetLotQRData,
  createCertificateQRData,
  createQRCodeStructure,

  // Legacy (deprecated)
  createGoldLotQRData,

  // Utilities
  generateQRCodeId,
  serializeQRData,
  parseQRData,
  verifyQRCodeData,
  hashQRCodeContent,
  getQRCodeCommodityType,

  // Types
  type QRCodeConfig,
} from './generator';

// Re-export types from central types
export type {
  QRCodeData,
  QRCodeType,
  QRCodeMetadata,
  GeneratedQRCode,
  QRCodeVerificationResult,
} from '../types';
