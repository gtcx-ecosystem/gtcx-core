# @gtcx/verification

Certificate, QR code, and proof-bundle helpers for GTCX. Generates platform-agnostic data structures that are signed externally and stored by runtime adapters.

## Scope

- Certificate template generation
- QR payload structures
- Proof bundle creation and structural validation
- Traced variants for observability

## Key Exports (`packages/verification/src/index.ts`)

| Export                               | Description                               |
| ------------------------------------ | ----------------------------------------- |
| `createStandardCertificateData`      | Standard certificate template             |
| `createMilitaryGradeCertificateData` | Military-grade certificate template       |
| `createAssetLotQRData`               | QR payload for asset lots                 |
| `createLocationQRData`               | QR payload for location attestation       |
| `createCertificateQRData`            | QR payload for certificate references     |
| `createProofBundle`                  | Assembles a proof bundle from inputs      |
| `verifyProofBundleStructure`         | Structural validation (not cryptographic) |
| `tracedGenerateCertificate`          | Traced certificate generation             |
| `tracedGenerateQRCode`               | Traced QR generation                      |
| `tracedCreateProofBundle`            | Traced proof bundle assembly              |

## Notes

- This package does not sign data — signatures are provided by `@gtcx/crypto` or native backends.
- Certificate templates are commodity-agnostic; commodity data is an attribute.
- `verifyProofBundleStructure` validates shape only; cryptographic proof verification is handled by the caller.

## References

- `../../../engineering/security/security-framework.md`
- `../../../engineering/security/threat-control-matrix.md`
