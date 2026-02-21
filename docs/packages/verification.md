# @gtcx/verification

Certificate, QR, and proof‑bundle helpers for GTCX. Generates platform‑agnostic data structures that can be signed and stored by runtime adapters.

## Scope

- Certificate templates + generation helpers
- QR payload structures
- Proof bundling for verification workflows
- Traced variants for observability

## Key Exports

From `packages/verification/src/index.ts`:

- `createStandardCertificateData`, `createMilitaryGradeCertificateData`
- `createAssetLotQRData`, `createLocationQRData`, `createCertificateQRData`
- `createProofBundle`, `verifyProofBundleStructure`
- Traced helpers: `tracedGenerateCertificate`, `tracedGenerateQRCode`, `tracedCreateProofBundle`

## Notes

- This package does not sign data; provide signatures from `@gtcx/crypto` or native backends.
- Certificate templates are commodity‑agnostic; commodity data is an attribute.

## References

- `docs/specs/security-framework.md`
- `packages/verification/src/index.ts`
