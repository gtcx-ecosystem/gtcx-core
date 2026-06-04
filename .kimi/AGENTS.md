# Kimi — GTCX Core Agent Protocol

> **Read first:** `../AGENTS.md` (shared protocol for all agents)
> **This doc:** Kimi Code CLI specifics for GTCX Core
> **Date:** 2026-05-25
> **Version:** 1.0

---

## Kimi-Specific Setup

### Available Tools

Kimi Code CLI provides these tools for GTCX Core development:

| Tool | Best Use |
|------|----------|
| `ReadFile` | Read source files, docs, configs |
| `WriteFile` | Create new files. Use `append` mode after first write |
| `StrReplaceFile` | **Preferred** for edits. Can batch replacements |
| `Shell` | Run bash. Chain with `&&` |
| `Agent` | Delegate subtasks. Types: `coder`, `explore`, `plan` |
| `Grep` | Search code. Prefer over `Shell grep` |
| `Glob` | Find files. Use patterns like `src/**/*.ts` |

### Conventions

1. **Parallel reads:** Read multiple files in one turn when possible
2. **Grep over Shell:** Use `Grep` tool, never `Shell grep`
3. **Explore before code:** Use `explore` subagents for codebase research
4. **Quality gates:** Run tests before committing
5. **Readiness scores:** Read `../docs/agents/readiness-and-audit-lanes.md` and `../docs/audit/latest.json` before citing 8.9, IC-T*, GR-T*, or GCR. Never use bank-grade **8.9** as engineering readiness.
6. **Protocols P22–P28:** Session phases 5.4–5.7 in `../AGENTS.md`; verify `pnpm agent:protocols:check`.

**GCR today:** **GCR-T0** · **BLOCKED** — `../docs/audit/global-compliance-rating-2026-06-05.md`
