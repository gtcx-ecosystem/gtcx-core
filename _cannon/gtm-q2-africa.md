# GTM Q2 Africa — 2-core

**Date:** 2026-03-09
**Scope:** gtcx-core — direct Q2 Ghana GTM dependencies, blockers, and the one ship that unlocks revenue

---

## The Q2 Thesis and 2-core's Role

Ghana-first. Target: verified metric tons of commodity transacted. Three GTM plays: cooperative proof point, aggregator commercial hook, DFI partnership. 2-core is the invisible foundation under all three — it does not appear in the product, but every verified transaction, every signed credential, every offline proof depends on what is in this repo.

The question for 2-core is not "what do we build?" but "what is not ready that will break things when we go live?"

---

## What 2-core Must Deliver for Each Q2 Play

### Play 1: Cooperative Proof Point

**What it requires from 2-core:**

- `@gtcx/identity` — DID creation for miners, cooperatives, and site operators
- `@gtcx/workproof` — The "Miner Passport": permit attestations, site credentials, ESG flags
- `@gtcx/verification` — Certificate generation for asset lots (unsigned data; mobile signs)
- `@gtcx/crypto` — Ed25519 signing for all credentials
- `@gtcx/connectivity` — USSD and satellite profile support for field devices in rural Ghana
- `@gtcx/sync` — Offline-first sync for catchup when connectivity returns

**Status:** All these packages are implemented. The gap is integration: `@gtcx/workproof` has no confirmed consumer. The mobile app (`7-mobile`) is not confirmed to consume `@gtcx/connectivity` or `@gtcx/sync`. The cooperative proof point requires these to be wired into the mobile app before a field pilot can operate reliably.

### Play 2: Aggregator Commercial Hook

**What it requires from 2-core:**

- `@gtcx/domain` — `AssetLotStatus` lifecycle (`discovered → registered → verified → at_aggregator → exported`)
- `@gtcx/services` — `AssetLotRegistrationService` and `TradingService` for aggregator-facing operations
- `@gtcx/events` — Event log covering `registration.completed`, `trading.trade_executed` for reporting
- `@gtcx/api-client` — Aggregator-facing API calls with retry and circuit breaker

**Status:** The domain model is correct and commodity-agnostic (gold, cocoa, coltan all use the same `AssetLot` with `commodityType: string`). `AssetLotStatus` includes `at_aggregator` as an explicit state — this was designed for this exact use case. The aggregator hook does not require new 2-core work; it requires `6-platforms` to implement the persistence and API layer that sits on top of these primitives.

### Play 3: DFI Partnership

**What it requires from 2-core:**

- `@gtcx/schemas` (Core12) — The 12-domain, 67-control compliance framework is the DFI's due diligence checklist
- `@gtcx/crypto` (ZKP interface) — Selective disclosure for privacy-preserving compliance proofs
- `@gtcx/events` — Tamper-evident supply chain event log as a compliance artifact
- `@gtcx/domain` — Schema versioning and migration for data provenance guarantees

**Status:** Core12 is implemented but not connected to GCI scoring or to any DFI-facing export. The ZKP selective disclosure capability is interfaced but not backed by a production prover. The event log exists but has no export format defined. DFI partnership is the most technically incomplete of the three plays from 2-core's perspective.

---

## What Is NOT Ready That Blocks Q2

### Blocker 1: Mobile Integration Gaps

`@gtcx/connectivity` and `@gtcx/sync` are not confirmed in the mobile integration. A field pilot in rural Ghana where connectivity drops to USSD-only will have undefined behavior if the mobile app is not using the connectivity classifier and sync engine. This is the most immediate Q2 risk in 2-core.

**Required:** Confirm or add `@gtcx/connectivity` and `@gtcx/sync` to `7-mobile`'s dependency list and wire them to the app's request and sync behavior.

### Blocker 2: `@gtcx/workproof` Has No Consumer

The Miner Passport lives in `@gtcx/workproof`. It is fully defined and ready to be used. If Q2's cooperative proof point is the first live demo of the system, the demo needs a credential wallet that shows a miner's permits, site verification, and ESG flags. That requires `@gtcx/workproof` to be consumed by the mobile app or a web surface.

**Required:** Wire `@gtcx/workproof` into `7-mobile` or `ai-3-fiftyfour` for credential display and issuance.

### Blocker 3: `@gtcx/ai` Is a Silent No-Op

If the DFI pitch includes AI-native compliance monitoring, the underlying AI tracing infrastructure does nothing in production. Every `traced()` call is a no-op. This is not a product failure — it is a demonstration credibility failure. If the system is presented as AI-native and the AI layer is a stub, that gap will surface in due diligence.

**Required:** Either wire `@gtcx/ai` to a real tracer from `5-intelligence` before any DFI demo, or stop leading with AI-native compliance as a DFI differentiator until the infrastructure is real.

### Blocker 4: No ZKP Production Prover

Selective disclosure for DFI due diligence (prove permit validity without revealing permit number) requires a working ZKP prover. The interface exists. No production backend is wired.

**Required for DFI partnership, not for cooperative or aggregator plays.** Can be deferred past initial Q2 if the DFI pilot is scoped to transparency rather than privacy-preserving proofs.

---

## Priority Q2 Tasks for 2-core

| Priority | Task                                                                         | Blocks                                  |
| -------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| P0       | Confirm and wire `@gtcx/connectivity` + `@gtcx/sync` in `7-mobile`           | Cooperative proof point field operation |
| P0       | Wire `@gtcx/workproof` into `7-mobile` for Miner Passport credential display | Cooperative proof point demo            |
| P1       | Wire `@gtcx/ai` to real tracer or gate AI-native claims                      | DFI demo credibility                    |
| P1       | Export Core12 compliance report format aligned with GCI scores               | DFI partnership artifact                |
| P2       | Implement Groth16 ZKP prover for permit validity selective disclosure        | DFI privacy-preserving compliance       |
| P2       | Add supply chain event log export (JSON-LD or structured PDF)                | DFI audit trail artifact                |

---

## The One Thing 2-core Must Ship to Unlock Q2 Revenue

**Wire `@gtcx/connectivity` and `@gtcx/sync` into `7-mobile`, and confirm `@gtcx/workproof` is consumed for Miner Passport issuance.**

The cryptographic primitives, identity management, and offline-first infrastructure are all built and working. The cooperative proof point — the Q2 top-of-funnel — lives or dies on whether the mobile app can operate reliably in a Ghanaian mining site with USSD-only connectivity, capture a signed lot registration offline, sync it when connectivity returns, and show a verifiable miner credential. Every piece needed to do this exists in 2-core today. The work is wiring, not building.

If those three packages are integrated into mobile, Q2 cooperative proof point field pilots can run.
