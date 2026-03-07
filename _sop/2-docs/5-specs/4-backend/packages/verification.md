# Package Spec — `@gtcx/verification`

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge.

---

## Purpose

Universal, commodity-agnostic verification infrastructure for the GTCX protocol. Generates certificates, QR codes, and proof bundles that can be signed by platform-specific crypto (mobile SecureStore, Web Crypto API, server-side Node.js). Provides traced variants of all operations for AI observability.

**Key design principle:** Commodities are attributes, not types. The same certificate templates work for gold, cocoa, cobalt, coffee, or any commodity. Template selection and commodity metadata are input parameters, not package branches.

---

## Architecture

This package is the universal (platform-agnostic) layer in a three-tier stack:

| Layer        | Location                            | Responsibility                                  |
| ------------ | ----------------------------------- | ----------------------------------------------- |
| Universal    | `@gtcx/verification` (this package) | Certificate and proof data structure generation |
| Mobile       | `apps/mobile/shared/crypto/`        | SecureStore, Expo signing integration           |
| Web / Server | `apps/web/shared/`, `services/`     | Web Crypto API / Node.js signing integration    |

This package generates the _data to sign_ — it does not sign. Platform layers sign the output using their crypto access.

---

## Public API

### Types (`src/types/`)

Commodity-agnostic abstractions for:

- Certificate templates and certificate instances
- Asset lot data (commodity type, weight, unit, origin)
- QR code payloads
- Proof bundles
- Verification workflow inputs/outputs

### Certificate Generation (`src/certificates/`)

| Export                                   | Description                                                         |
| ---------------------------------------- | ------------------------------------------------------------------- |
| `createStandardCertificateData(options)` | Generate unsigned certificate data for any commodity                |
| Certificate template types               | Typed inputs per certificate category (origin, quality, compliance) |

### QR Code Generation (`src/qr/`)

| Export                                          | Description                        |
| ----------------------------------------------- | ---------------------------------- |
| `createAssetLotQRData(certId, assetData, hash)` | Create QR payload for an asset lot |
| QR data types                                   | Typed QR payload shapes            |

### Proof Bundling (`src/proofs/`)

| Export                       | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `createProofBundle(options)` | Bundle cryptographic proofs with certificate data |
| Proof bundle types           | Typed proof bundle shapes                         |

### Traced API (`src/traced.ts`)

| Export                              | Description                                          |
| ----------------------------------- | ---------------------------------------------------- |
| `tracedGenerateCertificate(input)`  | Certificate generation with structured operation log |
| `tracedVerifyCertificate(input)`    | Certificate verification with log                    |
| `tracedGenerateQRCode(input)`       | QR generation with log                               |
| `tracedVerifyQRCode(input)`         | QR verification with log                             |
| `tracedCreateProofBundle(input)`    | Proof bundling with log                              |
| `tracedVerificationWorkflow(input)` | Full workflow with log                               |
| `logComplianceEvent(event)`         | Emit a structured compliance event                   |
| `logGCICalculation(input, result)`  | Emit a GCI calculation log entry                     |
| `computeVerificationSummary(logs)`  | Aggregate operation logs into a summary              |
| `VerificationOperationLog`          | Type                                                 |
| `VerificationSummary`               | Type                                                 |

---

## Certificate Template IDs

| Template ID            | Use Case                                                      |
| ---------------------- | ------------------------------------------------------------- |
| `asset-origin`         | Verifies provenance — where and by whom an asset was produced |
| `quality-grade`        | Verifies quality thresholds for a commodity lot               |
| `compliance-clearance` | Attests regulatory compliance for export/import               |
| `chain-of-custody`     | Records a custody transfer event                              |

---

## Dependencies

| Dependency                   | Role                                              |
| ---------------------------- | ------------------------------------------------- |
| `@gtcx/crypto` `workspace:*` | Hashing for proof generation, `constantTimeEqual` |
| `@gtcx/types` `workspace:*`  | Shared protocol types                             |
| `zod` `^3.23.0`              | Certificate and QR payload validation             |
| `@gtcx/ai` (peer)            | Tracing and observability                         |
| `@noble/hashes` (peer)       | Supplemental hashing where native is unavailable  |
| `@noble/curves` (peer)       | Supplemental signature verification               |

---

## Non-Goals

- Does not sign certificates — platform layers (mobile, web, server) sign using their crypto access
- Does not manage identity — that is `@gtcx/identity`
- Does not define protocol-level compliance rules — those are configured by consuming services
- Does not store or retrieve certificates — storage is a platform concern

---

## Security Constraints

- Certificate data returned by `createStandardCertificateData` must be signed immediately before being stored or transmitted — unsigned certificate data is not a valid certificate
- Proof bundle verification must use `constantTimeEqual` for all hash comparisons
- QR payload encoding must preserve all integrity fields; truncating a QR payload invalidates the proof
- `tracedVerifyCertificate` results must be checked — do not silently pass failed verification

---

## Implementation

`packages/verification/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/crypto.md`](./crypto.md) — cryptographic primitives
- [`_sop/2-docs/5-specs/4-backend/packages/identity.md`](./identity.md) — identity used in certificate signing
- [`_sop/2-docs/3-engineering/7-security/security-framework.md`](../../../3-engineering/7-security/security-framework.md) — security framework
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview
