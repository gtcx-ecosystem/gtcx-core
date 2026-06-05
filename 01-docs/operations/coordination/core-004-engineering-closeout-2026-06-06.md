---
title: 'CORE-004 — engineering closeout (Class R)'
status: current
date: 2026-06-06
owner: gtcx-core
role: crypto-security-engineer
document_id: CORE-004-ENG-CLOSE
tier: standard
tags: ['core-004', 'trusted-setup', 'witness', 'protocol-22']
review_cycle: on-change
---

# CORE-004 — engineering closeout (Class R)

**Story:** D3 M3.2 trusted-setup verification · **Not:** INF-86 XR-402 KMS (protocols — done)

## Class R complete (in-repo)

| Gate                       | Command                                                            | Exit                                       |
| -------------------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| Trusted-setup verify suite | `cargo test -p gtcx-zkp --features trusted-setup-verify --release` | **0**                                      |
| Publish gate script wired  | `pnpm ops:trusted-setup:verify-publish`                            | exits 1 until `transcript.seed` (expected) |
| CI                         | `.github/workflows/ci.yml` trusted-setup + conditional KAT pin     | wired                                      |

Evidence:

- [`core-004-trusted-setup-verify-2026-06-04.json`](../../audit/evidence/core-004-trusted-setup-verify-2026-06-04.json)
- [`core-004-engineering-closeout-2026-06-06.json`](../../audit/evidence/core-004-engineering-closeout-2026-06-06.json)

## Class S remainder (parallel — not repo block)

1. Sovereign ZKP ceremony → `artifacts/trusted-setup/transcript.seed` + `manifest.json`
2. `pnpm ops:trusted-setup:verify-publish` → exit 0
3. Production KAT pin activation

Checklist: [core-004-ceremony-publish-checklist.md](./core-004-ceremony-publish-checklist.md)

## P22

Engineering drain **done** — launch implement queue advances to **LAUNCH-PLAN-01**. Commercial ceiling **DTF-5.5.4** remains Class S only.
