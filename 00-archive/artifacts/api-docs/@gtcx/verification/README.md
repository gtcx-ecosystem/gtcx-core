[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/verification

# @gtcx/verification

Certificate generation, QR codes, and cryptographic proof bundles.

## Installation

```bash
pnpm add @gtcx/verification
```

## Quick Start

```typescript
import { validateCertificateInput, createStandardCertificateData } from '@gtcx/verification';
import { createProofBundle, verifyProofBundleStructure } from '@gtcx/verification';

const input = {
  templateId: 'location',
  location: { latitude: 6.2, longitude: -1.6, accuracy: 5, timestamp: Date.now() },
  userRole: 'inspector',
  deviceId: 'dev-001',
};
const validation = validateCertificateInput(input);
const certData = createStandardCertificateData(input);
```

## Sub-exports

| Path                              | Description                           |
| --------------------------------- | ------------------------------------- |
| `@gtcx/verification/certificates` | Certificate generation and validation |
| `@gtcx/verification/qr`           | QR code data encoding/parsing         |
| `@gtcx/verification/proofs`       | Proof bundle creation/verification    |

## API

| Export                                 | Description                |
| -------------------------------------- | -------------------------- |
| `validateCertificateInput(input)`      | Validate certificate input |
| `createStandardCertificateData(input)` | Create certificate data    |
| `verifyCertificateStructure(cert)`     | Structural verification    |
| `createLocationQRData(id, loc, hash)`  | Location QR data           |
| `serializeQRData(data)`                | Serialize QR payload       |
| `parseQRData(raw)`                     | Parse QR string            |
| `createProofBundle(input)`             | Create proof bundle        |
| `verifyProofBundleStructure(bundle)`   | Verify bundle structure    |

## Related

- [Architecture Decision Records](../../_media/README.md)

## License

MIT

## Modules

- [](README.md)
- [certificates](certificates/README.md)
- [proofs](proofs/README.md)
- [qr](qr/README.md)
