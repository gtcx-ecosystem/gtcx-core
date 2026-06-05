---
title: 'Audit evidence — gtcx-core'
status: current
date: 2026-06-03
owner: quality-evidence-lead
document_id: EVIDENCE-CORE-001
review_cycle: quarterly
tags: ['evidence', 'eap', 'audit']
---

# Audit evidence (gtcx-core)

Redacted evidence artifacts for cross-repo program closure. **No raw secrets.**

| Pattern                                     | Owner story                            | Validator                                                                                         |
| ------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `eap-issuance-*.json`                       | ER-1-08 / Protocol 23 Phase B issuance | `gtcx-protocols` → `pnpm check:eap-issuance-evidence`                                             |
| `minerals-board-uat-*.json`                 | DTF-5.3.3 regulator UAT (L0–L2)        | Manual review + [minerals-board-uat-protocol.md](../../operations/minerals-board-uat-protocol.md) |
| `minerals-board-uat-evidence-template.json` | DTF-5.3.3 schema template              | Copy to dated run artifact                                                                        |
| `zkp-profile-load-*.json`                   | DTF-5.4.2 Groth16 verify throughput    | `pnpm perf:zkp-profile-load` (gate: >= 1000 verifications/min, verify mode)                       |
| `zkp-profile-load-latest.json`              | DTF-5.4.2 symlink copy of latest run   | Auto-updated by bench wrapper                                                                     |
| `dtf-554-loi-*.pdf` (redacted)              | DTF-5.5.4 LOI / regulator letter       | Witness index [`dtf-554-loi-witness-index.md`](./dtf-554-loi-witness-index.md) — Class S human    |

**Canonical runtime smoke and deployment proofs** may also live in `gtcx-intelligence/docs/audit/evidence/` per [deployment-proof-index](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/audit/evidence/deployment-proof-index.md).

---

## Tier 5 technical exit register (DTF-5.5.5)

Machine-readable index for **S-T5-1 through S-T5-4** engineering evidence. Commercial gate (DTF-5.5.4 LOI) remains external. **CORE-004** engineering gate is green; production ZKP transcript publish remains release-gated (not INF-86 KMS XR-402).

| Story ID  | Sprint | Evidence (this repo or link)                                                                                                                                                                                                                       | Validator / gate                                                                                                          |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| DTF-5.1.4 | S-T5-1 | [`artifacts/kat/groth16-gh-gold-origin.kat.json`](../../../artifacts/kat/groth16-gh-gold-origin.kat.json)                                                                                                                                          | `pnpm test:kat-cross-impl` · CI KAT job                                                                                   |
| DTF-5.2.3 | S-T5-2 | [`groth16-zw-diamond-origin.kat.json`](../../../artifacts/kat/groth16-zw-diamond-origin.kat.json) · range KATs in `artifacts/kat/`                                                                                                                 | `cargo test -p gtcx-zkp`                                                                                                  |
| DTF-5.3.3 | S-T5-3 | `minerals-board-uat-*.json` · [protocol](../../operations/minerals-board-uat-protocol.md)                                                                                                                                                          | L0–L1 lab; L2 = DTF-5.5.4 external                                                                                        |
| DTF-5.4.1 | S-T5-4 | [`circuit-registry.manifest.json`](../../../packages/crypto/circuit-registry.manifest.json)                                                                                                                                                        | `pnpm test --filter @gtcx/crypto`                                                                                         |
| DTF-5.4.2 | S-T5-4 | `zkp-profile-load-*.json` · `zkp-profile-load-latest.json`                                                                                                                                                                                         | `pnpm perf:zkp-profile-load` (≥ 1000 verify/min)                                                                          |
| DTF-5.4.3 | S-T5-4 | [trust-portal-zkp-circuit-registry.md](../../governance/trust-portal-zkp-circuit-registry.md)                                                                                                                                                      | Registry semver + deprecation policy                                                                                      |
| DTF-5.4.4 | S-T5-4 | Protocols E2E witness [`73eaff2b`](https://github.com/gtcx-ecosystem/gtcx-protocols/commit/73eaff2b) · [inbound ack](../../operations/coordination/to-gtcx-protocols-dtf-5-4-4-witness-ack-2026-06-05.md)                                          | Owner repo `gtcx-protocols` — do not duplicate harness YAML here                                                          |
| DTF-5.5.1 | S-T5-5 | Engagement jurisdiction packs under `packages/domain/`                                                                                                                                                                                             | `pnpm jurisdiction:validate-packs`                                                                                        |
| DTF-5.5.2 | S-T5-5 | [`certified-pack-manifest-latest.json`](./certified-pack-manifest-latest.json) · [`certified-pack-pipeline.md`](../../operations/certified-pack-pipeline.md)                                                                                       | `pnpm certified-pack:build-manifest` · `pnpm certified-pack:verify-manifest`                                              |
| FA-S6-02  | S-T5-5 | [`vendor-pen-test-pack-manifest-latest.json`](./vendor-pen-test-pack-manifest-latest.json) · [`pen-test-scope.md`](../../security/pen-test-scope.md)                                                                                               | `pnpm vendor-evidence:build-manifest` · `pnpm vendor-evidence:verify-manifest` · EXT-INF-002 input (infra owns live test) |
| CORE-004  | D3     | **Partial** — [verify JSON](./core-004-trusted-setup-verify-2026-06-04.json) · [engineering closeout](../../operations/coordination/core-004-engineering-closeout-2026-06-06.md) · [transcript README](../../../artifacts/trusted-setup/README.md) | `cargo test -p gtcx-zkp --features trusted-setup-verify --release` exit 0; ceremony `transcript.seed` Class S pending     |

**Trust portal (parent index):** [trust-portal.md](../../governance/trust-portal.md) · **Tier 5 workplan:** [tier-5-workplan-2026-06.md](../../operations/tier-5-workplan-2026-06.md) · **Execution roadmap:** [execution-roadmap.md](../execution-roadmap.md).
