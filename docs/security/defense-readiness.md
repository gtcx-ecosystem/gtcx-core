---
title: 'Defense Readiness'
status: 'current'
date: '2026-05-17'
owner: 'crypto-security-engineer'
role: 'crypto-security-engineer'
tier: 'critical'
tags: ['docs', 'security']
review_cycle: 'quarterly'
---

# Defense Readiness Assessment — gtcx-core

**Version:** 1.0.0
**Date:** 2026-04-05
**Target:** S5 (Government) / S6 (Defense/Military)

---

## Air-Gap Capability

**Status: CAPABLE**

gtcx-core has no required internet connectivity. All cryptographic operations, validation, signing, verification, domain logic, and offline queuing work without network access.

### Network Egress Audit

| Component           | Outbound Connections                 | Required?                              | Air-Gap Safe?                                              |
| ------------------- | ------------------------------------ | -------------------------------------- | ---------------------------------------------------------- |
| @gtcx/crypto        | None                                 | N/A                                    | Yes                                                        |
| @gtcx/crypto-native | None (NAPI local FFI)                | N/A                                    | Yes                                                        |
| @gtcx/security      | None                                 | N/A                                    | Yes                                                        |
| @gtcx/identity      | DID resolution via `fetch()`         | No — adapter is injected, not built-in | Yes (use `InMemoryDIDCache` or `StaticDIDResolverAdapter`) |
| @gtcx/verification  | None                                 | N/A                                    | Yes                                                        |
| @gtcx/api-client    | HTTP to configured endpoints         | No — client is created by consumer     | Yes (use offline queue mode)                               |
| @gtcx/network       | libp2p peer-to-peer                  | No — transport is injected             | Yes (use `InMemoryTransport`)                              |
| @gtcx/domain        | None                                 | N/A                                    | Yes                                                        |
| @gtcx/events        | None                                 | N/A                                    | Yes                                                        |
| @gtcx/services      | None                                 | N/A                                    | Yes                                                        |
| @gtcx/sync          | None (sync adapter injected)         | N/A                                    | Yes                                                        |
| @gtcx/workproof     | None                                 | N/A                                    | Yes                                                        |
| @gtcx/logging       | None (outputs to configured handler) | N/A                                    | Yes                                                        |
| @gtcx/ai            | None (hooks only, no model calls)    | N/A                                    | Yes                                                        |
| @gtcx/connectivity  | None (detects local network state)   | N/A                                    | Yes                                                        |
| Rust crates         | None                                 | N/A                                    | Yes                                                        |

### Telemetry Audit

**No telemetry, beacons, or call-home behavior exists in any package.**

- `@gtcx/network` has a `TelemetryOptions` interface — this is an opt-in event handler that the consumer provides. No data is sent anywhere by default.
- `@gtcx/ai` defines tracing hooks — these are function callbacks, not external service calls.
- No analytics SDKs, no error reporting services, no usage tracking.

### Hardcoded External URLs

| URL                                                | Package                | Purpose                    | Air-Gap Impact                                     |
| -------------------------------------------------- | ---------------------- | -------------------------- | -------------------------------------------------- |
| `https://verify.gtcx.io`                           | verification, services | Default QR verify URL      | Configurable — override via `verifyBaseUrl`        |
| `https://www.w3.org/ns/did/v1`                     | identity               | W3C DID context (standard) | Embedded in DID documents as metadata, not fetched |
| `https://w3id.org/security/suites/ed25519-2020/v1` | identity               | W3C security context       | Same — metadata, not fetched                       |
| `https://www.w3.org/2018/credentials/v1`           | workproof              | W3C VC context             | Same — metadata, not fetched                       |
| `https://gtcx.io/credentials/workproof/v2.1`       | workproof              | GTCX VC context            | Same — metadata, not fetched                       |

All W3C URLs are JSON-LD context identifiers embedded in credential documents per W3C spec. They are not fetched at runtime.

---

## Supply Chain Provenance

### Software Bill of Materials (SBOM)

- **Format**: CycloneDX JSON
- **Generated**: Every CI build via Trivy
- **Artifact**: `trivy-sbom.cdx.json` (uploaded as GitHub Actions artifact)
- **Coverage**: All npm and Cargo dependencies

### Build Provenance

- **Manifest**: `artifacts/provenance-manifest.json`
- **Contents**: Git commit, branch, Node version, lock file hash, quality gate list, evidence artifact SHA-256 hashes
- **npm Provenance**: Release workflow publishes with `--provenance` flag (Sigstore-based SLSA provenance attestation)

### Dependency Pinning

| Layer                   | Strategy                       | Evidence                                                    |
| ----------------------- | ------------------------------ | ----------------------------------------------------------- |
| npm (security-adjacent) | Exact versions                 | `@noble/curves 1.9.0`, `@noble/hashes 1.8.0`, `zod 3.25.76` |
| npm (dev tooling)       | Caret ranges                   | Acceptable — dev deps don't ship to consumers               |
| Rust                    | Cargo.lock committed           | `rust/Cargo.lock`                                           |
| pnpm overrides          | Floor versions for CVE patches | `package.json` pnpm.overrides                               |

### Code Signing

- **npm packages**: Published with `--provenance` (SLSA v1.0 via Sigstore, verified on npmjs.com)
- **Git commits**: GPG signing recommended but not yet enforced (GitHub branch protection setting)
- **Rust crates**: Published via CI with `cargo publish` (crates.io verifies ownership)

---

## CMMC Level 2 Control Mapping

CMMC Level 2 maps to NIST SP 800-171 Rev 2. The following controls are implemented at the library level:

| CMMC Practice | NIST 800-171 | Implementation                                       | Evidence                                                              |
| ------------- | ------------ | ---------------------------------------------------- | --------------------------------------------------------------------- |
| AC.L2-3.1.1   | 3.1.1        | Authorized access enforcement via permission system  | `packages/security/src/auth/permissions.ts`                           |
| AC.L2-3.1.2   | 3.1.2        | Transaction types limited to permitted operations    | `packages/services/src/*.ts` (Zod validation)                         |
| AU.L2-3.3.1   | 3.3.1        | System event logging with typed event bus            | `packages/events/src/event-bus.ts`                                    |
| AU.L2-3.3.2   | 3.3.2        | Individual accountability via DID-based identity     | `packages/identity/src/did.ts`                                        |
| IA.L2-3.5.1   | 3.5.1        | User identification via cryptographic identity       | `packages/identity/src/identity.ts`                                   |
| IA.L2-3.5.2   | 3.5.2        | Authentication via Ed25519/Secp256k1 signatures      | `packages/crypto/src/signing.ts`                                      |
| IA.L2-3.5.3   | 3.5.3        | Multi-factor (multi-key) identity support            | `packages/identity/src/identity.ts:createEnhancedIdentity()`          |
| SC.L2-3.13.1  | 3.13.1       | Communication boundary monitoring via API client     | `packages/api-client/src/index.ts`                                    |
| SC.L2-3.13.8  | 3.13.8       | Cryptographic protection of CUI                      | `packages/crypto/src/signing.ts`, FIPS pathway defined                |
| SC.L2-3.13.11 | 3.13.11      | FIPS-validated crypto (pathway defined)              | `docs/security/fips-assessment.md`                                    |
| SI.L2-3.14.1  | 3.14.1       | Flaw identification via automated scanning           | `.github/workflows/ci.yml` (Trivy)                                    |
| SI.L2-3.14.2  | 3.14.2       | Malicious code protection (deny unsafe_code in Rust) | All 6 Rust crate lib.rs files                                         |
| SI.L2-3.14.3  | 3.14.3       | Security alert monitoring via CVE scanning           | `pnpm audit`, `.github/workflows/ci.yml`                              |
| SI.L2-3.14.6  | 3.14.6       | Input validation at system boundaries                | `packages/domain/src/schemas.ts`, `packages/security/src/validation/` |

### CMMC Controls Not Applicable at Library Level

Controls requiring organizational, physical, or infrastructure implementation:

- AM (Asset Management), AT (Awareness & Training), CM (Configuration Management beyond code), IR (Incident Response beyond SECURITY.md), MA (Maintenance), MP (Media Protection), PE (Physical), PS (Personnel), RE (Recovery), RM (Risk Management)

---

## Disconnected Operation Mode

For air-gapped deployments, downstream platforms should:

1. **Pre-load** jurisdiction configs via `@gtcx/jurisdiction-config` (no runtime fetch)
2. **Use** `InMemoryDIDCache` with pre-populated DID documents instead of HTTP resolution
3. **Use** `InMemoryTransport` for `@gtcx/network` (or local mesh network)
4. **Set** `GTCX_REQUIRE_NATIVE=true` to ensure Rust bindings are loaded (no fallback to JS)
5. **Configure** `@gtcx/api-client` in offline-queue mode (operations queued until sync)
6. **Override** `verifyBaseUrl` to local verification endpoint

All packages function without modification in disconnected environments.

---

## Remaining Gaps for S6

| Gap                                   | Severity | Fix                                                    | Effort | Status                                                                                                                                                                                                                      |
| ------------------------------------- | -------- | ------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FIPS mode flag not yet implemented    | High     | Add `GTCX_FIPS_MODE` env var to switch crypto defaults | M      | Resolved — `GTCX_FIPS_MODE=true` routes through `fips-backend.ts` (node:crypto P-256). Dedicated test suite added.                                                                                                          |
| No DISA STIG compliance documentation | High     | Map STIGs to library controls                          | L      | Resolved — 27 controls mapped in `stig-compliance.md`. 0 CAT I/II/III findings. App Security V5R3 + Node.js + Rust STIGs.                                                                                                   |
| No code signing on Git commits        | Medium   | Enable GPG signing in branch protection                | XS     | Open — configure with `git config commit.gpgsign true`                                                                                                                                                                      |
| ZKP verification is placeholder       | Medium   | Wire Rust arkworks via NAPI or document as non-CUI     | L      | Documented — `HashCommitmentZkpEngine` is explicitly marked non-production. ZKP is supplementary to FIPS crypto, not on the CUI verification path. Rust `gtcx-zkp` (Groth16/Bulletproofs) production-ready for NAPI wiring. |
| No ITAR assessment                    | Low      | Assess dual-use classification of crypto exports       | S      | Open                                                                                                                                                                                                                        |

---

## References

- CMMC Model v2.0 — Cybersecurity Maturity Model Certification
- NIST SP 800-171 Rev 2 — Protecting Controlled Unclassified Information
- NIST SP 800-53 Rev 5 — Security and Privacy Controls
- DISA STIG Viewer — Security Technical Implementation Guides
- `docs/security/fips-assessment.md`
- `docs/security/nist-800-53-mapping.md`
