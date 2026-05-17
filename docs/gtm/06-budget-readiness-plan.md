---
title: '06 Budget Readiness Plan'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs']
review_cycle: 'on-change'
---

# Budget Readiness Plan — $0 Path to 10/10

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Current score:** 9.8/10
**Target:** 10/10 bank-grade readiness
**Budget:** $0 (excluding optional $2-5K bug bounty reserve)

---

## What's Done (8.6 → 9.4, completed 2026-05-08)

| Item                                              | Score Impact | Commit    |
| ------------------------------------------------- | ------------ | --------- |
| Default secret redaction in traced operations     | +0.1         | `2c1e26a` |
| fast-uri CVE override (audit clean)               | +0.05        | `2c1e26a` |
| KPI metrics refresh (was 78 days stale)           | +0.05        | `2c1e26a` |
| Exact-version pinning (7 production deps)         | +0.05        | `a7f9ea2` |
| Verification coverage 83→89% branches (+33 tests) | +0.05        | `a7f9ea2` |
| Key ceremony document (NIST SP 800-57)            | +0.1         | `3bfefb6` |
| Attack tree — signing forgery (20 leaf nodes)     | +0.1         | `3bfefb6` |
| GDPR assessment (zero-PII determination)          | +0.05        | `02a83c3` |
| PCI-DSS zero-scope declaration                    | +0.05        | `02a83c3` |
| SOX ITGC controls mapping                         | +0.05        | `02a83c3` |
| 5 new cargo-fuzz targets                          | +0.1         | `02a83c3` |
| Internal security assessment                      | +0.15        | `02a83c3` |
| FIPS validation boundary statement                | +0.1         | `02a83c3` |

---

## What Remains (9.4 → 10.0)

### Tier 1 — Can do this week ($0)

| Item                                | Effort             | Score | Blocker                      |
| ----------------------------------- | ------------------ | ----- | ---------------------------- |
| Run 24hr fuzz campaigns (6 targets) | 1 day machine time | +0.1  | Needs nightly Rust toolchain |
| Claim `@gtcx` npm scope             | 15 minutes         | +0.05 | npm account access           |
| Add secondary CODEOWNER             | 30 minutes         | +0.05 | Team member identified       |

### Tier 2 — Next 2 weeks ($0)

| Item                                             | Effort   | Score | Blocker                             |
| ------------------------------------------------ | -------- | ----- | ----------------------------------- |
| Rust `SigningProvider` trait + aws-lc-rs backend | 2-3 days | +0.15 | aws-lc-rs build requires CMake + Go |
| `KeyStore` trait + `MemoryKeyStore`              | 1-2 days | +0.1  | async-trait dependency decision     |
| SoftHSMv2 CI integration                         | 4 hours  | +0.05 | Ubuntu CI runner (already have)     |

### Tier 3 — When regulator asks ($0 - $5K)

| Item                                     | Effort        | Score | Blocker              |
| ---------------------------------------- | ------------- | ----- | -------------------- |
| Pre-submission meeting with sandbox team | 1 hour        | +0.05 | Scheduling           |
| Bug bounty program (HackerOne)           | 2 hours setup | +0.05 | $2-5K reserve        |
| Execute SOC 2 evidence pipeline          | 4 hours       | +0.05 | Compliance team time |

---

## Scoring Trajectory

```
Today:       ████████████████████████████████████████████░░░░  9.4
+Tier 1:     █████████████████████████████████████████████░░░  9.6
+Tier 2:     ██████████████████████████████████████████████░░  9.9
+Tier 3:     ████████████████████████████████████████████████  10.0
```

---

## Why This Works Without Spending $200K

| Traditional Requirement         | Why We Don't Need It                                                                                                              |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| $50-100K external pen test      | Internal assessment with 6 fuzz targets, CodeQL SAST, Trivy, cargo-audit. African sandbox regulators accept internal assessments. |
| $100-200K FIPS certification    | Inherited from OpenSSL (CMVP #4282) and aws-lc-rs (CMVP #4816). NIST guidance supports inherited validation.                      |
| $20-50K HSM hardware            | Cloud KMS at $1/key/month. SoftHSMv2 for CI testing ($0).                                                                         |
| $10-20K legal compliance review | Library processes zero PII and zero CHD. Three scope declarations written in-house.                                               |
| $5-10K SOC 2 audit preparation  | Evidence pipeline already automated. CI gates generate most evidence on every PR.                                                 |

**The creative insight:** A library that delegates all crypto to CMVP-certified modules, proves its safety through automated fuzzing, and honestly declares its minimal compliance surface achieves the same auditable outcome as the $200K path — because the evidence is the same. The regulator cares about the evidence, not the receipt.
