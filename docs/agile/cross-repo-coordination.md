---
title: 'Cross-Repo Coordination'
status: 'current'
date: '2026-05-22'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['agile', 'coordination', 'cross-repo']
review_cycle: 'on-change'
---

# Cross-Repo Coordination

> **Status:** Current
> **Date:** 2026-05-22
> **Owner:** Protocol Architect

Append-only operational tracker for active coordination threads between gtcx-core and other repos in the gtcx-ecosystem. One section per active thread; each carries: state, outbound commitments (what we owe them), inbound commitments (what they owe us), open items, last update, next checkpoint.

Each thread closes when no open items remain on either side; the section moves to the [archive](#archive) but stays in the doc as a stable record.

## Active threads at a glance

| Repo           | State                             | Our open items                                         | Their open items                                                                        | Next checkpoint                                        |
| -------------- | --------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `gtcx-mobile`  | **Active — W1 of 30-day rollout** | Drop in on standup if 7-linked-group major bump needed | Fire `release.yml` ≤2026-05-26; polyfill + retire local @gtcx/crypto fork in Sprint 22+ | Daily 09:00 GMT in `#gtcx-mobile-prod` (mobile-hosted) |
| `gtcx-agentic` | Deferred — Sprint 22+ items       | None until calibration reports start flowing           | MCP runtime transport selection; UX-doc protocol CI gate as audit finding               | Mobile sends calibration reports W3+ → kicks off       |

---

## gtcx-mobile

**Driver:** gtcx-mobile is in 30-day production rollout across 5 countries (2026-05-24 → end of June). Their cryptographic dependencies trace back to `@gtcx/crypto` and `@gtcx/types` in gtcx-core, so a poorly-timed breaking change here cascades into a production incident there.

**Source-of-truth thread:** `gtcx-mobile/docs/gtm/external-tracking/gtcx-core-tickets.md` (their side; we have no equivalent file — this section IS our equivalent).

### State

| Field                | Value                                                      |
| -------------------- | ---------------------------------------------------------- |
| Phase                | **W1 of 30-day rollout**                                   |
| Window               | 2026-05-24 → 2026-06-22 (W8 close)                         |
| Standup channel      | `#gtcx-mobile-prod` Slack, daily 09:00 GMT (mobile-hosted) |
| gtcx-core attendance | Drop-in for 7-linked-group sign-off events only            |

### Outbound — what gtcx-core has committed to mobile

- **W1-W8 sign-off convention** — no major bump to any linked-group member (`@gtcx/types`, `@gtcx/crypto`, `@gtcx/identity`, `@gtcx/verification`, `@gtcx/domain`, `@gtcx/schemas`, `@gtcx/security`) without explicit gtcx-mobile engineering-lead sign-off via PR description mention or PR comment. Operationalized via `#gtcx-mobile-prod` post per [api-change-migration-policy.md §Time-Bound Consumer Sign-Off Conventions](../release/api-change-migration-policy.md#time-bound-consumer-sign-off-conventions). Auto-archives 2026-06-22.
- **`deriveKeyPbkdf2` upstreamed** — shipped in commit `ab3f544`, exported from `@gtcx/crypto`, validated against RFC 7914 §11 vectors. Implementation is canonical-only (no iterated-SHA-256 fallback); see [JSDoc](../../packages/crypto/src/key-derivation.ts) for the React Native polyfill guidance landed in `3ca5eb2`.
- **Mobile-development-plan stub-comment correction** — mobile fixed their `mobile-development-plan.md:72` line on their side (commit `d10e3f9` in their repo).

### Inbound — what gtcx-mobile has committed to us

- **Fire the npm publish trigger** within 48h of 2026-05-24 (so by ~2026-05-26) — `gh workflow run release.yml --repo gtcx-ecosystem/gtcx-core --ref main`. Unblocked by [`cc513b7`](https://github.com/gtcx-ecosystem/gtcx-core/commit/cc513b7) which fixed the lockfile that had broken the last 3 push-triggered runs.
- **Retire mobile's local `packages/crypto/` fork** in Sprint 22+ after they land a `react-native-quick-crypto` polyfill at app boot (or equivalent WebCrypto polyfill). Decoupled from publish timing.
- **Ping `#gtcx-mobile-prod`** when the publish lands so other ecosystem teams know to switch from `workspace:*` to pinned npm versions.

### Open items (either side)

- [ ] gtcx-mobile fires the publish (≤2026-05-26)
- [ ] gtcx-mobile lands react-native-quick-crypto polyfill (Sprint 22+)
- [ ] gtcx-mobile retires local `packages/crypto/` fork after polyfill (Sprint 22+)
- [ ] gtcx-core: monitor `#gtcx-mobile-prod` for 7-linked-group sign-off requests during W1-W8

### Last update

- **2026-05-24** — gtcx-mobile accepted broader-than-asked 7-linked-group convention; confirmed canonical-only PBKDF2 was correct; identified Hermes-no-WebCrypto polyfill gap as their responsibility; committed to fire publish within 48h. gtcx-core landed defensive doc additions (`3ca5eb2`) for runtime requirements and sign-off surface.

---

## gtcx-agentic

**Driver:** Two items mobile flagged as Sprint 22+ for gtcx-agentic — not active blockers, just visible so they don't get lost when mobile's calibration-report stream begins.

### State

| Field                     | Value                                            |
| ------------------------- | ------------------------------------------------ |
| Phase                     | **Deferred — Sprint 22-24**                      |
| Trigger for re-engagement | Mobile begins shipping calibration reports (W3+) |

### Outbound — what gtcx-core has committed to gtcx-agentic

- None currently. Coordination is via mobile's Message 8; we are observers until calibration reports start flowing.

### Inbound — what gtcx-agentic owns (per mobile)

- **MCP server runtime for `@gtcx/agents-mcp`** — currently ships pure-function tools + tool descriptors; transport selection (Anthropic remote MCP vs local stdio vs SSE) deferred until a regulator asks to integrate. Sprint 22-24.
- **UX-doc protocol CI gate** — `gtcx-agentic/protocols/ux-doc-protocol.md` could be enforced by master-audit as an ecosystem-wide finding. Nice-to-have; no fixed date.
- **Reverse dep:** consume calibration reports from `gtcx-mobile/scripts/calibration-report.mjs` for eval-set refinement (W3+ cadence).

### Open items

- [ ] gtcx-agentic: pick up Sprint 22+ items when calibration stream begins

### Last update

- **2026-05-22** — captured from mobile's Message 8. No direct gtcx-core / gtcx-agentic communication this session.

---

## Pending threads (likely to open after the npm publish)

Once `gh workflow run release.yml` fires and the `@gtcx/*` packages land on npm with provenance, multiple ecosystem repos can migrate from `workspace:*` to pinned npm versions. Each migration is a separate coordination thread we should expect to open:

| Repo                  | Likely trigger                                    | Expected ask                                                                                                                                    |
| --------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `gtcx-protocols`      | npm publish lands                                 | Pin to published `@gtcx/crypto`, `@gtcx/types`, `@gtcx/workproof` versions; coordinate on `@gtcx/workproof` major bump (CompositeValue removal) |
| `gtcx-intelligence`   | npm publish lands                                 | Pin to published `@gtcx/ai`, `@gtcx/telemetry`                                                                                                  |
| `gtcx-platforms`      | npm publish lands                                 | Pin foundation tier across `agx`, `crx`, etc.                                                                                                   |
| `gtcx-infrastructure` | npm publish lands                                 | Pin SLSA-attested `@gtcx/security` for build supply chain                                                                                       |
| `baseline-os`         | npm publish lands AND vault initialization landed | Pin `@gtcx/crypto-native` for KMS keystore boundary; coordinate on credential flow                                                              |

These don't need pre-publish coordination from us; they're listed so we have a placeholder when each repo opens a thread.

---

## Archive

_No archived threads yet — the 2026-05-22 mobile thread is the first one we have recorded under this convention._
