---
title: 'Package Spec — `@gtcx/verification`'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

---

title: 'Verification'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/verification`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Security-sensitive — all changes require Cryptographic Security Engineer co-review and human approval before merge.

---

## Purpose

Universal, commodity-agnostic verification infrastructure for the GTCX protocol. Generates certificates, QR codes, and proof bundles for downstream consumers, and provides traced variants that can perform real signing and cryptographic verification when keys are supplied. Provides traced variants of all operations for AI observability.

**Key design principle:** Commodities are attributes, not types. The same certificate templates work for gold, cocoa, cobalt, coffee, or any commodity. Template selection and commodity metadata are input parameters, not package branches.

---

## Architecture

This package is the universal (platform-agnostic) layer in a three-tier stack:

| Layer        | Location                            | Responsibility                                  |
| ------------ | ----------------------------------- | ----------------------------------------------- |
| Universal    | `@gtcx/verification` (this package) | Certificate and proof data structure generation |
| Mobile       | `apps/mobile/shared/crypto/`        | SecureStore, Expo signing integration           |
| Web / Server | `apps/web/shared/`, `services/`     | Web Crypto API / Node.js signing integration    |

Base certificate-generation APIs create unsigned certificate structures. Traced APIs additionally support real signing and verification through `@gtcx/crypto` when the caller provides keys.

---

## Public API

### Types (`03-platform/src/types/`)

Commodity-agnostic abstractions for:

- Certificate templates and certificate instances
- Asset lot data (commodity type, weight, unit, origin)
- QR code payloads
- Proof bundles
- Verification workflow inputs/outputs

### Certificate Generation (`03-platform/src/certificates/`)

| Export                                      | Description                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `createStandardCertificateData(options)`    | Generate unsigned standard certificate data for any commodity                  |
| `createMilitaryGradeCertificateData(input)` | Generate unsigned military-grade certificate data for high-assurance templates |
| `validateCertificateInput(input)`           | Validate template-specific required fields and rules                           |
| Certificate template types                  | Typed inputs per certificate category (origin, location, compliance, custody)  |

### QR Code Generation (`03-platform/src/qr/`)

| Export                                          | Description                        |
| ----------------------------------------------- | ---------------------------------- |
| `createAssetLotQRData(certId, assetData, hash)` | Create QR payload for an asset lot |
| QR data types                                   | Typed QR payload shapes            |

### Proof Bundling (`03-platform/src/proofs/`)

| Export                       | Description                                       |
| ---------------------------- | ------------------------------------------------- |
| `createProofBundle(options)` | Bundle cryptographic proofs with certificate data |
| Proof bundle types           | Typed proof bundle shapes                         |

### Traced API (`03-platform/src/traced.ts`)

| Export                              | Description                                                            |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `tracedGenerateCertificate(input)`  | Certificate generation plus real signing with structured operation log |
| `tracedVerifyCertificate(input)`    | Cryptographic certificate verification with log                        |
| `tracedGenerateQRCode(input)`       | QR generation with log                                                 |
| `tracedVerifyQRCode(input)`         | QR verification with log                                               |
| `tracedCreateProofBundle(input)`    | Proof bundling with log                                                |
| `tracedVerificationWorkflow(input)` | Full workflow with log                                                 |
| `logComplianceEvent(event)`         | Emit a structured compliance event                                     |
| `logGCICalculation(input, result)`  | Emit a GCI calculation log entry                                       |
| `computeVerificationSummary(logs)`  | Aggregate operation logs into a summary                                |
| `VerificationOperationLog`          | Type                                                                   |
| `VerificationSummary`               | Type                                                                   |

---

## Certificate Template IDs

| Template ID             | Use Case                                                      |
| ----------------------- | ------------------------------------------------------------- |
| `asset-origin`          | Verifies provenance — where and by whom an asset was produced |
| `work-site`             | Daily check-in and work-site verification                     |
| `government-inspection` | High-assurance inspection and regulatory oversight            |
| `location`              | Standard location verification                                |
| `photo`                 | Photo evidence bound to verified location                     |
| `compliance`            | Regulatory compliance verification                            |
| `custody-transfer`      | Custody transfer evidence and chain-of-custody event          |
| `settlement`            | PvP settlement verification                                   |

---

## Dependencies

| Dependency                   | Role                                                           |
| ---------------------------- | -------------------------------------------------------------- |
| `@gtcx/crypto` `workspace:*` | Signing, signature verification, hashing, and integrity checks |
| `@gtcx/types` `workspace:*`  | Shared protocol and certificate-related types                  |
| `zod` `3.25.x`               | Certificate and QR payload validation                          |
| `@gtcx/ai` (peer, optional)  | Tracing and observability hooks                                |

---

## Non-Goals

- Base certificate-generation APIs do not sign certificates; they return unsigned structures for callers that need custom signing flows
- Does not manage identity — that is `@gtcx/identity`
- Does not define protocol-level compliance rules — those are configured by consuming services
- Does not store or retrieve certificates — storage is a platform concern

---

## Security Constraints

- Certificate data returned by `createStandardCertificateData` or `createMilitaryGradeCertificateData` must be signed before being stored or transmitted as a trusted artifact
- Proof bundle verification must use `constantTimeEqual` for all hash comparisons
- QR payload encoding must preserve all integrity fields; truncating a QR payload invalidates the proof
- `tracedVerifyCertificate` results must be checked — do not silently pass failed cryptographic verification

---

## Implementation

`03-platform/packages/verification/03-platform/src/`

---

## Reference

- [`01-docs/specs/03-platform/packages/crypto.md`](./crypto.md) — cryptographic primitives
- [`01-docs/specs/03-platform/packages/identity.md`](./identity.md) — identity used in certificate signing
- [`01-docs/09-security/security-framework.md`](../../security/security-framework.md) — security framework
- [`01-docs/specs/core-spec.md`](../core-spec.md) — system overview
