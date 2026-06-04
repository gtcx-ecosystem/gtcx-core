# GitHub Copilot Instructions — GTCX Core

> **Agent:** GitHub Copilot (inline completion + Copilot Chat)
> **Status:** Current
> **Date:** 2026-05-12

---

## 1. Inline Completion Context

Copilot should be aware of:

- **Repo identity:** `gtcx-core` is a bank-grade cryptographic foundation for African commodity traceability
- **Key constraints:** FIPS 140-3 verified, zero unsafe Rust code, signed commits required
- **Package boundaries:** Dependencies flow one way — no circular deps
- **Security-sensitive paths:** `packages/crypto/`, `rust/gtcx-crypto/`, `rust/gtcx-zkp/` require extra care

---

## 2. Copilot Chat Context

When users ask Copilot Chat questions about this repo:

- **"What does this repo do?"** → Reference `docs/overview/README.md` §1-2
- **"Is this secure?"** → Reference `docs/security/threat-control-matrix.md`
- **"What's the repo score / readiness?"** → `docs/agents/readiness-and-audit-lanes.md` + `docs/audit/latest.json` (8.9 is bank-grade lane 4 only)
- **"How do I add a package?"** → Reference `docs/agents/workflows/tasks/add-package.md`
- **"What's the build command?"** → `pnpm build` for TS, `cargo build --workspace` for Rust

---

## 3. Pull Request Context

When Copilot generates PR descriptions:

- Use conventional commit format
- Reference the routing rules to tag correct reviewers
- Include verification gate results
- Note if security-sensitive packages are touched

---

## 4. Differences from AGENTS.md

| AGENTS.md Prescription      | Copilot Override               |
| --------------------------- | ------------------------------ |
| Full session-start protocol | Lightweight inline context     |
| Machine-readable docs       | Human-readable inline comments |

---

## 5. Fallback

If `.github/copilot/instructions.md` conflicts with `AGENTS.md`, **AGENTS.md wins**.
