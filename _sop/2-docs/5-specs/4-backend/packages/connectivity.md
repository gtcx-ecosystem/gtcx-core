# Package Spec — `@gtcx/connectivity`

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Network connectivity detection and profile classification for field environments. Detects online/offline state, classifies the quality of available connectivity (GPRS, broadband, metered), and emits state-change events. Used by `@gtcx/sync` to determine when and how aggressively to sync, and by offline-capable services to switch between local and remote operation.

---

## Public API

### Connectivity Detector

| Export                        | Description                                                         |
| ----------------------------- | ------------------------------------------------------------------- | ------- | --------- |
| `ConnectivityDetector`        | Class: polls connectivity and emits state changes                   |
| `ConnectivityDetectorOptions` | Type: polling interval, check function, listener registration       |
| `ConnectivityCheckFn`         | Type: `() => Promise<ConnectivityCheckResult>` — pluggable check    |
| `ConnectivityCheckResult`     | Type: `{ online: boolean; latencyMs?: number; bandwidth?: number }` |
| `ConnectivityListener`        | Type: callback invoked on state change                              |
| `ConnectivityState`           | Type: `online                                                       | offline | degraded` |

### Profile Classification

| Export                         | Description                                         |
| ------------------------------ | --------------------------------------------------- | ---- | --------- | ------- | -------- |
| `classifyProfile(checkResult)` | Classify a check result into a connectivity profile |
| `ConnectivityProfile`          | Type: `gprs                                         | edge | broadband | metered | offline` |

---

## Connectivity Profiles

| Profile     | Criteria                                                      |
| ----------- | ------------------------------------------------------------- |
| `gprs`      | Online, latency > 500ms or bandwidth < 256kbps                |
| `edge`      | Online, latency 200–500ms or bandwidth 256–1024kbps           |
| `broadband` | Online, latency < 200ms and bandwidth > 1Mbps                 |
| `metered`   | Online but flagged as metered connection (conserve bandwidth) |
| `offline`   | Not online                                                    |

---

## Dependencies

No `@gtcx/*` dependencies. This is a standalone utility with no production npm dependencies.

---

## Non-Goals

- Does not manage sync scheduling — `@gtcx/sync` uses profiles to determine sync strategy
- Does not buffer or queue messages when offline — `@gtcx/events` handles offline buffering
- Does not manage network transport — `@gtcx/network`

---

## Implementation

`packages/connectivity/src/`

---

## Reference

- [`_sop/2-docs/5-specs/4-backend/packages/sync.md`](./sync.md) — primary consumer
- [`_sop/2-docs/5-specs/4-backend/core-spec.md`](../core-spec.md) — system overview and operational SLOs
