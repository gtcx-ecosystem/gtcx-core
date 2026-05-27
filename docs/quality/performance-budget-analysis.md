---
title: 'Performance Budget Analysis'
status: 'current'
date: '2026-05-27'
owner: 'quality-evidence-lead'
role: 'quality-evidence-lead'
tier: 'standard'
tags: ['quality', 'performance', 'benchmarks']
review_cycle: 'weekly'
---

# Performance Budget Analysis — gtcx-core

> **Status:** Current
> **Date:** 2026-05-27
> **Owner:** Performance Engineer
> **Source data:** `benchmarks/latest-results.json` (recorded 2026-05-19)
> **Metrics tracked:** 13 performance metrics across crypto, ZKP, and connectivity

---

## Executive Summary

All 13 performance metrics are within budget. **Zero budget violations.** One metric (`connectivity.batch_add_edge_ns`) shows elevated variance and warrants trend monitoring as sample size grows.

| Category                             | Metrics | Status           | Trend Samples |
| ------------------------------------ | ------- | ---------------- | ------------- |
| Cryptography (Ed25519)               | 4       | ✅ Within budget | 1 sample      |
| Hashing (SHA-256/512, BLAKE3)        | 3       | ✅ Within budget | 1 sample      |
| ZKP (Groth16, Bulletproofs, Schnorr) | 5       | ✅ Within budget | 1 sample      |
| Connectivity                         | 1       | ⚠️ Monitor       | 1 sample      |

**Critical finding:** All metrics currently have **only 1 trend sample** (recorded 2026-05-19). The `perf:check-budgets` gate passes but emits warnings because 4+ weeks of trend data are required for statistical confidence. This is tracked as `PERF-01` in the master audit.

---

## Cryptography Performance

### Ed25519 Signing

| Metric         | Value   | Budget  | Margin    | Assessment |
| -------------- | ------- | ------- | --------- | ---------- |
| Key generation | 31.8 μs | <100 μs | 68% under | Excellent  |
| Sign           | 32.2 μs | <100 μs | 68% under | Excellent  |
| Verify         | 44.7 μs | <100 μs | 55% under | Excellent  |
| Roundtrip      | 76.0 μs | <200 μs | 62% under | Excellent  |

**Interpretation:** Ed25519 operations are 2–3× faster than budget. This headroom is intentional — it accommodates slower devices (5-year-old Android) that buying station agents use.

### Hashing

| Metric         | Value      | Budget    | Margin    | Assessment |
| -------------- | ---------- | --------- | --------- | ---------- |
| SHA-256 (256B) | 1,239.5 ns | <5,000 ns | 75% under | Excellent  |
| SHA-512 (256B) | 954.5 ns   | <5,000 ns | 81% under | Excellent  |
| BLAKE3 (256B)  | 410.7 ns   | <2,000 ns | 79% under | Excellent  |

**Interpretation:** BLAKE3 is 3× faster than SHA-256 and 2.3× faster than SHA-512 for small inputs. This validates the decision to use BLAKE3 as the default hash in performance-critical paths.

---

## Zero-Knowledge Proof Performance

### Groth16 (GCI Threshold)

| Metric | Value    | Budget    | Margin    | Assessment |
| ------ | -------- | --------- | --------- | ---------- |
| Prove  | 273.1 ms | <1,000 ms | 73% under | Good       |
| Verify | 11.0 ms  | <100 ms   | 89% under | Excellent  |

**Interpretation:** Proving is the expensive operation (273 ms). This is acceptable because proving runs server-side or on buying station tablets (not on miner phones). Verification at 11 ms is fast enough for real-time QR code scanning.

### Bulletproofs (Amount Range)

| Metric | Value  | Budget | Margin    | Assessment |
| ------ | ------ | ------ | --------- | ---------- |
| Prove  | 3.6 ms | <50 ms | 93% under | Excellent  |
| Verify | 1.0 ms | <10 ms | 90% under | Excellent  |

**Interpretation:** Bulletproofs are extremely fast — suitable for mobile devices. Range proofs for transaction amounts can be generated and verified on low-end hardware without perceptible delay.

### Schnorr (Identity Attributes)

| Metric | Value   | Budget | Margin    | Assessment |
| ------ | ------- | ------ | --------- | ---------- |
| Prove  | 0.10 ms | <5 ms  | 98% under | Excellent  |
| Verify | 0.10 ms | <5 ms  | 98% under | Excellent  |

**Interpretation:** Schnorr identity proofs are effectively free (<0.1 ms). This enables high-frequency identity verification without batching.

---

## Connectivity Performance

### Profile Classification & Adaptation

| Metric             | Value | Budget  | Margin    | Assessment |
| ------------------ | ----- | ------- | --------- | ---------- |
| Classify offline   | 3 ns  | <100 ns | 97% under | Excellent  |
| Classify USSD-only | 13 ns | <100 ns | 87% under | Excellent  |
| Classify edge      | 14 ns | <100 ns | 86% under | Excellent  |
| Adapt offline      | 25 ns | <200 ns | 88% under | Excellent  |
| Adapt USSD-only    | 26 ns | <200 ns | 87% under | Excellent  |
| Adapt edge         | 23 ns | <200 ns | 89% under | Excellent  |

**Interpretation:** Profile classification and adaptation are sub-microsecond operations. These run on every API request without adding measurable latency. The 500,000-iteration benchmarks confirm stability.

### Batch Operations

| Metric                   | Value  | Budget    | Margin    | Assessment    |
| ------------------------ | ------ | --------- | --------- | ------------- |
| Batch add (edge profile) | 744 ns | <2,000 ns | 63% under | Good, monitor |

**Interpretation:** Batch operations show higher variance across runs. With only 1 trend sample, we cannot distinguish between normal variance and regression. **Action:** collect 3 more weekly samples before making a determination.

---

## Trend Sample Gap Analysis

| Metric         | Current Samples | Target (4 weeks) | Gap    | Status              |
| -------------- | --------------- | ---------------- | ------ | ------------------- |
| All 13 metrics | 1               | 4                | 3 each | ⚠️ Warnings emitted |

**Remediation:** Run `bench:connectivity-adaptive` weekly and append results to `benchmarks/history.json`. The `perf:check-budgets` gate will transition from ⚠️ to ✅ when all metrics have ≥4 samples.

---

## Recommendations

1. **Collect trend samples weekly** until all 13 metrics have 4+ samples (3 weeks remaining)
2. **Monitor `connectivity.batch_add_edge_ns`** for variance — if it exceeds 1,500 ns in 2 of 4 samples, investigate
3. **Document device-class performance** — run Ed25519 benchmarks on a 5-year-old Android to validate "buying station tablet" assumptions
4. **Add ZKP memory budget** — proving times are acceptable but RAM usage (not currently tracked) may be the bottleneck on low-end devices

---

_Analysis generated from `benchmarks/latest-results.json` (2026-05-19) and `benchmarks/performance-budgets.json`._
