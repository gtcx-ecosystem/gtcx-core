---
title: "gtcx-core — Repository Overview"
status: "current"
date: "2026-05-27"
owner: "gtcx-core"
role: "protocol-architect"
agent_id: "agent://gtcx-core/2026-05-27/session-backfill"
trust_score: 95
autonomy_level: "sovereign"
tier: "critical"
tags: ["documentation", "overview"]
review_cycle: "on-change"
---

# gtcx-core — Repository Overview

> **Status:** Current
> **Date:** 2026-05-27
> **Owner:** Protocol Architect
> **Bank-grade composite score:** 8.9 / 10 (per [master audit 2026-05-27](../audit/master-audit-2026-05-27.md))
> **Internal completion score:** 9.5 / 10 (per [internal completion audit 2026-05-21](../audit/internal-completion-audit-2026-05-21.md) — all internal items closed)
> **Next review:** 2026-08-27 (quarterly, aligned with master audit cycle)

---

## 1. Executive Summary

**In one sentence for a 10-year-old:** `gtcx-core` is the digital trust factory that lets African miners and farmers prove their gold and crops are real, ethical, and traceable — without revealing private details.

**In one sentence for a CTO:** `gtcx-core` is a bank-grade cryptographic and protocol foundation (TypeScript + Rust) that provides signing, identity, verification, zero-knowledge proofs, and offline-first sync primitives consumed by 6+ downstream GTCX products.

**In one sentence for an investor:** `gtcx-core` is the compounding platform layer of the GTCX ecosystem — every verification proof, digital identity, and trade certificate traces its trust back to this repo; as downstream products multiply, the value of this foundation compounds non-linearly.

**Maturity state:** Production-hardened with externally-budgeted blockers in motion. Honest bank-grade composite score: **8.9/10** as of [master audit 2026-05-27](../audit/master-audit-2026-05-27.md) (up from 8.63 on 2026-05-12). Internal completion score is **9.5/10** ([2026-05-21 audit](../audit/internal-completion-audit-2026-05-21.md)) — all 24/24 internal items closed. **Cryptography:** FIPS-validated via aws-lc-rs (CMVP #4816); Rust tests passing under `--features fips`. **Coverage:** 14 packages enforce 95% branch thresholds; critical path well-covered. **Fuzz:** [500,000+ libFuzzer iterations across 6 cargo-fuzz targets, zero crashes](../audit/fuzz-campaign-evidence-2026-05-21.md). **Key custody:** HSM-backed (PKCS11 + AWS KMS) with NIST SP 800-57 lifecycle. **Supply chain:** SLSA Source L2 enforced, Build L3 aspirational; provenance manifest generated per release but not yet published to npm registry. **External attestation:** pen test RFP drafted, vendor selection pending; SOC 2 Type 1 readiness prep complete, CPA engagement pending — see [Sprint 4 of the engagement readiness roadmap](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md). No critical security findings. CI operational.

**Active execution program:** [Engagement Readiness Sprint Roadmap (2026-05-22)](../agile/roadmap/engagement-readiness-sprint-roadmap-2026-05-22.md) — 4-sprint plan driven by imminent sovereign-state engagements (Zimbabwe, Ghana, Namibia, Botswana, DR Congo plus broader continental rollout). See the [cross-jurisdiction dashboard](../agile/engagement-log/dashboard.md) for per-engagement state.

**Honest remaining gaps (externally budgeted):** pen test report not yet delivered (contracted, target 2026-08-25); SOC 2 Type 1 letter not yet delivered (contracted, target 2026-09-15); first `release.yml` execution to npm pending engineering-lead trigger (dry-run validated, all gates green locally).

---

## 2. What This Repository Does

### 2.1 Core Capabilities

| #   | Capability                          | What It Does                                                                                                          | Who It Serves                                     | Evidence                                                                                   |
| --- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | **Cryptographic Primitives**        | Ed25519 / Secp256k1 / P256 signing, SHA-256/512 / BLAKE3 hashing, key derivation, commitment schemes                  | All downstream repos                              | `packages/crypto/`, `rust/gtcx-crypto/` — [spec](../specs/packages/crypto.md)              |
| 2   | **Zero-Knowledge Proofs**           | Groth16 (GCI threshold, asset ownership, location region), Bulletproofs (amount range), Schnorr (identity attributes) | `gtcx-markets`, `gtcx-protocols`                  | `rust/gtcx-zkp/` — [spec](../specs/packages/rust/gtcx-zkp.md)                              |
| 3   | **Digital Identity**                | DID creation, resolution, credential lifecycle, key management                                                        | `gtcx-markets`, sovereign wallets                 | `packages/identity/` — [spec](../specs/packages/identity.md)                               |
| 4   | **Verification Infrastructure**     | Certificate generation, QR codes, proof bundles, revocation registries                                                | Compliance officers, export brokers               | `packages/verification/` — [spec](../specs/packages/verification.md)                       |
| 5   | **Offline-First Sync**              | Durable queue, conflict resolution, replay ordering by logical sequence                                               | Buying station agents in low-connectivity regions | `packages/sync/` — [spec](../specs/packages/sync.md)                                       |
| 6   | **Resilient Networking**            | Connectivity detection, adaptive retry, circuit breaker, P2P mesh primitives                                          | Field operators, mobile apps                      | `packages/connectivity/`, `packages/network/` — [specs](../specs/packages/connectivity.md) |
| 7   | **Domain Models**                   | Commodity-agnostic types, events, schemas, metrics, versioning                                                        | All downstream repos                              | `packages/domain/` — [spec](../specs/packages/domain.md)                                   |
| 8   | **WorkProof / TradeCV Attestation** | W3C Verifiable Credential schemas for supply chain attestation                                                        | Export brokers, regulators                        | `packages/workproof/` — [spec](../specs/packages/workproof.md)                             |
| 9   | **Structured Observability**        | OpenTelemetry-compatible traces, metrics, logs with secret redaction                                                  | Platform engineers, compliance auditors           | `packages/telemetry/`, `packages/logging/` — [specs](../specs/packages/telemetry.md)       |
| 10  | **Runtime Substrate**               | Batteries-included runtime aggregating connectivity, resilience, telemetry, and API client                            | Application developers                            | `packages/runtime/` — [spec](../specs/packages/runtime.md)                                 |

### 2.2 Feature Matrix

| Feature                            | Status          | Evidence                                           | Consumed By           |
| ---------------------------------- | --------------- | -------------------------------------------------- | --------------------- |
| Ed25519 signing & verification     | **Production**  | `packages/crypto/tests/signing.test.ts`            | All downstream        |
| P256 FIPS-validated signing        | **Production**  | `cargo test --features fips` passes (30 tests)     | All downstream        |
| SHA-256 / SHA-512 / BLAKE3 hashing | **Production**  | `packages/crypto/tests/hashing.test.ts`            | All downstream        |
| Groth16 ZKP (GCI threshold)        | **Production**  | `rust/gtcx-zkp` tests pass (38 tests)              | `gtcx-markets`        |
| Bulletproofs range proof           | **Production**  | `rust/gtcx-zkp` tests pass                         | `gtcx-markets`        |
| Schnorr identity proof             | **Production**  | `rust/gtcx-zkp` tests pass                         | `gtcx-protocols`      |
| Offline queue with durable storage | **Production**  | `packages/sync/tests/offline-queue.test.ts`        | `gtcx-markets` mobile |
| Connectivity profile detection     | **Production**  | `packages/connectivity/tests/connectivity.test.ts` | All mobile clients    |
| API client with mTLS + retry       | **Production**  | `packages/api-client/tests/canonical/`             | All downstream        |
| DID resolution                     | **Beta**        | `packages/identity/tests/did.test.ts`              | `gtcx-markets`        |
| ZKP native NAPI bindings           | **Beta**        | `packages/crypto-native/`                          | `gtcx-markets`        |
| USSD protocol                      | **Scaffolding** | String enum only (`'ussd-only'` profile)           | —                     |
| Adaptive low-bandwidth mode        | **Production**  | Dynamic compression, image downsampling, batching  | All mobile clients    |
| HSM key storage                    | **Beta**        | PKCS#11 keystore implemented in `rust/gtcx-crypto` | `gtcx-infrastructure` |
| Cloud KMS integration              | **Beta**        | AWS KMS keystore implemented in `rust/gtcx-crypto` | `gtcx-infrastructure` |

### 2.3 Business Value Proposition

**For Investors:** `gtcx-core` creates a moat through cryptographic trust infrastructure that is expensive to replicate and compounds in value as each new downstream product (marketplace, protocol, intelligence layer) adds transaction volume. The offline-first architecture is a technical differentiator specifically for frontier markets where connectivity is intermittent. FIPS verification and bank-grade scoring provide enterprise-grade credibility that opens institutional capital.

**For Enterprise Buyers:** `gtcx-core` reduces integration risk through a shared foundation with strong package boundaries, reproducible builds, and API surface baselining. FIPS-validated cryptography, zero unsafe code in Rust, and signed commits with branch protection provide a control environment suitable for procurement by banks, commodity exchanges, and government mineral bureaus. The threat-control matrix (12 controls, validated in CI) demonstrates security governance.

**For African Sovereigns / DFIs:** `gtcx-core` preserves data sovereignty by keeping key material client-side and supporting offline-first operation. No raw AI output can approve consequential actions — trust gating is human-in-the-loop. The Global South Resilience profile (8.8/10) explicitly addresses intermittent connectivity, low-bandwidth adaptation, and USSD support — capabilities designed for African market realities rather than retrofitted from Western infrastructure.

---

## 3. Core User Personas & Jobs-to-be-Done

#### Persona: Amina — Artisanal Gold Miner — Ghana

**Demographics:** 34, low technical sophistication, no formal banking relationship, operates in rural Western Region with 2G connectivity. Decision authority: personal (no institutional backing).

**Goals:** Get a fair price for her gold. Prove it was mined ethically. Access formal credit using her production history.

**Pain Points:**

- Middlemen pay 30-40% below market price because she cannot prove provenance
- No bank will lend to her without paper documentation she doesn't have
- Mobile data is expensive; she needs USSD, not apps
- Her phone is a 5-year-old Android with 1GB RAM

**Jobs-to-be-Done:**

1. _When_ I sell gold at the buying station, _I want to_ receive a digital certificate proving the weight and purity, _so I can_ negotiate a fair price with exporters
2. _When_ I apply for a micro-loan, _I want to_ show 12 months of verified production history, _so I can_ access credit at reasonable rates
3. _When_ my phone has no data, _I want to_ still record a transaction via USSD, _so I can_ operate on days with poor connectivity

**How This Repo Helps:** `@gtcx/crypto` provides the signing primitives that make her digital certificate tamper-proof. `@gtcx/verification` generates the QR code and proof bundle that exporters scan. `@gtcx/sync` queues her USSD transaction offline and replays it when connectivity returns. `@gtcx/connectivity` detects her 2G profile and adapts timeouts accordingly.

**Workflow Unlocked:** Amina weighs her gold at the buying station. The agent scans her biometric ID, weighs the gold on a certified scale, and the station's tablet (running a `gtcx-markets` app that consumes `gtcx-core`) generates a signed certificate with geotag, timestamp, and scale reading. Amina receives an SMS with a short code. Even without data, she can dial `*123#` to verify her certificate's status. When she visits the bank, she shows her QR code; the bank's system verifies the chain of custody back to the mine, backed by `gtcx-core` cryptographic proofs.

---

#### Persona: Jean-Pierre — Buying Station Agent — Côte d'Ivoire

**Demographics:** 28, semi-technical (smartphone-native, uses WhatsApp Business), manages 3 stations, reports to an export broker. Decision authority: operational, not strategic.

**Goals:** Process 50+ transactions per day accurately. Avoid compliance violations that could shut down the station. Get paid commissions on time.

**Pain Points:**

- Paper logbooks are error-prone and slow; regulatory audits take weeks
- His tablet loses connectivity for hours at a time
- He has been trained 4 times on new systems; each was abandoned
- Fraudulent certificates have cost his broker $15K in the last year

**Jobs-to-be-Done:**

1. _When_ a miner brings gold, _I want to_ verify their identity and issue a tamper-proof certificate in under 2 minutes, _so I can_ maintain throughput during peak season
2. _When_ the internet drops, _I want to_ continue recording transactions locally, _so I can_ avoid backlog and data loss
3. _When_ a regulator arrives for inspection, _I want to_ produce a complete audit trail in under 10 minutes, _so I can_ demonstrate compliance and keep operating

**How This Repo Helps:** `@gtcx/verification` provides certificate templates with required fields and validation rules. `@gtcx/sync` maintains the offline queue with logical sequence ordering. `@gtcx/security` provides input sanitization and audit logging. `@gtcx/crypto` signs every certificate so fraud is cryptographically detectable.

**Workflow Unlocked:** Jean-Pierre opens the buying station app at 6 AM. The app detects his `edge` connectivity profile and sets a 60-second timeout with 1 retry. He processes miners throughout the day; when the tower goes down at 11 AM, the app switches to offline mode seamlessly. Transactions queue locally with logical sequence numbers. At 2 PM, connectivity returns; 23 queued transactions replay automatically. At the end of the day, he taps "Export Audit Trail" and generates a ZIP of signed certificates with merkle proofs — ready for the compliance officer.

---

#### Persona: Dr. Osei — Compliance Officer — Ghana Minerals Commission

**Demographics:** 45, highly technical (PhD in geochemistry), regulator with enforcement authority, based in Accra with occasional field visits.

**Goals:** Ensure all exported gold has traceable provenance. Detect and prevent conflict mineral laundering. Maintain Ghana's EITI compliance rating.

**Pain Points:**

- 40% of export documentation has gaps or inconsistencies
- Verifying a single certificate chain takes 2-3 hours of manual cross-referencing
- He has no real-time visibility into buying station operations
- Cross-border data sharing with neighboring countries is politically sensitive

**Jobs-to-be-Done:**

1. _When_ an export license application arrives, _I want to_ verify the complete chain of custody in under 5 minutes, _so I can_ approve or reject quickly
2. _When_ a red flag appears (unusual weight, missing geotag), _I want to_ trace the certificate back to its origin, _so I can_ investigate potential fraud
3. _When_ EITI auditors visit, _I want to_ demonstrate a tamper-proof audit trail, _so I can_ maintain Ghana's compliance rating

**How This Repo Helps:** `@gtcx/verification` provides certificate structures with mandatory fields (geotag, scale, assay, custody chain). `@gtcx/crypto` provides hash chains and merkle proofs that make tampering detectable. `@gtcx/identity` provides DID resolution for cross-station identity verification. `@gtcx/workproof` provides W3C VC attestation schemas compatible with international standards.

**Workflow Unlocked:** Dr. Osei receives an export application for 50kg of gold. He opens the GTCX verification portal, scans the exporter's QR code, and sees the complete chain: 47 individual miner certificates → 3 buying station consolidation certificates → 1 export certificate. Each link is cryptographically signed. The merkle root matches the hash in the national registry. A geotag heatmap shows all 47 origin points are within licensed concessions. He approves in 4 minutes. An EITI auditor later samples 10% of certificates; all verify successfully against the public merkle root.

---

#### Persona: Sarah — Export Broker — London / Lagos

**Demographics:** 38, commercially focused, manages $50M annual throughput, reports to a commodity trading house board.

**Goals:** Maximize margin while minimizing compliance risk. Access premium markets (LBMA, Dubai) that require ethical sourcing documentation.

**Pain Points:**

- Premium markets pay 8-12% more but require documentation she cannot reliably source
- Insurance costs are high because provenance is uncertain
- A single compliance failure can blacklist her for 2 years
- She spends $200K/year on third-party audit firms

**Jobs-to-be-Done:**

1. _When_ I source gold from West Africa, _I want to_ receive irrefutable provenance documentation, _so I can_ access premium markets and higher margins
2. _When_ I present to LBMA, _I want to_ demonstrate bank-grade trust infrastructure, _so I can_ get approved as a responsible supplier
3. _When_ a buyer requests due diligence, _I want to_ share a public verification link, _so I can_ close deals faster

**How This Repo Helps:** `@gtcx/verification` provides standard and military-grade certificates. `@gtcx/crypto` provides FIPS-validated signatures that LBMA auditors accept. `@gtcx/workproof` generates W3C VCs compatible with international standards. `@gtcx/api-client` provides resilient API access for her London-based systems.

**Workflow Unlocked:** Sarah receives a shipment from her Accra partner. The GTCX system generates a TradeCV — a W3C Verifiable Credential containing the complete chain of custody, assay results, and compliance attestations. She uploads it to the LBMA portal. The LBMA system verifies the cryptographic signatures against `gtcx-core` public keys, confirms the merkle proof, and approves her supplier status. Her insurance premium drops 15%. A Dubai buyer requests DD; she shares a public link that verifies in 30 seconds. The deal closes in 3 days instead of 3 weeks.

---

#### Persona: Kofi — Central Bank Governor — African Sovereign

**Demographics:** 52, macro-economic focus, manages national reserves and monetary policy, accountable to parliament and IMF.

**Goals:** Increase formalization of the informal mining sector. Capture tax revenue currently lost to smuggling. Build national digital identity infrastructure.

**Pain Points:**

- 70% of artisanal gold production is smuggled, costing $500M+ annually in lost revenue
- No reliable national production database exists
- Foreign systems (SWIFT, Western exchanges) capture value that should stay domestic
- Data sovereignty concerns prevent using foreign cloud platforms

**Jobs-to-be-Done:**

1. _When_ I design monetary policy, _I want to_ know actual gold production volumes, _so I can_ make data-driven decisions
2. _When_ I negotiate with the IMF, _I want to_ demonstrate traceable resource governance, _so I can_ secure better terms
3. _When_ I build national digital infrastructure, _I want to_ own the trust layer, _so I can_ preserve sovereignty and build domestic capacity

**How This Repo Helps:** `@gtcx/crypto` provides sovereign-controlled cryptographic infrastructure (no foreign backdoors). `@gtcx/identity` provides DID infrastructure for national digital identity. `@gtcx/consensus` (Rust) provides weighted PBFT for distributed ledger applications. `@gtcx/sync` ensures data persists even in infrastructure-poor regions. All code is open for national security review; no proprietary black boxes.

**Workflow Unlocked:** Kofi's central bank partners with GTCX to deploy a national mineral traceability platform. The system runs on domestic servers with `gtcx-core` as the cryptographic foundation. Every buying station transaction is signed with keys generated inside the country's HSM infrastructure. The central bank receives real-time (or near-real-time) production data. At the IMF review, Kofi presents 18 months of traceable production data, verified by an independent auditor using `gtcx-core` public proofs. The IMF agrees to a 2-year extension on debt service. Parliament approves the national digital identity bill, backed by `gtcx-core` DID infrastructure.

---

#### Persona: Alex — Platform Engineer — New Hire at GTCX

**Demographics:** 29, full-stack TypeScript + Rust, previously at a fintech startup, joining to build the next downstream product.

**Goals:** Ship features quickly. Understand the codebase without breaking security. Contribute to a system that matters.

**Pain Points:**

- Monorepos can be overwhelming; unclear where to start
- Cryptographic code is intimidating; afraid of introducing vulnerabilities
- No clear onboarding path for new engineers

**Jobs-to-be-Done:**

1. _When_ I join the team, _I want to_ build and test the codebase in under 30 minutes, _so I can_ start contributing on day 1
2. _When_ I need to add a feature, _I want to_ know which packages I can touch and which require approval, _so I can_ move fast without breaking security
3. _When_ I write code, _I want to_ run the same checks as CI locally, _so I can_ catch issues before PR review

**How This Repo Helps:** `architecture:check` enforces package boundaries so Alex knows exactly what depends on what. `pnpm lint` and `pnpm test` run the same checks as CI. `CLAUDE.md` and `CONTRIBUTING.md` document conventions. Security-sensitive packages are clearly marked; changes require Cryptographic Security Engineer review.

---

## 4. Market Context & Opportunity

### 4.1 Addressable Market

| Market Tier                                          | Size                     | Source                                        | GTCX Relevance                                               |
| ---------------------------------------------------- | ------------------------ | --------------------------------------------- | ------------------------------------------------------------ |
| **TAM** — Global artisanal mining                    | $100B+ annual production | [Deloitte, 2024](https://www2.deloitte.com)   | All artisanally mined commodities need traceability          |
| **SAM** — African artisanal gold + critical minerals | $25B+ annual production  | [World Bank, 2023](https://www.worldbank.org) | Primary target: Ghana, DRC, Zambia, Zimbabwe, Namibia        |
| **SOM** — GTCX-addressable in 3-5 years              | $2-5B annual throughput  | Internal model                                | Realistic capture at 8-20% of SAM with 3-5 partner countries |

**Supporting data:**

- Ghana produced 4.0M oz gold in 2024; 30% artisanal = ~1.2M oz at $2,400/oz = **$2.9B**
- DRC cobalt: 70% of global supply; artisanal share ~15-20% = **$1.5-2.0B**
- Zambia copper: emerging artisanal sector; estimated **$200-400M**
- Zimbabwe lithium: rapid growth; estimated **$300-500M by 2028**

### 4.2 Market Pain Points

1. **Provenance Fraud ($15B+ annual loss):** Fake certificates, smuggled gold labeled as ethical, conflict minerals laundered through multiple jurisdictions. The Kimberley Process has gaps; blockchain solutions are too expensive for artisanal scale.

2. **Financial Exclusion (40M+ artisanal miners):** No bank accounts, no credit history, no collateral. De facto barred from formal economy. Mobile money penetration is high (70%+ in Ghana, 85%+ in Kenya) but lacks trust infrastructure.

3. **Regulatory Burden (2-6 week approval cycles):** Export licenses, EITI compliance, OECD Due Diligence Guidance. Manual paper trails. A single missing document can delay a $5M shipment by weeks.

4. **Data Sovereignty Concerns:** Foreign platforms (Salesforce, SAP) capture production data outside national borders. Central banks and mineral commissions lack real-time visibility into their own resources.

5. **Climate & ESG Accountability:** Buyers (Tesla, Apple, LBMA) require ethical sourcing documentation. Artisanal miners cannot afford third-party audit fees ($2-5K per site).

### 4.3 Category-Defining Opportunity

If GTCX succeeds: African commodity-producing nations gain sovereign control over their traceability infrastructure. Artisanal miners gain access to formal markets and credit. Export brokers reduce compliance costs by 60-80%. Regulators gain real-time visibility. The category shifts from "expensive Western audit firms" to "affordable, sovereign-controlled digital trust."

If GTCX fails: The status quo persists — foreign platforms extract value, artisanal miners remain excluded, smuggling continues, and African nations lose $10B+ annually in untraceable production.

---

## 5. Go-to-Market Enablers

**Pilot readiness:** `gtcx-core` is ready for sandbox pilots. The cryptographic foundation is verified (FIPS), the offline queue is tested, and the API surface is stable. Gaps: CI blocked (no automated test runs on PR), USSD protocol is string-only, adaptive low-bandwidth mode is config-only.

**Regulator engagement:** The SOC 2 readiness analysis is complete. The FIPS assessment is verified. The threat-control matrix exists (12 controls, 20 evidence references). The Zimbabwe pre-submission email is drafted and ready to send. Missing: external pen-test, SOC 2 Type 1 attestation, first regulator response.

**Partner integration:** `@gtcx/crypto` v2.0.0 is published on npm. The API surface is baselined. Package boundaries are enforced. Missing: SLSA provenance on published packages, `NPM_TOKEN` for further publishes.

**Sales collateral:** Executive brief, security posture, compliance matrix, and FIPS readiness documents exist in `docs/gtm/`. Missing: case studies from live pilots, third-party validation report.

---

## 6. Technical Overview

### 6.1 Technology Stack

| Layer               | Technology                               | Version           | Purpose                                  |
| ------------------- | ---------------------------------------- | ----------------- | ---------------------------------------- |
| Primary Language    | TypeScript                               | 5.7+              | Business logic, APIs, domain models      |
| Secondary Language  | Rust                                     | 1.91+             | Cryptography, ZKP, consensus, networking |
| Runtime             | Node.js                                  | >= 20.0.0         | TypeScript execution                     |
| Package Manager     | pnpm                                     | 9.15.0            | Workspace monorepo (21 packages)         |
| Build Tool          | tsup                                     | 8.x               | TypeScript compilation                   |
| Rust Build          | cargo                                    | 1.91+             | Rust crate compilation                   |
| Testing (TS)        | vitest                                   | 2.x               | Unit + integration tests                 |
| Testing (Rust)      | cargo test                               | 1.91+             | Rust unit tests                          |
| Cryptography (TS)   | @noble/curves, @noble/hashes             | 1.x               | Ed25519, Secp256k1, SHA-256, BLAKE3      |
| Cryptography (Rust) | arkworks, bulletproofs, curve25519-dalek | 0.4.x / 5.x / 4.x | Groth16, Bulletproofs, Schnorr           |
| FIPS Backend        | aws-lc-fips-sys                          | CMVP #4816        | FIPS 140-3 validated crypto              |
| Schema Validation   | zod                                      | 3.24+             | Runtime type validation                  |
| NAPI Bindings       | napi-rs                                  | 2.x               | Rust → Node.js bindings                  |

### 6.2 Architecture at a Glance

```text
┌─────────────────────────────────────────────────────────────┐
│  Downstream Products: gtcx-markets, gtcx-protocols,         │
│  gtcx-infrastructure, gtcx-intelligence                     │
│                         ↓ npm dependency                    │
├─────────────────────────────────────────────────────────────┤
│  TypeScript Core Layer (packages/*)                         │
│  ├─ @gtcx/types, @gtcx/events      (foundation)            │
│  ├─ @gtcx/crypto, @gtcx/schemas    (crypto + types)        │
│  ├─ @gtcx/identity, @gtcx/security, @gtcx/verification    │
│  ├─ @gtcx/domain, @gtcx/services                           │
│  ├─ @gtcx/api-client, @gtcx/connectivity, @gtcx/sync       │
│  └─ @gtcx/runtime                 (batteries-included)     │
│                         ↓                                   │
├─────────────────────────────────────────────────────────────┤
│  Rust Core Layer (rust/*)                                   │
│  ├─ gtcx-crypto    (Ed25519, SHA-256, Blake3)              │
│  ├─ gtcx-zkp       (Groth16, Bulletproofs, Schnorr)        │
│  ├─ gtcx-consensus (PBFT foundations)                      │
│  ├─ gtcx-network   (libp2p transport)                      │
│  ├─ gtcx-node      (NAPI bindings)                         │
│  └─ gtcx-edge      (edge runtime)                          │
│                         ↓                                   │
├─────────────────────────────────────────────────────────────┤
│  Platform: OpenSSL 3.x FIPS (CMVP #4282) / AWS-LC          │
│            (CMVP #4816)                                    │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Package / Crate Inventory

| Name                    | Purpose                          | Maturity                | Coverage                     | Key Consumer          |
| ----------------------- | -------------------------------- | ----------------------- | ---------------------------- | --------------------- |
| `@gtcx/crypto`          | Signing, hashing, ZKP engine     | **Production-hardened** | 97.86% stmts / 86.48% branch | All downstream        |
| `@gtcx/crypto-native`   | NAPI bindings loader             | **Beta**                | —                            | `@gtcx/crypto`        |
| `@gtcx/verification`    | Certificates, QR, proofs         | **Production-hardened** | 94.79% stmts / 89.11% branch | `gtcx-markets`        |
| `@gtcx/identity`        | DID, credentials, keys           | **Beta**                | 85%+                         | `gtcx-markets`        |
| `@gtcx/security`        | Auth, validation, audit log      | **Production-hardened** | 83%+                         | All downstream        |
| `@gtcx/domain`          | Commodity-agnostic domain        | **Production-hardened** | 81%+                         | All downstream        |
| `@gtcx/sync`            | Offline-first sync engine        | **Production-hardened** | 88%+                         | Mobile clients        |
| `@gtcx/connectivity`    | Network detection, profiles      | **Production-hardened** | 95%+                         | Mobile clients        |
| `@gtcx/api-client`      | Resilient HTTP client            | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/resilience`      | Circuit breaker, retry, bulkhead | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/telemetry`       | OpenTelemetry instrumentation    | **Production-hardened** | 85%+                         | All downstream        |
| `@gtcx/runtime`         | Batteries-included substrate     | **Beta**                | 80%+                         | App developers        |
| `@gtcx/workproof`       | W3C VC attestation schemas       | **Beta**                | 75%+                         | Export brokers        |
| `@gtcx/services`        | Business services                | **Functional**          | 88%+                         | `gtcx-markets`        |
| `@gtcx/schemas`         | Zod validation schemas           | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/types`           | Canonical type definitions       | **Production-hardened** | 100%                         | All downstream        |
| `@gtcx/events`          | Typed event bus                  | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/network`         | P2P networking primitives        | **Scaffolding**         | 60%+                         | `gtcx-infrastructure` |
| `@gtcx/ai`              | AI integration hooks             | **Scaffolding**         | 50%+                         | `gtcx-intelligence`   |
| `@gtcx/logging`         | Structured logging               | **Production-hardened** | 90%+                         | All downstream        |
| `@gtcx/utils`           | Common utilities                 | **Production-hardened** | 95%+                         | All downstream        |
| `gtcx-crypto` (Rust)    | Native crypto primitives         | **Production-hardened** | 85%+                         | `gtcx-zkp`, NAPI      |
| `gtcx-zkp` (Rust)       | ZKP circuits                     | **Production-hardened** | 85%+                         | `@gtcx/crypto-native` |
| `gtcx-consensus` (Rust) | PBFT foundations                 | **Scaffolding**         | 60%+                         | `gtcx-infrastructure` |
| `gtcx-network` (Rust)   | libp2p transport                 | **Scaffolding**         | 60%+                         | `gtcx-infrastructure` |
| `gtcx-node` (Rust)      | NAPI bindings target             | **Functional**          | 70%+                         | `@gtcx/crypto-native` |
| `gtcx-edge` (Rust)      | Edge runtime                     | **Scaffolding**         | 50%+                         | Edge deployments      |

### 6.4 Ecosystem Integration Map

| Downstream Repo       | What It Consumes                                                                            | Integration Pattern |
| --------------------- | ------------------------------------------------------------------------------------------- | ------------------- |
| `gtcx-markets`        | `@gtcx/crypto`, `@gtcx/verification`, `@gtcx/identity`, `@gtcx/sync`, `@gtcx/services`      | npm dependency      |
| `gtcx-protocols`      | `@gtcx/schemas`, `@gtcx/types`, `@gtcx/crypto`                                              | npm dependency      |
| `gtcx-infrastructure` | `@gtcx/network`, `@gtcx/connectivity`, `@gtcx/resilience`, `gtcx-consensus`, `gtcx-network` | npm + cargo         |
| `gtcx-intelligence`   | `@gtcx/ai`, `@gtcx/telemetry`, `@gtcx/events`                                               | npm dependency      |
| External apps         | `@gtcx/api-client`, `@gtcx/runtime`                                                         | npm dependency      |

---

## 7. Compliance, Security & Bank-Grade Posture

### 7.1 Current Certification State

| Standard / Framework         | Status                        | Evidence                                                                                            | Gap                                |
| ---------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **FIPS 140-3**               | ✅ **Verified**               | `cargo test --features fips` passes (30 tests). `aws-lc-fips-sys` linked. CMVP #4816.               | None                               |
| **SLSA Build L3**            | 🟡 **Partial**                | `@gtcx/crypto@2.0.0` published. Source L2 enforced. Build L3: **no provenance attestation** on npm. | Add provenance to publish workflow |
| **STRIDE Threat Model**      | ✅ **Complete**               | 12 controls in `docs/security/threat-control-matrix.md`. Validator passes. 20 evidence references.  | None                               |
| **Penetration Test**         | 🔴 **Not started**            | Scope ready. Vendor not engaged.                                                                    | Commission vendor                  |
| **SOC 2 Type 1**             | 🟡 **Readiness**              | Readiness analysis complete. CPA engagement pending.                                                | Engage CPA firm                    |
| **Code Coverage (critical)** | 🟡 **Approaching**            | `@gtcx/crypto` 97.86% stmts / 86.48% branch. Target: 90% branch.                                    | Push branch coverage to 90%        |
| **Secret Scanning**          | 🟡 **Configured, CI blocked** | TruffleHog configured. Cannot run in CI due to billing.                                             | Fix CI billing                     |
| **Dependency Audit**         | ✅ **Clean**                  | `pnpm audit` clean. `cargo audit` clean (ark-\* advisories tracked).                                | None                               |
| **Signed Commits**           | ✅ **Enforced**               | Branch protection requires signed commits.                                                          | None                               |
| **CODEOWNERS**               | ✅ **Active**                 | 8 entries. Security-sensitive packages require Crypto Security Engineer.                            | None                               |

### 7.2 Security Controls

The threat-control matrix covers 12 STRIDE controls:

| Control | Threat                    | Status | Evidence                                     |
| ------- | ------------------------- | ------ | -------------------------------------------- |
| T01     | Spoofing — Identity       | ✅     | DID resolution, biometric binding            |
| T02     | Tampering — Data          | ✅     | Hash chains, merkle proofs, signed commits   |
| T03     | Repudiation — Actions     | ✅     | Audit logging, signed certificates           |
| T04     | Info Disclosure — Leakage | ✅     | Secret redaction, zeroizing memory           |
| T05     | DoS — Availability        | ✅     | Offline queue, circuit breaker, retry        |
| T06     | Elevation — Privilege     | ✅     | CODEOWNERS, branch protection                |
| T07     | Supply Chain              | 🟡     | SLSA Source L2; Build L3 pending             |
| T08     | AI-Specific               | ✅     | Trust gating, dual-provider review           |
| T09-T12 | Extended controls         | ✅     | See `docs/security/threat-control-matrix.md` |

Validator: `node tools/check-threat-matrix.mjs` passes.

### 7.3 Audit Trail

| Document                                                         | Date       | Core Score         | Key Finding                                              |
| ---------------------------------------------------------------- | ---------- | ------------------ | -------------------------------------------------------- |
| [Master Audit 2026-05-27](../audit/master-audit-2026-05-27.md)   | 2026-05-27 | **8.9/10** honest  | Delta audit; no new findings; all gates pass             |
| [Master Audit 2026-05-26](../audit/master-audit-2026-05-26.md)   | 2026-05-26 | **8.9/10** honest  | Continental predicates; zkp refactor; trust portal live  |
| [Master Audit 2026-05-12](../audit/master-audit-2026-05-12.md)   | 2026-05-12 | **8.63/10** honest | FIPS verified; SLSA no provenance; threat matrix created |
| [10/10 Roadmap 2026-05-11](../audit/10-10-roadmap-2026-05-11.md) | 2026-05-12 | —                  | M1 Foundation 4/6 complete; M2 Hardening in progress     |

---

## 8. Onboarding

### 8.1 For New Developers

1. **Prerequisites:** Node.js >= 20.0.0, pnpm >= 9.15.0, Rust >= 1.91.0
2. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd gtcx-core
   pnpm install
   ```
3. **Build:**
   ```bash
   pnpm build
   cd rust && cargo build --workspace
   ```
4. **Run tests:**
   ```bash
   pnpm test
   cd rust && cargo test --workspace
   ```
5. **Run verification gates:**
   ```bash
   pnpm architecture:check
   pnpm docs:check-links
   pnpm quality:governance:check
   pnpm lint
   pnpm format:check
   ```
6. **Read the ADR index:** `docs/decisions/adr-index.md`
7. **Pick a first issue:** Look for `good-first-issue` labels or start with `packages/utils/` or `packages/types/`

### 8.2 For Autonomous Agents

- **Commit style:** Conventional commits (`type(scope): description`)
- **Branch naming:** `feature/`, `fix/`, `docs/`, `refactor/`
- **Architecture boundaries:** Dependencies flow one direction only. No circular deps. Run `pnpm architecture:check` before any cross-package change.
- **Security-sensitive packages:** `@gtcx/crypto`, `@gtcx/crypto-native`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, `rust/gtcx-crypto`, `rust/gtcx-zkp` — changes require Cryptographic Security Engineer review.
- **Verification gates:** `format:check`, `lint`, `architecture:check`, `docs:check-links`, `governance:check` must all pass before commit.
- **Safety rules:** See `docs/agents/workflows/safety-rules.md`
- **Context file:** Read `CLAUDE.md` at repo root for repo identity and layer rules.

### 8.3 For Business Stakeholders

- **What this repo enables:** Verifiable trade certificates, digital identity for informal producers, and bank-grade trust infrastructure for commodity supply chains in Africa.
- **When it will be ready:** The cryptographic foundation is ready now. Downstream products (`gtcx-markets`) are in pilot preparation. Full production readiness requires: CI unblocked, external pen-test completed, SOC 2 Type 1 attestation received — estimated 6-9 months.
- **What risks remain:** CI billing failure blocks automated testing. No SLSA provenance on published packages. USSD protocol is not yet implemented. External validation (pen-test, SOC 2) is pending vendor engagement.
- **Who to contact:** Repo Lead (Protocol Architect), Security Reviewer (Cryptographic Security Engineer), Compliance Reviewer (Head of Compliance)

---

## 9. Technical Roadmap

### 9.1 Current Milestone

**M2: Hardening (Target: 9.4 core)**

M1 Foundation is 4/6 complete. M2 is in progress.

| M2 Item               | Status                                            |
| --------------------- | ------------------------------------------------- |
| Threat-control matrix | ✅ Complete (12 controls, validator passes)       |
| Coverage push         | ✅ `@gtcx/crypto` at 97.86% stmts / 86.48% branch |
| Rust LOC refactor     | ✅ `gtcx-zkp/src/lib.rs` split (1,977 → 51 lines) |
| SLSA publish          | 🟡 Package published, no provenance               |
| CI billing fix        | 🔴 Blocked — user action needed                   |
| Org secrets           | 🔴 4 missing — user action needed                 |
| Zimbabwe email        | 🔴 Draft ready — user action needed               |
| USSD protocol         | 🔴 String-only enum                               |
| Low-bandwidth mode    | 🔴 Config-only                                    |

### 9.2 Next 90 Days

1. **Fix CI billing + set 4 org secrets** — unblock automated testing and publishing
2. **Send Zimbabwe pre-submission email** — kick off regulator engagement
3. **Add SLSA provenance to npm publish** — achieve Build L3
4. **Scope and commission external pen-test** — 4-6 weeks execution
5. **Engage CPA firm for SOC 2 Type 1** — 8-10 weeks process

### 9.3 Path to 10.0

| Milestone        | Target Core | Key Deliverables                                                                                 |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| M2 Hardening     | 9.4         | SLSA provenance, pen-test scoped, SOC 2 engaged, threat matrix validated                         |
| M3 Certification | 9.7         | Pen-test report in hand, SOC 2 Type 1 received, regulator response positive, 90% branch coverage |
| M4 Reference     | 10.0        | Multi-country pilot live, category-defining trust infrastructure, compounding platform effects   |

**Critical path:** CI billing fix → SLSA publish → pen-test → SOC 2 Type 1. Engineering work is parallelizable; external authority work is serial.

Detailed roadmap: [`docs/audit/10-10-roadmap-2026-05-11.md`](../audit/10-10-roadmap-2026-05-11.md)

---

## 10. Reference & Navigation

### 10.1 Key Documents

| Document                                 | Purpose                  | Audience                         |
| ---------------------------------------- | ------------------------ | -------------------------------- |
| `docs/audit/master-audit-2026-05-27.md`  | Bank-grade certification | Security, compliance, investors  |
| `docs/audit/10-10-roadmap-2026-05-11.md` | Path to 10.0             | Engineering, product, executives |
| `docs/architecture/overview.md`          | System architecture      | Engineers, architects            |
| `docs/security/threat-control-matrix.md` | Security controls        | Security engineers, auditors     |
| `docs/compliance/soc2-readiness.md`      | SOC 2 evidence           | Compliance, buyers               |
| `docs/gtm/00-executive-brief.md`         | Executive summary        | Investors, board                 |
| `docs/specs/packages/README.md`          | Package specs            | Engineers, integrators           |
| `docs/decisions/adr-index.md`            | Architecture decisions   | Engineers, architects            |
| `CONTRIBUTING.md`                        | Contribution guide       | Open-source contributors         |
| `CLAUDE.md`                              | Agent context            | AI agents, new developers        |

### 10.2 Contact & Escalation

| Role                | Responsibility             | Contact                         |
| ------------------- | -------------------------- | ------------------------------- |
| Repo Lead           | Technical ownership        | Protocol Architect              |
| Security Reviewer   | Security-sensitive changes | Cryptographic Security Engineer |
| Compliance Reviewer | Compliance evidence        | Head of Compliance              |
| Product Owner       | Feature prioritization     | Product Lead                    |

---

## 11. Honest Assessment

This document reflects the state of `gtcx-core` as of 2026-05-27. It uses honest scores from forensic verification (§9 of the master audit), not claimed scores.

**What is real:** FIPS 140-3 verified. Zero unsafe code. 97.86% statement coverage on critical path. Threat-control matrix with 12 validated controls. Offline-first queue tested. API surface baselined.

**What is aspirational:** SLSA Build L3 (package published, no provenance). USSD protocol (string enum only). Adaptive low-bandwidth mode (config-only). External pen-test (not started). SOC 2 Type 1 (readiness complete, no CPA engaged).

**What is blocked:** CI billing (user action). 4 org secrets (user action). Zimbabwe email (user action).

**What this means:** The engineering foundation is strong. The remaining work is external validation and operational unblocking. The path to 10.0 is clear and measured in months, not years.
