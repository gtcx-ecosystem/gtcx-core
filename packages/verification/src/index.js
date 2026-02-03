"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeVerificationSummary = exports.logGCICalculation = exports.logComplianceEvent = exports.tracedVerificationWorkflow = exports.tracedCreateProofBundle = exports.tracedVerifyQRCode = exports.tracedGenerateQRCode = exports.tracedVerifyCertificate = exports.tracedGenerateCertificate = void 0;
// Types - including commodity-agnostic abstractions
__exportStar(require("./types"), exports);
// QR Code generation
__exportStar(require("./qr"), exports);
// Certificate generation
__exportStar(require("./certificates"), exports);
// Proof bundling
__exportStar(require("./proofs"), exports);
// ============================================================================
// TRACED OPERATIONS (AI-Native)
// Import traced versions for operation logging and AI analysis
// ============================================================================
var traced_1 = require("./traced");
Object.defineProperty(exports, "tracedGenerateCertificate", { enumerable: true, get: function () { return traced_1.tracedGenerateCertificate; } });
Object.defineProperty(exports, "tracedVerifyCertificate", { enumerable: true, get: function () { return traced_1.tracedVerifyCertificate; } });
Object.defineProperty(exports, "tracedGenerateQRCode", { enumerable: true, get: function () { return traced_1.tracedGenerateQRCode; } });
Object.defineProperty(exports, "tracedVerifyQRCode", { enumerable: true, get: function () { return traced_1.tracedVerifyQRCode; } });
Object.defineProperty(exports, "tracedCreateProofBundle", { enumerable: true, get: function () { return traced_1.tracedCreateProofBundle; } });
Object.defineProperty(exports, "tracedVerificationWorkflow", { enumerable: true, get: function () { return traced_1.tracedVerificationWorkflow; } });
Object.defineProperty(exports, "logComplianceEvent", { enumerable: true, get: function () { return traced_1.logComplianceEvent; } });
Object.defineProperty(exports, "logGCICalculation", { enumerable: true, get: function () { return traced_1.logGCICalculation; } });
Object.defineProperty(exports, "computeVerificationSummary", { enumerable: true, get: function () { return traced_1.computeVerificationSummary; } });
//# sourceMappingURL=index.js.map