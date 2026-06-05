---
title: 'Remaining cross-repo work — gtcx-core tracker'
status: current
date: 2026-06-04
owner: gtcx-core
role: protocol-architect
document_id: COORD-REMAINING-CORE-001
protocol: gtcx-docs/01-docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: standard
tags: ['coordination', 'cross-repo', 'tracker', 'remaining-work']
related:
  - cross-repo-agent-bridge.md
  - cross-repo-sprint-workplan-2026-06.md
---

# Remaining cross-repo work — gtcx-core tracker

Living register of **open** cross-repo items originating from or affecting `gtcx-core`. Closed 10/10 milestones are omitted — see `01-docs/05-audit/execution-roadmap.md` and `01-docs/01-agents/sessions/2026-06-02-remaining-cross-repo-work.md`.

**Hub index:** `baseline-os/workstream/index/blockers.md` · inbound tickets under `baseline-os/workstream/coordination/inbound/`

**Reconciled:** [full-audit-2026-06-04.md](../../audit/full-audit-2026-06-04.md) · [tier-5-workplan-2026-06.md](../tier-5-workplan-2026-06.md)

---

## 0. Ecosystem coordination (2026-06-04)

| ID                 | Item                                          | Owner               | Status                    | gtcx-core action                                                                                                                                             |
| ------------------ | --------------------------------------------- | ------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| OI-X01 / ER-1-08   | Hub ack — trusted-setup / ER-1 evidence chain | gtcx-core           | **done** 2026-06-04       | Protocols hub log row; no further core code                                                                                                                  |
| OI-X02 / ER-1-08   | Hub ack — same initiative                     | gtcx-infrastructure | **done** 2026-06-04       | Inbound [`from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md`](./from-gtcx-infrastructure-er-1-08-hub-ack-2026-06-04.md); hub log `2026-06-04T23:50Z`    |
| OI-X06 / INT-S8-04 | cost-router v1.1                              | baseline-os         | **external**              | Track only; optional for intel env-fallback                                                                                                                  |
| EXT-INF-002        | Live-stack pen-test                           | gtcx-infrastructure | **outbound-acknowledged** | Pack ack [`from-gtcx-infrastructure-ext-inf-002-ack-2026-06-07.md`](./from-gtcx-infrastructure-ext-inf-002-ack-2026-06-07.md); SOW signature Class S (infra) |

---

## Summary

| Priority                  | Count | gtcx-core action                                                            |
| ------------------------- | ----- | --------------------------------------------------------------------------- |
| **P1 done**               | 5     | EAP bundle sync; D4/D5/D10; M10.2; agent:next-work CI — executed 2026-06-03 |
| **P1 blocked (external)** | 4     | Track — vendor selection, regulator, email gate                             |
| **P2 open (downstream)**  | 1     | D3 transcript after ceremony (CORE-004)                                     |
| **Done (internal)**       | 12    | 10/10 milestones, EAP CLI, KAT package, handoffs, bundle sync               |

---

## 1. P1 — done

### CORE-001: EAP auth-keys bundle sync (staging)

**Status:** done 2026-06-03T07:39:24Z  
**Owner:** gtcx-core  
**Sprint:** S-CORE-1  
**Downstream impact:** Unblocks XR-201 / INT-S3-08 intelligence auth-gated smoke

#### What gtcx-core delivered

| #   | Requirement                                                     | Verify                                               |
| --- | --------------------------------------------------------------- | ---------------------------------------------------- |
| 1   | ✅ Run `pnpm eap:sync-bundle` for `EAP_ENVIRONMENT=staging`     | Secret `gtcx/intelligence/staging/auth-keys` updated |
| 2   | ✅ Confirm secret contains `AUTH_API_KEYS` and `AUTH_KEY_ROLES` | 2 keys, 2 roles confirmed                            |
| 3   | ✅ Ping gtcx-infrastructure for ESO force-refresh               | ESO refreshed 2026-06-03T09:20Z                      |
| 4   | ✅ Infra ack: K8s secret picks up new value                     | `AUTH_API_KEYS` + `AUTH_KEY_ROLES` verified in pods  |

#### Execution evidence

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/gtcx-core/packages/eap
EAP_ENVIRONMENT=staging AWS_REGION=us-east-1 pnpm eap:sync-bundle
```

Output:

```json
{
  "secret_name": "gtcx/intelligence/staging/auth-keys",
  "keys_found": 2,
  "keys_skipped": 0,
  "auth_api_keys_count": 2,
  "auth_key_roles_count": 2,
  "ok": true
}
```

Secret ARN: `arn:aws:secretsmanager:us-east-1:348389439381:secret:gtcx/intelligence/staging/auth-keys-6GRMKa`  
VersionId: `4d01fb8c-9770-409c-ad73-ddff9887bc45`  
CreatedDate: `2026-06-03T07:39:24.118000+02:00`

#### Copy-paste ping (to gtcx-infrastructure)

```
Subject: EAP auth-keys bundle synced — request ESO force-refresh

gtcx-core has synced the EAP auth-keys bundle to AWS SM:
  Secret: gtcx/intelligence/staging/auth-keys
  ARN: arn:aws:secretsmanager:us-east-1:348389439381:secret:gtcx/intelligence/staging/auth-keys-6GRMKa
  VersionId: 4d01fb8c-9770-409c-ad73-ddff9887bc45
  Source: gtcx/eap/staging/clients/*
  Keys found: 2
  Keys skipped: 0

Please force-refresh ESO so K8s secret gtcx-intelligence-staging-auth-keys
picks up the new value. Confirm when done.

Hub: gtcx-core/01-docs/04-ops/coordination/remaining-cross-repo-work-2026-06-02.md
```

---

## 2. P1 — blocked (external / human)

### CORE-005: Pen-test vendor selection + SOW

**Status:** blocked  
**Owner:** Security team / baseline-os  
**Sprint:** S-CORE-2  
**Unblocks:** D9 Third-Party Audit (0 → target)

| Gate                   | Owner            | Action                               |
| ---------------------- | ---------------- | ------------------------------------ |
| RFP responses reviewed | Security Lead    | Evaluate vendor proposals            |
| Vendor selected        | Security Lead    | Sign engagement letter               |
| SOW signed             | Legal + Security | Define scope, timeline, deliverables |

**Source:** `baseline-os/workstream/coordination/drafts/pen-test-vendor-outreach-2026-05-26.md`

---

### CORE-006: Z3/Coq formal verification consultant

**Status:** blocked  
**Owner:** Security / baseline-os  
**Sprint:** S-CORE-2  
**Unblocks:** D8 Formal Verification (0 → target)

**Requirements:**

- Z3 or Coq expertise in cryptographic protocol verification
- Preferably African-based or timezone-compatible
- Scope: Groth16 circuit correctness, Bulletproofs range proof soundness

---

### CORE-007: Side-channel analysis lab (D7 M7.5)

**Status:** blocked  
**Owner:** Security / baseline-os  
**Sprint:** S-CORE-2  
**Unblocks:** D7 9 → 10

**Note:** Can be same vendor as CORE-005 if they offer side-channel services. Internal dudect benchmark already passes (p-value = 0.78). External lab needed for regulator evidence.

---

### CORE-008: Regulator attestation / NIST CMVP liaison

**Status:** blocked  
**Owner:** GTM Lead / Protocol Architect  
**Sprint:** S-CORE-2  
**Unblocks:** D10 9 → 10

**Requirements:**

- African regulator letter attesting to GTCX cryptographic suitability
- OR NIST CMVP liaison letter confirming CMVP #4816 coverage

---

### CORE-009: Zimbabwe email human gate routing

**Status:** blocked  
**Owner:** baseline-os / GTM Lead  
**Sprint:** S-CORE-1  
**Blockers:** 6 of 8 human gates remain

| Gate                             | Owner              | Action                        |
| -------------------------------- | ------------------ | ----------------------------- |
| Recipient address verified       | GTM Lead           | Verify `sandbox@rbz.co.zw`    |
| Engagement-lead name designated  | GTM Lead           | Insert name in template       |
| Sender name + title designated   | Protocol Architect | Insert sender identity        |
| Pen-test SoW state confirmed     | Security Lead      | Confirm signed vs pre-signing |
| SOC 2 CPA letter state confirmed | Compliance Lead    | Confirm signed vs pre-signing |
| Protocol Architect approval      | Protocol Architect | Final sign-off before send    |

---

## 3. P2 — open (downstream or release-gated)

### CORE-003: gtcx-protocols consumes `@gtcx/zkp-kat-vectors`

**Status:** done 2026-06-03  
**Owner:** gtcx-protocols  
**Sprint:** S-CORE-2  
**Effort:** 2–4 hours

#### What gtcx-core delivered

- `@gtcx/zkp-kat-vectors@1.0.0` published in workspace
- Exports 6 KAT artifacts (4 Groth16 + 2 Bulletproofs) as typed JSON
- Zero runtime dependencies

#### What gtcx-protocols needs to do

1. Add dev dependency:
   ```json
   { "devDependencies": { "@gtcx/zkp-kat-vectors": "workspace:*" } }
   ```
2. In ZKP integration tests, import at least one KAT file and verify the proof through your abstraction layer
3. Acceptance: one protocol test loads a KAT file and verifies the proof

**Blockers:** None. Package is ready.

#### Delivered 2026-06-03

- `gtcx-protocols/tests/cross-repo/zkp-kat-vectors-consumption.test.ts` — loads `bulletproofsAmountRange` KAT; verifies via `@gtcx/crypto` `createZkpEngine()` when `@gtcx/crypto-native` is present
- `pnpm exec vitest run --config vitest.integration.config.ts tests/cross-repo/zkp-kat-vectors-consumption.test.ts` — exit 0 (2/2)
- DevDep: `@gtcx/zkp-kat-vectors` via `link:../gtcx-core/packages/zkp-kat-vectors` (publish to npm unblocks CI without sibling checkout)

---

### CORE-004: D3 trusted-setup transcript verification

**Status:** release-gated  
**Owner:** gtcx-core  
**Sprint:** S-CORE-3  
**Effort:** 1 day

#### Context

D3 Trusted-Setup Reduction is at 9.5/10. M3.2 requires CI test that re-derives verifying key from published transcript and confirms VK hash matches KAT.

#### What gtcx-core will deliver

- Publish trusted-setup transcript (when ceremony complete)
- `cargo test --features trusted-setup-verify` that:
  1. Reads transcript
  2. Re-derives VK
  3. Compares hash to KAT artifact

#### What gtcx-protocols needs to do

- Nothing directly — but this gates D3 completion which affects protocol-layer proof verification assumptions
- Ensure protocol docs reference the canonical VK hash

**Blockers:** Ceremony completion (XR-402).

---

## 4. Done (reference — do not re-open)

| Handoff / milestone            | Evidence / note                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| M10.2 Runtime FIPS enforcement | `03-platform/src/fips.rs` — centralized policy; raw blake3 returns `Result`; 63 tests pass |
| D1 Circuit Correctness 9 → 10  | `tests/differential.rs` — 20 witnesses, 0 disagreements                                    |
| D2 Bulletproofs 9 → 10         | `proptest` — 256 cases each, valid/invalid                                                 |
| D6 KAT / Interop 8 → 10        | `@gtcx/zkp-kat-vectors@1.0.0` published                                                    |
| D7 Side-Channel 8 → 9          | `dudect-bencher` — p-value = 0.78                                                          |
| D4 Backward compat             | `zkp-diamond-origin` → `zkp-commodity-origin` cross-API test                               |
| D5 RNG / Entropy               | `RNG.md` + `test_proof_non_determinism` (100 proofs, all distinct)                         |
| D10 Algorithmic Moat           | Overall ≈ 8.95/10                                                                          |
| EAP admin rotate               | `rotate()` + redacted export endpoint                                                      |
| EAP bundle sync CLI            | `pnpm eap:sync-bundle` implemented                                                         |
| KAT cross-impl verify          | `kat-cross-impl-verify` binary — zero gtcx-zkp imports                                     |
| Handoffs                       | protocols, infrastructure, baseline-os                                                     |
| Coordination folder            | `01-docs/04-ops/coordination/` created 2026-06-03                                          |

---

## Dependency graph (one line)

```
CORE-001 (EAP bundle sync)
  → gtcx-infrastructure ESO refresh
  → XR-201 intelligence auth gate
  → INT-S3-08 / XR-202 **done** (2026-06-03)

CORE-005–008 (vendors / regulator / email)
  → Human actions
  → 10/10 completion

CORE-003 (KAT consumption)
  → gtcx-protocols test PR
  → M6.5 downstream validation

XR-402 (ceremony)
  → CORE-004 (transcript verification)
  → D3 9.5 → 10
```

---

_Refresh this file when a cross-repo item closes or a new inbound lands._
