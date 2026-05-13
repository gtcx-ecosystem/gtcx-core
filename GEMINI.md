# Gemini Agent Context — GTCX Core

> **Agent:** Google Gemini (gemini-1.5-pro, gemini-1.5-flash)
> **Status:** Current
> **Date:** 2026-05-12

---

## 1. Context Window Strategy

Gemini has a 1M–2M token context window. Use it aggressively:

- **Read the full `AGENTS.md`** — Gemini's context window handles it easily
- **Read the full repo overview** — `docs/overview/README.md` (525 lines)
- **Read the latest master audit** — `docs/audit/master-audit-2026-05-12.md`
- **Read multiple spec files** — Use the large context to hold multiple package specs simultaneously

**Do NOT** use the context-window-constrained reading order from `CLAUDE.md`. Gemini can absorb everything at once.

---

## 2. Multimodal Capabilities

If you have access to image generation:

- Generate architecture diagrams from `docs/architecture/overview.md`
- Generate persona workflow diagrams from `docs/overview/README.md` §3
- Generate market sizing charts from `docs/overview/README.md` §4

Store generated assets in `artifacts/diagrams/` with frontmatter.

---

## 3. Gemini-Specific Tooling

| Tool               | Command                    | Notes                                                   |
| ------------------ | -------------------------- | ------------------------------------------------------- | ------------------------------------- |
| File search        | `find . -name "\*.ts"      | grep "pattern"`                                         | Use `grep -r` for cross-file analysis |
| Code comprehension | Read multiple files        | Leverage large context                                  |
| Grounding          | Search web for market data | Use when `docs/overview/README.md` market data is stale |

---

## 4. Safety Overrides

Gemini does NOT have the same safety constraints as Claude's `.claude/settings.local.json`. You must self-enforce:

- **Never execute destructive commands** (`rm -rf`, `sudo`, `chmod -R`)
- **Never push to git** without explicit human approval
- **Never publish to npm** without SLSA provenance check
- **Always run verification gates** before declaring success

---

## 5. Differences from CLAUDE.md

| CLAUDE.md Prescription                 | Gemini Override              |
| -------------------------------------- | ---------------------------- |
| Read files in strict order             | Read everything at once      |
| Conservative context usage             | Aggressive context usage     |
| No image generation                    | Generate diagrams if capable |
| `.claude/settings.local.json` enforced | Self-enforce safety rules    |

---

## 6. Fallback

If `GEMINI.md` conflicts with `AGENTS.md`, **AGENTS.md wins**.
