# @gtcx/verification

Certificate generation, QR codes, and verification proofs for GTCX Protocol.

## Overview

This package provides **universal (platform-agnostic)** verification infrastructure. It generates data structures that can be signed and stored by platform-specific code.

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICATION ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  @gtcx/verification (this package)                              │
│  └── Universal data structures & validation                     │
│       │                                                         │
│       ├── certificates/  → Certificate templates & generation   │
│       ├── qr/            → QR code data structures             │
│       └── proofs/        → Proof bundling                       │
│                                                                 │
│  Platform Adapters (sign & store)                               │
│  ├── Mobile: apps/mobile/shared/crypto/                         │
│  ├── Web:    apps/web/shared/                                   │
│  └── Server: services/                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

```bash
pnpm add @gtcx/verification
```

## Usage

### Creating Certificates

```typescript
import { 
  createStandardCertificateData,
  createMilitaryGradeCertificateData,
  validateCertificateInput,
  GOLD_ORIGIN_TEMPLATE,
} from '@gtcx/verification';

// Validate input first
const validation = validateCertificateInput({
  templateId: 'gold-origin',
  location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
  userRole: 'miner',
  deviceId: 'device-123',
  goldLotData: { estimatedWeight: 15.5 },
});

if (!validation.valid) {
  console.error('Validation failed:', validation.errors);
  return;
}

// Create certificate data (unsigned)
const certData = createStandardCertificateData({
  templateId: 'gold-origin',
  location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
  userRole: 'miner',
  deviceId: 'device-123',
  goldLotData: { estimatedWeight: 15.5, quality: 'high' },
});

// Sign with platform-specific crypto
// Mobile: const signature = await mobileIdentity.sign(certData.dataToSign);
// Server: const signature = await serverCrypto.sign(certData.dataToSign);

// Finalize certificate
const certificate = {
  ...certData,
  signature,
  verificationData: {
    publicKey: myPublicKey,
    signature,
    timestamp: Date.now(),
  },
};
```

### Creating QR Codes

```typescript
import { 
  createLocationQRData,
  createCertificateQRData,
  createQRCodeStructure,
  verifyQRCodeData,
} from '@gtcx/verification';

// Create QR data for location
const qrData = createLocationQRData(
  'CERT-123',
  { latitude: 6.2, longitude: -1.6 },
  'abc123hash'
);

// Create structure (platform adapter adds actual image)
const qrStructure = createQRCodeStructure(qrData, 512);

// Verify QR data
const verification = verifyQRCodeData(qrData);
if (verification.isValid) {
  console.log('QR code is valid');
}
```

### Creating Proof Bundles

```typescript
import { 
  createProofBundle,
  createLocationProof,
  createCryptographicProofRef,
  serializeProofBundle,
} from '@gtcx/verification';

// Create location proof
const locationProof = createLocationProof({
  coordinates: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
  signature: mySignature,
  publicKey: myPublicKey,
});

// Create bundle
const bundle = createProofBundle({
  type: 'location',
  cryptographicProof: createCryptographicProofRef(dataHash, signature, publicKey),
  locationProof,
});

// Export for sharing
const exported = serializeProofBundle(bundle);
```

## Certificate Templates

| Template | Security Level | Use Case |
|----------|---------------|----------|
| `gold-origin` | quantum-resistant | Gold lot origin verification |
| `work-site` | enhanced | Daily work site check-in |
| `government-inspection` | quantum-resistant | Government inspector activities |
| `location` | standard | Basic location verification |
| `photo` | standard | Photo evidence with location |
| `compliance` | enhanced | Regulatory compliance |

## API Reference

### Certificates

- `createStandardCertificateData(input)` - Create standard certificate (single sig)
- `createMilitaryGradeCertificateData(input)` - Create military-grade certificate (multi-sig)
- `validateCertificateInput(input)` - Validate against template rules
- `verifyCertificateStructure(cert)` - Verify certificate structure
- `getTemplate(id)` - Get certificate template by ID

### QR Codes

- `createLocationQRData(certId, location, hash)` - QR data for location
- `createPhotoQRData(certId, hash, location?)` - QR data for photo
- `createGoldLotQRData(certId, goldData, hash)` - QR data for gold lot
- `createCertificateQRData(certData, hash)` - QR data for certificate
- `verifyQRCodeData(data)` - Verify QR data structure

### Proofs

- `createProofBundle(input)` - Create proof bundle
- `createLocationProof(input)` - Create location proof ref
- `createPhotoProof(input)` - Create photo proof ref
- `verifyProofBundleStructure(bundle)` - Verify bundle structure
- `serializeProofBundle(bundle)` - Export bundle as JSON

## Security Levels

| Level | Features |
|-------|----------|
| `standard` | Ed25519 single signature |
| `enhanced` | Ed25519 with stricter validation |
| `military` | Multi-signature (Ed25519 + Secp256k1) |
| `quantum-resistant` | Multi-sig + quantum-resistant hashing |

## Platform Integration

This package generates **data structures only**. Platform-specific code handles:

1. **Signing** - Use `@gtcx/crypto` or platform crypto APIs
2. **Storage** - SecureStore (mobile), localStorage (web), database (server)
3. **QR Image Generation** - `qrcode` library (mobile/web)

Example mobile integration:

```typescript
// apps/mobile/shared/crypto/certificates.ts
import { createStandardCertificateData } from '@gtcx/verification';
import { mobileIdentity } from './identity';

export async function generateCertificate(input) {
  const certData = createStandardCertificateData(input);
  const signature = await mobileIdentity.sign(certData.dataToSign);
  const publicKey = await mobileIdentity.getPublicKey();
  
  return {
    ...certData,
    signature,
    verificationData: {
      publicKey,
      signature,
      timestamp: Date.now(),
    },
  };
}
```

## License

Proprietary - GTCX Protocol
