---
title: 'External Penetration Test Scope'
status: current
date: 2026-05-27
owner: gtcx-core
role: crypto-security-engineer
tier: critical
tags: ['documentation', 'security', 'pen-test']
review_cycle: on-change
---

# External Penetration Test Scope

Purpose: define a bank-grade third-party penetration test scope for
`gtcx-core`, aligned to what this repo actually is: a cryptographic foundation
library, not a deployed service.

## Scope summary

`gtcx-core` is consumed as library code by downstream GTCX repos. The test
should focus on trust-bearing library surfaces, supply-chain integrity, and
unsafe failure modes, not infrastructure or product-UI issues that belong to
deploying systems.

## In scope

| Area                                        | Why it matters                                                              | Primary evidence                                                                                              |
| ------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Cryptographic signing surfaces              | Signature forgery and malformed-input handling are consequential            | `packages/crypto/`, `rust/gtcx-crypto/`, `docs/security/attack-tree-signing.md`                               |
| Verification and certificate flow           | Verification decisions and revocation behavior are trust-bearing            | `packages/verification/`, `docs/security/internal-security-assessment.md`                                     |
| Native binding boundary                     | JS -> Rust boundary is memory- and input-safety sensitive                   | `rust/gtcx-node/`, `docs/security/native-binding-audit-checklist.md`                                          |
| Key management abstractions                 | HSM / PKCS#11 / cloud-KMS lifecycle semantics matter to institutional users | `rust/gtcx-crypto/src/keystore.rs`, `docs/security/pkcs11-keystore.md`, `docs/security/cloud-kms-keystore.md` |
| Supply chain and build provenance           | Library trust depends on tamper-evident build and dependency integrity      | `.github/workflows/`, `artifacts/provenance-manifest.json`, `docs/security/slsa-attestation.md`               |
| Observability redaction and trust telemetry | Trace output must not leak secrets or create false trust signals            | `packages/ai/`, `docs/governance/trust-portal.md`                                                             |

## Explicit test objectives

1. Attempt malformed-input and boundary abuse across public cryptographic APIs.
2. Attempt signature-verification bypass through encoding and edge-case inputs.
3. Review certificate verification flow for revocation bypass and stale-proof acceptance.
4. Review native binding error handling for panic, memory, and length-validation issues.
5. Review build, release, and provenance controls for supply-chain tampering paths.
6. Review keystore lifecycle semantics for state confusion, downgrade, and destroy/rotate misuse.

## Out of scope

These items are intentionally excluded because they are not owned by
`gtcx-core` itself:

| Area                                            | Reason                                       |
| ----------------------------------------------- | -------------------------------------------- |
| Cloud account posture, VPC topology, IAM sprawl | Infrastructure and deployment responsibility |
| Kubernetes, Helm, service mesh, DNS, WAF        | Downstream runtime responsibility            |
| Mobile camera / GPS capture paths               | Owned by `gtcx-mobile` and product repos     |
| Web UI, browser XSS, CSRF, session management   | No UI or service surface exists in this repo |
| Social engineering or physical intrusion        | Outside repo scope                           |

## Required tester context

Read these first:

1. [Threat model](./threat-model.md)
2. [Attack tree for signing](./attack-tree-signing.md)
3. [Internal security assessment](./internal-security-assessment.md)
4. [Native binding safety audit checklist](./native-binding-audit-checklist.md)
5. [SLSA attestation](./slsa-attestation.md)
6. [Trust portal](../governance/trust-portal.md)

## Expected deliverables

The engagement is only considered complete when it produces:

- an executive summary,
- a finding list with severity and reproduction guidance,
- an explicit in-scope / out-of-scope statement,
- remediation recommendations tied to file paths or controls,
- retest confirmation for remediated high findings.

## Severity handling

- Critical / High findings block any 10/10 claim until closed or explicitly accepted.
- Medium findings require a tracked remediation item in `docs/remediation/remediation-plan.md`.
- Low findings are still logged and linked in the trust portal.

## Success criteria

The scope is fit for Sprint 1 when:

- a vendor can quote against it without a discovery call,
- every scope item maps to a real repo surface,
- no service-runtime scope is incorrectly attributed to this library repo.
