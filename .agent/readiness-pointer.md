## Readiness & audit lanes (canonical — all agents)

**Read before citing scores:** `01-docs/01-agents/readiness-and-audit-lanes.md` · SSOT: `01-docs/05-audit/readiness-model.md` · `01-docs/05-audit/latest.json`

| Lane                   | Readiness (current)              | Index                                                             |
| ---------------------- | -------------------------------- | ----------------------------------------------------------------- |
| 1 Engineering          | 9.5 completion / 10.0 signoff    | `01-docs/05-audit/engineering-completeness-quality-2026-06-05.md` |
| 2 Internal compliance  | **9.0** (5 domains)              | `01-docs/05-audit/internal-compliance-2026-06-05.md`              |
| 3 Industry Compliance  | **IC-T0** OPEN 0/12              | `01-docs/05-audit/industry-compliance-2026-06-05.md`              |
| **GCR** (rollup L2+L3) | **GCR-T0** **BLOCKED**           | `01-docs/05-audit/global-compliance-rating-2026-06-05.md`         |
| 4 Bank-grade           | **8.9** composite only           | `01-docs/05-audit/bank-grade-2026-06-05.md`                       |
| 5 GTM-Readiness        | **GR-T1** / sovereign &lt; GR-T2 | `01-docs/05-audit/gtm-readiness-2026-06-05.md`                    |

**Anti-drift:** 1–10 = audit _quality_ unless labeled readiness. Never use 8.9 for engineering. Industry/GTM use **tiers**, not 1–10 delivery. Deprecated: external-dependent lane, lane-2-only ~9.6, S1/S2 without GR-T.

**Check:** `pnpm readiness:lanes:check` · after audit doc edits update indexes + `latest.json` then `pnpm agent:sync`.
