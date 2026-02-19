// ============================================================================
// @gtcx/verification
// Certificate generation, QR codes, and verification proofs for GTCX Protocol
// COMMODITY-AGNOSTIC ARCHITECTURE
// ============================================================================
//
// This package provides UNIVERSAL (platform-agnostic) verification infrastructure.
// It generates data structures that can be signed and stored by platform-specific code.
//
// KEY PRINCIPLE: Commodities are ATTRIBUTES, not types.
// The same certificate templates work for gold, silver, cocoa, coffee, or any commodity.
//
// Architecture:
// - Universal: This package (pure TypeScript, no platform dependencies)
// - Mobile: apps/mobile/shared/crypto/ (SecureStore, Expo)
// - Web: apps/web/shared/ (Web Crypto API)
// - Server: services/ (Node.js crypto)
//
// Usage:
// ```typescript
// import {
//   createStandardCertificateData,
//   createAssetLotQRData,
//   createProofBundle,
// } from '@gtcx/verification';
//
// // Create certificate data (unsigned) - COMMODITY-AGNOSTIC
// const certData = createStandardCertificateData({
//   templateId: 'asset-origin',
//   location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
//   userRole: 'producer',
//   deviceId: 'device-123',
//   assetLotData: {
//     commodityType: 'gold',  // or 'cocoa', 'cobalt', etc.
//     estimatedWeight: 15.5,
//     unit: 'troy_oz',
//   },
// });
//
// // Sign with platform-specific crypto (e.g., mobile)
// const signature = await mobileIdentity.sign(certData.dataToSign);
//
// // Create QR code data
// const qrData = createAssetLotQRData(certData.certificateId, assetData, hash);
//
// // Bundle proofs together
// const bundle = createProofBundle({
//   type: 'certificate',
//   cryptographicProof: { algorithm: 'Ed25519', dataHash, signature, publicKey },
//   certificate: signedCertificate,
// });
// ```
// ============================================================================

// Types - including commodity-agnostic abstractions
export * from './types';

// QR Code generation
export * from './qr';

// Certificate generation
export * from './certificates';

// Proof bundling
export * from './proofs';

// ============================================================================
// TRACED OPERATIONS (AI-Native)
// Import traced versions for operation logging and AI analysis
// ============================================================================

export {
  tracedGenerateCertificate,
  tracedVerifyCertificate,
  tracedGenerateQRCode,
  tracedVerifyQRCode,
  tracedCreateProofBundle,
  tracedVerificationWorkflow,
  logComplianceEvent,
  logGCICalculation,
  computeVerificationSummary,
  type GenerateCertificateInput,
  type GenerateQRCodeInput,
  type CreateProofBundleInput,
  type VerificationOperationLog,
  type VerificationSummary,
} from './traced';
