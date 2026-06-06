---
title: 'Outbound — EXT-INF-002 vendor pen-test pack (FA-S6-02)'
status: current
date: 2026-06-05
owner: gtcx-core
role: quality-evidence-lead
document_id: COORD-OUT-INFRA-EXTINF002
to: gtcx-infrastructure
from: gtcx-core
protocol: gtcx-docs/01-docs/governance/protocols/24-cross-repo-coordination/protocol.md
review_cycle: on-change
tier: standard
tags: ['coordination', 'outbound', 'ext-inf-002', 'pen-test', 'vendor']
related:
  - remaining-cross-repo-work-2026-06-02.md
  - ../../security/pen-test-scope.md
  - ../../audit/evidence/vendor-pen-test-pack-manifest-latest.json
---

# Outbound — EXT-INF-002 vendor pen-test pack (FA-S6-02)

**From:** gtcx-core  
**To:** gtcx-infrastructure  
**Topic:** Library-scope pen-test vendor intake pack for live-stack SOW  
**Work ID:** EXT-INF-002  
**Priority:** P1 (GTM bank-grade)  
**Authority:** Class A — **gtcx-infrastructure** owns vendor selection, SOW, and live-stack test

---

## Context

**gtcx-core** completed **FA-S6-02** — machine-readable vendor intake for library-scope pen-test evidence. This is **input** to EXT-INF-002; it does **not** close the live-stack pen-test gate.

| Artifact                | Path on `main`                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| Manifest (22 artifacts) | [`vendor-pen-test-pack-manifest-latest.json`](../../audit/evidence/vendor-pen-test-pack-manifest-latest.json) |
| Scope doc               | [`pen-test-scope.md`](../../security/pen-test-scope.md)                                                       |
| Evidence index          | [`evidence/README.md`](../../audit/evidence/README.md) § FA-S6-02                                             |
| Build / verify          | `pnpm vendor-evidence:build-manifest` · `pnpm vendor-evidence:verify-manifest`                                |

**Verify (gtcx-core @ main):**

```bash
cd gtcx-core && pnpm vendor-evidence:verify-manifest
# exit 0 · artifactCount: 22 · externalGate.status: open
```

---

## Pack contents (summary)

| Category        | Count | Examples                                               |
| --------------- | ----- | ------------------------------------------------------ |
| KAT cross-impl  | 12    | `artifacts/kat/groth16-*.kat.json`                     |
| Fuzz / security | 4     | `rust/gtcx-crypto/fuzz/`, threat matrix refs           |
| CI / provenance | 3     | workflow refs, provenance manifest                     |
| Docs            | 3     | pen-test scope, attack trees, native binding checklist |

Full SHA-256 list: manifest JSON on `main`.

---

## Requested action (gtcx-infrastructure)

1. **Acknowledge receipt** — append hub / bridge row referencing this ticket.
2. **Vendor SOW** — scope live-stack pen-test per infra deployment model; use gtcx-core pack as **library evidence intake** (not substitute for infra test).
3. **Class S gates** — vendor selection and contract remain human/infra owner (not gtcx-core).
4. **Evidence closure** — redacted vendor report → infra evidence path per [deployment-proof-index](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/01-docs/05-audit/evidence/deployment-proof-index.md).

---

## gtcx-core status

| Item                  | Status                                 |
| --------------------- | -------------------------------------- |
| FA-S6-02 manifest     | **done**                               |
| EXT-INF-002 live test | **open** — infra owner                 |
| CORE-004 ceremony     | **Class S** — parallel custodian track |

---

## Related (gtcx-infrastructure SoR)

| Artifact                                                                                                                                                                                      | Role                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`pen-test-intake-evidence-2026-05-31.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/05-audit/pen-test-intake-evidence-2026-05-31.md)                           | Live-stack / deployment pen-test intake |
| [`ext-inf-human-gates-unblock-2026-06-06.md`](https://github.com/gtcx-ecosystem/gtcx-infrastructure/blob/main/01-docs/04-ops/coordination/outbound/ext-inf-human-gates-unblock-2026-06-06.md) | EXT-INF-002 human SOW gate              |

**Rollup:** [`to-gtcx-infrastructure-open-acks-rollup-2026-06-07.md`](./to-gtcx-infrastructure-open-acks-rollup-2026-06-07.md) (OI-X02 + EXT-INF-002)

## Witness

When infra accepts pack: reply inbound `from-gtcx-infrastructure-ext-inf-002-ack-YYYY-MM-DD.md` or bridge row — gtcx-core will mark EXT-INF-002 **outbound-acknowledged** in `remaining-cross-repo-work`.
