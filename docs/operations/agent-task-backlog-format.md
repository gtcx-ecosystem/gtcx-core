---
title: 'Agent task backlog format (developer-friendly priorities)'
status: current
date: 2026-06-04
owner: gtcx-core
role: protocol-architect
document_id: OPS-AGENT-TASK-BACKLOG
tags: ['agents', 'backlog', 'gtm']
review_cycle: on-change
---

# Task backlog format

**Use:** “Next priorities” / “task queue” — **not** “sensible next slices” or wave codes alone.

Wave labels (W1, W3, F-52) stay as **traceability** to product inventories (e.g. `multia-feature-screen-inventory.md` in exploration-os).

## Required columns

| Column            | Field                    | Example                                        |
| ----------------- | ------------------------ | ---------------------------------------------- |
| **ID**            | Stable task ID           | `EOS-UX-052`, `CORE-004`, `INT-R5-03`          |
| **Priority**      | P0–P3                    | P1                                             |
| **Repo**          | Owner repo               | `exploration-os`, `gtcx-core`                  |
| **Task**          | Imperative title         | Marketplace product-detail body density        |
| **Primary files** | Paths agents edit        | `app/screens/product-detail.tsx`               |
| **Done when**     | Verifiable exit          | M8 parity with multia-main; `pnpm test` exit 0 |
| **GTM lever**     | Which dimension moves    | B +0.4 (W1 workflow); C unchanged (UI only)    |
| **Bout Δ**        | Realistic composite bump | `{ "workflow": 0.4, "gtmBuyer": 0 }`           |

## Example (product repo bout)

| ID          | Pri | Repo           | Task                               | Primary files                                            | Done when                                  | GTM lever           |
| ----------- | --- | -------------- | ---------------------------------- | -------------------------------------------------------- | ------------------------------------------ | ------------------- |
| EOS-UX-012  | P1  | exploration-os | Intelligence summary metrics strip | `SummaryTab.tsx`, `IntelligenceMetricStrip.tsx`          | Strip wired; no legacy circle-card row     | B verify/close      |
| EOS-UX-052  | P1  | exploration-os | Product-detail M8 density          | `product-detail.tsx`, `EquipmentMetricStrip.tsx`         | Metric strip + spec blocks + sticky footer | B +0.4              |
| EOS-UX-003  | P2  | exploration-os | Permission screens layout          | `location-permission.tsx`, `notification-permission.tsx` | `PermissionGateLayout` + i18n/a11y         | B first-run         |
| EOS-OPS-001 | P3  | gtcx-agentic   | Push exploration-os commits        | `scripts/ecosystem/push-all-repos.mjs`                   | Branch not ahead-only locally              | Ops — not GTM stage |

## Machine-readable

Store in `.baseline/bout-progress.config.json` → `tasks[]` or repo-specific `docs/operations/bout-tasks.json`.

Agents read tasks on session start via `progressGauge.activeTasks`.

## Forbidden phrasing

- “Sensible next slices”
- Operator pick menus on wave W1
- Reporting only wave codes without ID, files, done-when

## Related

- [agent-bout-progress-gauge.md](agent-bout-progress-gauge.md)
- Example exploration-os config: [examples/bout-progress-exploration-os.config.json](examples/bout-progress-exploration-os.config.json)
