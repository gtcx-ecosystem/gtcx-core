# Cursor Rules — GTCX Core

> **IDE:** Cursor
> **Status:** Current
> **Date:** 2026-05-12

---

## 1. Composer Instructions

When using Cursor Composer for multi-file edits:

- **Always read `AGENTS.md` first** — it contains the canonical repo identity
- **Before citing readiness scores** — read `docs/agents/readiness-and-audit-lanes.md` and `docs/audit/latest.json` (five lanes; 8.9 is lane 4 only)
- **Reference `docs/agents/routing-rules.json`** — know which role owns which files
- **Run verification gates after every edit** — `pnpm format:check && pnpm lint`
- **Use `@` references** — `@AGENTS.md`, `@docs/architecture/overview.md`

---

## 2. Tab Completion Rules

| Context                   | Rule                                                    |
| ------------------------- | ------------------------------------------------------- |
| `packages/crypto/src/`    | Suggest FIPS-aware implementations                      |
| `packages/*/src/index.ts` | Suggest explicit named exports, NOT `export *`          |
| `rust/*/src/lib.rs`       | Suggest `#![deny(unsafe_code, warnings, missing_docs)]` |
| `docs/`                   | Suggest YAML frontmatter on new files                   |
| `tests/`                  | Suggest vitest with coverage annotations                |

---

## 3. Chat Rules

- **@codebase** — Reference `AGENTS.md` for high-level context
- **@file** — Reference specific package specs from `docs/specs/packages/`
- **@web** — Use for market data, FIPS certification status, CMVP listings

---

## 4. Differences from AGENTS.md

| AGENTS.md Prescription | Cursor Override                            |
| ---------------------- | ------------------------------------------ |
| Generic agent          | Cursor IDE-specific composer/chat patterns |
| No IDE rules           | Tab completion contextual rules            |

---

## 5. Fallback

If `.cursor/rules.md` conflicts with `AGENTS.md`, **AGENTS.md wins**.
