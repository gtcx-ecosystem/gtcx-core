# @gtcx/verification

Certificate generation, QR codes, proof bundles, and verification infrastructure for GTCX Protocol. This package provides platform-agnostic data structures that can be signed and stored by platform-specific adapters.

## Architecture

```
@gtcx/verification (this package)
└── Universal data structures and validation
     │
     ├── certificates/  → Certificate templates and generation
     ├── qr/            → QR code data structures
     └── proofs/        → Proof bundling and Merkle trees

Platform Adapters (sign and store)
├── Mobile: @gtcx/mobile-shared (React Native SecureStore)
├── Web:    apps/web/shared/ (IndexedDB)
└── Server: services/ (HSM or KMS signing)
```

This package generates **data structures only**. Platform-specific code handles signing, storage, and QR image rendering.

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
} from '@gtcx/verification';

// Validate input against template rules
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

// Create certificate data (unsigned — signing is platform-specific)
const certData = createStandardCertificateData({
  templateId: 'gold-origin',
  location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
  userRole: 'miner',
  deviceId: 'device-123',
  goldLotData: { estimatedWeight: 15.5, quality: 'high' },
});

// Platform adapter signs and finalizes:
// const signature = await platformCrypto.sign(certData.dataToSign);
// const certificate = { ...certData, signature, verificationData: { ... } };
```

### Creating QR Codes

QR codes encode verification data for physical-world scanning (e.g., scanning a lot tag at a vault).

```typescript
import {
  createLocationQRData,
  createGoldLotQRData,
  createQRCodeStructure,
  verifyQRCodeData,
} from '@gtcx/verification';

// Create QR data for a location verification
const qrData = createLocationQRData(
  'CERT-123',                            // certificate ID
  { latitude: 6.2, longitude: -1.6 },   // coordinates
  'sha256:abc123...'                     // content hash
);

// Create structure with size hint (platform adapter renders the image)
const qrStructure = createQRCodeStructure(qrData, 512);

// Verify QR data integrity
const verification = verifyQRCodeData(qrData);
if (verification.isValid) {
  // QR data structure is valid — signature check is separate
}
```

### Creating Proof Bundles

Proof bundles combine multiple verification proofs (location, photo, measurement) into a single cryptographically linked package.

```typescript
import {
  createProofBundle,
  createLocationProof,
  createCryptographicProofRef,
  serializeProofBundle,
  verifyProofBundleStructure,
} from '@gtcx/verification';

// Create individual proofs
const locationProof = createLocationProof({
  coordinates: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
  signature: mySignature,
  publicKey: myPublicKey,
});

// Bundle proofs together with a cryptographic binding
const bundle = createProofBundle({
  type: 'location',
  cryptographicProof: createCryptographicProofRef(dataHash, signature, publicKey),
  locationProof,
});

// Verify bundle structure
const structureValid = verifyProofBundleStructure(bundle);

// Serialize for transport or storage
const exported = serializeProofBundle(bundle);
```

### Merkle Proof Bundles

For large verification chains, proof bundles use Merkle trees to enable selective verification without revealing the full bundle.

```typescript
import { createMerkleProofBundle, verifyMerkleInclusion } from '@gtcx/verification';

// Create a Merkle tree from multiple verification records
const merkleBundle = createMerkleProofBundle([
  originVerification,
  weightVerification,
  purityVerification,
  custodyVerification,
]);
// merkleBundle.root = 'sha256:...' (the Merkle root)

// Generate an inclusion proof for a single verification
const proof = merkleBundle.getInclusionProof(weightVerification);

// A third party can verify inclusion without seeing the other verifications
const included = verifyMerkleInclusion(
  weightVerification,
  proof,
  merkleBundle.root
);
// true — weight verification is in the bundle
```

## Certificate Templates

| Template | Security Level | Use Case | Required Fields |
|----------|---------------|----------|-----------------|
| `gold-origin` | quantum-resistant | Gold lot origin verification | location, weight, deviceId |
| `work-site` | enhanced | Daily work site check-in | location, userRole |
| `government-inspection` | quantum-resistant | Government inspector activities | location, findings, inspectorId |
| `location` | standard | Basic location verification | coordinates |
| `photo` | standard | Photo evidence with location | photoHash, coordinates |
| `compliance` | enhanced | Regulatory compliance | entityId, factors, score |

## Security Levels

| Level | Signing | Hashing | Use Case |
|-------|---------|---------|----------|
| `standard` | Ed25519 single signature | SHA-256 | Basic verifications |
| `enhanced` | Ed25519 with stricter validation | SHA-256 + Blake3 | Compliance, work sites |
| `military` | Multi-signature (Ed25519 + Secp256k1) | SHA-3 | Government, high-value |
| `quantum-resistant` | Multi-sig + quantum-resistant hashing | SHA-3 + SHAKE256 | Gold origin, critical |

## API Reference

### Certificates

| Function | Description |
|----------|------------|
| `createStandardCertificateData(input)` | Create standard certificate (single sig) |
| `createMilitaryGradeCertificateData(input)` | Create military-grade certificate (multi-sig) |
| `validateCertificateInput(input)` | Validate against template rules |
| `verifyCertificateStructure(cert)` | Verify certificate structure integrity |
| `getTemplate(id)` | Get certificate template by ID |

### QR Codes

| Function | Description |
|----------|------------|
| `createLocationQRData(certId, location, hash)` | QR data for location verification |
| `createPhotoQRData(certId, hash, location?)` | QR data for photo evidence |
| `createGoldLotQRData(certId, goldData, hash)` | QR data for gold lot |
| `createCertificateQRData(certData, hash)` | QR data for generic certificate |
| `createQRCodeStructure(data, size)` | Create QR structure for rendering |
| `verifyQRCodeData(data)` | Verify QR data structure |

### Proofs

| Function | Description |
|----------|------------|
| `createProofBundle(input)` | Create proof bundle from individual proofs |
| `createLocationProof(input)` | Create location proof reference |
| `createPhotoProof(input)` | Create photo proof reference |
| `createCryptographicProofRef(hash, sig, key)` | Create cryptographic proof reference |
| `createMerkleProofBundle(verifications)` | Create Merkle tree from verifications |
| `verifyMerkleInclusion(item, proof, root)` | Verify Merkle inclusion proof |
| `verifyProofBundleStructure(bundle)` | Verify bundle structural integrity |
| `serializeProofBundle(bundle)` | Export bundle as JSON |

## Platform Integration

### Mobile (React Native)

```typescript
import { createStandardCertificateData } from '@gtcx/verification';
import { mobileIdentity } from '@gtcx/mobile-shared';

export async function generateCertificate(input) {
  const certData = createStandardCertificateData(input);
  const signature = await mobileIdentity.sign(certData.dataToSign);
  const publicKey = await mobileIdentity.getPublicKey();

  return {
    ...certData,
    signature,
    verificationData: { publicKey, signature, timestamp: Date.now() },
  };
}
```

### Server (Node.js with HSM)

```typescript
import { createMilitaryGradeCertificateData } from '@gtcx/verification';
import { hsmSigner } from './hsm-integration';

export async function generateGovCertificate(input) {
  const certData = createMilitaryGradeCertificateData(input);
  const signatures = await hsmSigner.multiSign(certData.dataToSign);
  return { ...certData, signatures };
}
```

## Principle Alignment

| Principle | Implementation |
|-----------|---------------|
| P1 Package Structure | Certificates, QR, proofs are independent modules |
| P2 Type Safety | Zod validation on all certificate inputs and proof structures |
| P3 Modularity | Platform-agnostic data structures; signing delegated to adapters |
| P4 Composability | Any signing backend (SecureStore, HSM, software) works via injection |
| P6 Asset Abstraction | Templates are configurable; no hardcoded commodity logic |
| P8 Offline-First | All data structures generated locally; no network required |
| P9 Security | Multi-sig support, quantum-resistant hashing, Merkle proofs |

## Related

- [@gtcx/crypto](./crypto.md) — Underlying signing and hashing primitives
- [@gtcx/identity](./identity.md) — Identity creation and DID management (provides the keys used for signing)
- [Data Models](../specs/data-models.md) — `VerificationRecordSchema` and `AssetIdentitySchema` definitions
- [Security Framework](../specs/security-framework.md) — Security levels and cryptographic standards
