# Innovation Opportunities — 2-core

**Date:** 2026-03-09
**Scope:** gtcx-core — underutilized capabilities, novel product primitives, blindspots at the foundation layer

---

## What This Layer Uniquely Enables

2-core is not a product — it is the substrate. The opportunities here are not features to add but capabilities that exist in the codebase that no one is consuming yet. Each one listed below is confirmed present in code and currently unused or underused.

---

## Underutilized Capabilities

### 1. `@gtcx/connectivity` — Africa-Optimized Network Stack

The connectivity package explicitly models `ussd-only`, `satellite`, `edge`, and `degraded` network profiles. This is a deliberate design choice for Global South operation. However:

- No consumer in the ecosystem currently uses `classifyProfile()` to adapt behavior
- The `@gtcx/sync` engine exists but is not wired to connectivity state changes
- `@gtcx/api-client` has offline queue support but no integration with connectivity profiles to determine when to queue vs. retry vs. fail

**Opportunity:** A connectivity-aware request layer that automatically degrades gracefully — queue on `offline`, compress on `edge`, rate-limit on `satellite` — without any caller intervention. This is a 2-core primitive that could be the defining capability for field operation in Ghana.

### 2. `gtcx-edge` Rust Crate — Offline Verification for 30 Days

The edge runtime targets <50MB RAM, <10MB binary, <2MB WASM bundle, with a 30-day offline verification cache. This is a production-grade offline verification engine for constrained devices.

**What's not happening:** No one is packaging this for mobile (React Native via JSI), for hardware (TapKit), or as a WASM target. The design intent is for this to run on low-end Android phones used by miners in rural Ghana. The capability exists in Rust; it has never been delivered to an application layer.

**Opportunity:** A compiled WASM bundle of `gtcx-edge` + `gtcx-crypto` that runs in React Native via JSI. This gives the mobile app cryptographic verification that works offline for a month without server contact.

### 3. `@gtcx/workproof` — Portable Professional Identity

TradeCV/WorkProof v2.1 is a W3C VC-based employment and skill attestation system with 40+ predicates covering identity, compliance, asset, financial, and certification domains. This is more than just employment records — it is a portable, cryptographically-verifiable professional identity layer.

**What's not happening:** WorkProof has no confirmed consumer in the ecosystem. The `tradecv/` and `workproof/` schemas are fully defined; the AI validation hooks are stubbed. This is being treated as an internal building block that no product surface exposes.

**Opportunity:** A "Miner Passport" product built directly on WorkProof. Every artisanal miner in Ghana gets a portable, phone-held credential wallet containing their site permits, extraction history, ESG verification, and sanctions clearance. This is the cooperative proof point the Q2 GTM is anchored in.

### 4. `@gtcx/crypto` ZKP Interface — Selective Disclosure Ready

The ZKP type system supports Schnorr, Bulletproofs, Groth16, and PLONK. The `ZkProver`/`ZkVerifier` interface is defined. Only hash-commitment proofs are implemented, but the interface contract is stable.

**What's not happening:** No product surface uses ZKP today. The value proposition — proving commodity origin without revealing source location, proving sanctions clearance without revealing identity, proving permit validity without revealing the permit number — is exactly what DFI partners need for due diligence without compromising operator privacy.

**Opportunity:** Implement a Groth16 prover (or integrate with a circuit library like snarkjs) for two predicates: (a) "this miner holds a valid permit" and (b) "this commodity weight is within legal transaction limits." Both are provable without revealing the underlying data. This unlocks privacy-preserving compliance for DFI partnerships.

### 5. `@gtcx/events` + `@gtcx/domain` — Commodity Supply Chain Event Log

The event bus and domain event type system define a typed event log for every stage of the asset lifecycle: `registration.started`, `registration.completed`, `trading.trade_executed`, `trading.settlement_completed`, `compliance.violation_detected`. The versioned event payload schema (`version: number`) is present.

**What's not happening:** No product currently surfaces this event log. There is no dashboard, no audit trail UI, no DFI reporting feed.

**Opportunity:** A tamper-evident, cryptographically-chained supply chain event log — built on `@gtcx/events`, `@gtcx/domain`, and `@gtcx/crypto` hashing — that can be exported as a compliance artifact for DFI due diligence. Each event is signed, chained, and timestamped. This is a product feature that requires only integration work, not new primitives.

---

## Blindspots Specific to This Layer

### The Stub Problem Is Invisible to Callers

`@gtcx/ai` is a no-op. `@gtcx/crypto-native` may or may not load. `@gtcx/auth` and `@gtcx/audit` in `3-protocols` have no src. None of this fails at build time — it fails at runtime or produces silent degradation. There is no runtime stub detection for `@gtcx/ai` (unlike `@gtcx/domain`'s `enforceStubGuard`). An engineer importing `traced()` from `@gtcx/ai` gets no indication it is a no-op.

**Fix:** Apply `enforceStubGuard` in `@gtcx/ai` under `NODE_ENV=production`. Log a warning when traced functions are called in development without a real tracer registered.

### Core12 Schemas Are Not Wired to Protocol Validation

`@gtcx/schemas` implements Core12 (67 controls, 12 domains). GCI's scoring system has compliance domains (`environmental`, `social`, `governance`, `legal`, `operational`, `financial`) that map directly to Core12. They are not linked. GCI scores are computed with default weights but are not validated against Core12 control requirements.

**Opportunity:** A `validateGCIAgainstCore12()` function in 2-core that maps a GCI domain score to its corresponding Core12 controls. This creates a one-step compliance certification path for cooperatives that are simultaneously tracked by GCI.

### Schema Migration Framework Is Unused

`@gtcx/domain` has a full schema migration framework (`VersionedEntity`, `Migration`, `MigrationRegistry`, migration history tracking). Zero other packages or repos use it. When 6-platforms builds persistence layers, data model evolution will be unmanaged without this.

**Fix:** Document the migration framework as the canonical mechanism for data model evolution. Enforce its use when any package introduces a breaking change to a persisted schema.

---

## Low-Hanging Fruit

| Opportunity                                                           | Effort             | Unlock                                                  |
| --------------------------------------------------------------------- | ------------------ | ------------------------------------------------------- |
| Wire `@gtcx/connectivity` into `@gtcx/api-client` request behavior    | 1-2 days           | Automatic network adaptation in mobile + backend        |
| Apply `enforceStubGuard` to `@gtcx/ai`                                | Half a day         | Visible AI observability gaps instead of silent no-ops  |
| Export `@gtcx/connectivity` + `@gtcx/sync` to mobile integration list | Documentation only | Mobile offline-first capability is officially supported |
| Link Core12 schemas to GCI domain scoring                             | 2-3 days           | One-step compliance certification for cooperatives      |
| Publish `gtcx-edge` as WASM bundle for React Native JSI               | 1-2 weeks          | 30-day offline verification on field devices            |
| Build Miner Passport MVP on `@gtcx/workproof`                         | 2-3 weeks          | Q2 cooperative proof point                              |
