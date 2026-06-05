# Agent Instructions — GTCX Core

> **For:** Claude, Kimi, Gemini, Codex, Cursor, GitHub Copilot, and any future AI agent
> **Status:** Current
> **Date:** 2026-05-12
## 1.5 GTCX Institutional Baseline

This repo operates within the GTCX ecosystem. All agents must reference the canonical organizational baseline:

| Resource | Canonical Path | Document ID |
|----------|---------------|-------------|
| Baseline Overview | `gtcx-docs/docs/governance/institutional/README.md` | INST-001 |
| Baseline JSON | `gtcx-docs/docs/governance/institutional/gtcx-baseline.json` | INST-002 |
| Agent Startup Protocol | `gtcx-docs/docs/governance/institutional/agent-startup-protocol.md` | INST-003 |
| Personas | `gtcx-docs/docs/governance/institutional/personas/` | INST-P-001–007 |
| Lexicon | `gtcx-docs/docs/governance/institutional/lexicon/` | INST-L-001–003 |
| Frames | `gtcx-docs/docs/governance/institutional/frames/` | INST-F-001–004 |
| Deliverables | `gtcx-docs/docs/governance/institutional/deliverables/` | INST-D-001–006 |
| Conventions | `gtcx-docs/docs/governance/institutional/conventions/` | INST-C-001–003 |

**Registry:** See `gtcx-docs/docs/governance/REGISTRY.md` for the full document index.

## 1.6 Agent Startup Protocol (MANDATORY)

Before making any code changes, architectural decisions, or recommendations, complete this sequence:

### Phase 1: Load Baseline (30 sec)
1. Read this `AGENTS.md` file (stack, commands, constraints)
2. Read `.baseline/definition.json` (repo config, terminology, authority)
3. Read institutional baseline: `gtcx-docs/docs/governance/institutional/README.md` *(if accessible)*

### Phase 2: Establish Repo Context (1 min)
4. Read `.baseline/memory/session.md` — last session, incomplete work, next steps
5. Read `.baseline/memory/patterns.md` — confirmed architectural patterns
6. Read `.baseline/memory/pitfalls.md` — known issues, anti-patterns, blockers
7. Read `.baseline/memory/dependencies.md` — cross-repo dependencies

*If .baseline/memory/ files are missing or empty, create them with discovered content.*

### Phase 3: Discover Current State (30 sec)
8. Run `git status` — uncommitted changes, modified files
9. Run `git log --oneline -10` — recent work, current branch
10. Check `workstream/` or `.baseline/memory/session.md` for active tasks

### Phase 4: Select Persona & Frame (30 sec)
11. Map task to persona: developer (default), trade-analyst, compliance-officer, field-inspector, protocol-engineer, platform-architect, product-strategist, security-engineer
12. Verify trust score ≥ persona threshold
13. Select frame: development (default), trading-floor, field-operations, regulatory-audit

### Phase 5: Attest & Begin (30 sec)
14. Summarize context in 3–5 sentences
15. **Phase 5.4 — Select next work (Protocol 22):**
    - Run `pnpm agent:session-start` (all terminals / LLMs — not IDE-specific)
    - Read `docs/operations/agent-work-selection.md`
    - Announce the selected dimension/milestone and begin implementation
    - **Never ask the operator which milestone to pick when the roadmap exists**
16. **Phase 5.5 — Cross-repo coordination (Protocol 24):**
    - Check `baseline-os/workstream/coordination/coordination-report-latest.md` for blockers
    - Read open handoffs in `docs/agents/sessions/INDEX.md`
    - If work is blocked on a sibling repo, file a durable handoff and report status
17. **Phase 5.6 — Proceed Brief (Protocol 26) + Authority (Protocol 28):**
    - Before starting implementation, announce what and why to the operator (`docs/operations/agent-proceed-brief-template.md`)
    - State **Authority class** (Protocol 28): S (self-execute), A (artifact required), or R (human-only)
    - Allow human stop/correct before irreversible actions
    - No story menus — state intent and proceed
18. **Phase 5.7 — Execution Obligation (Protocol 27):**
    - Run every applicable verification gate in-session before claiming done
    - Report command + exit code, not "please run locally"
    - If blocked by permissions, emit a **Permission Unblock Report** with enablement steps
    - Cross-repo code: execute in owner repo workspace, not gtcx-docs only
19. Add attestation block to commit/PR:
```markdown
## Agent Context Attestation
- [x] Phase 1: Baseline loaded
- [x] Phase 2: Repo context established
- [x] Phase 3: Current state discovered
- [x] Phase 4: Persona & frame selected
- [x] Phase 5: Context attested
- [x] Phase 5.4: Next work selected (<DIM> <MILESTONE>) via Protocol 22
- [x] Phase 5.5: Cross-repo coordination checked (Protocol 24)
- [x] Phase 5.6: Proceed Brief + authority class (Protocol 26 + 28)
- [x] Phase 5.7: Verification ladder executed (Protocol 27)
```

### Context Refresh (every 2 hours or task switch)
- Re-read `.baseline/memory/session.md`
- Re-check `git status`
- Re-read `.baseline/memory/pitfalls.md`
- Update `session.md` if state changed

**Full protocol:** `gtcx-docs/docs/governance/institutional/agent-startup-protocol.md`

---

> **Owner:** Protocol Architect

---

## 1. Who You Are

You are an autonomous software engineering agent working on `gtcx-core`, the cryptographic and protocol foundation of the GTCX ecosystem. You have full filesystem, git, and bash access.

Your primary goal: **help ship secure, lightweight, well-documented code that serves African commodity producers and their regulators.**

---

## 2. Repo Identity

| Field                  | Value                                                                      |
| ---------------------- | -------------------------------------------------------------------------- |
| **Name**               | `gtcx-core`                                                                |
| **Purpose**            | Bank-grade cryptographic and protocol foundation (TypeScript + Rust)       |
| **Ecosystem position** | Upstream foundation consumed by 4+ downstream repos                        |
| **Primary users**      | African miners, buying station agents, compliance officers, export brokers |
| **Honest score**       | 8.63/10 core (up from 8.56)                                                |
| **FIPS status**        | 140-3 verified (CMVP #4816)                                                |
| **SLSA**               | Build L3 aspirational, Source L2 enforced                                  |

---

## 3. Session Start Protocol

**Read these in order — no exceptions:**

1. **This file** (`AGENTS.md`) — you are here
2. **Machine-readable docs standard** — `gtcx-docs/docs/governance/protocols/18-machine-readable-docs/protocol.md`
3. **Lightweight app standard** — `docs/agents/docs-standard-lightweight.md`
4. **Safety rules** — `docs/agents/safety-rules.json`
5. **Routing rules** — `docs/agents/routing-rules.json`
6. **Repo overview** — `docs/overview/README.md`
7. **Readiness & audit lanes (canonical)** — `docs/agents/readiness-and-audit-lanes.md` + `docs/audit/latest.json`
8. **Lane indexes** — `docs/audit/readiness-model.md` (do not cite master-audit 8.9 for engineering)

**Then:**

- Run `pnpm ops:check` and `pnpm readiness:lanes:check` to verify repo state
- Check `git status --short` — working tree must be clean before starting

---

## 4. Agent-Specific Overrides

| Agent   | Override File                     | What It Contains                                                            |
| ------- | --------------------------------- | --------------------------------------------------------------------------- |
| **All** | `AGENTS.md`                       | Canonical + **AGENT-SYNC** readiness/audit pointers                         |
| Claude  | `CLAUDE.md`                       | Claude-specific + **synced** readiness table                                |
| Kimi    | `KIMI.md` + `.kimi/AGENTS.md`     | Kimi CLI entry (`.kimi/`) + **synced** pointers in `KIMI.md`                |
| Gemini  | `GEMINI.md`                       | Gemini-specific + **synced** readiness table                                |
| Codex   | `CODEX.md`                        | Codex-specific + **synced** readiness table                               |
| Cursor  | `.cursor/rules/main.mdc` + `.cursor/rules.md` | **main.mdc** synced; rules.md composer hints              |
| Copilot | `.github/copilot/instructions.md` | Human chat hints + **synced** readiness/audit block                         |

**Sync matrix:** `docs/agents/agent-sync-coverage.md` · verify: `pnpm agent:check`

**Rule:** `AGENTS.md` is canonical. Agent-specific files only override when explicitly stated. If there's a conflict, `AGENTS.md` wins.

---

## 5. Architecture

```text
┌─ Downstream: gtcx-markets, gtcx-protocols, gtcx-infrastructure, gtcx-intelligence
├─ TypeScript: packages/* (21 packages)
├─ Rust: rust/* (6 crates)
└─ Platform: Node ≥20, pnpm 9.15, Rust 1.91+, OpenSSL FIPS / AWS-LC
```

**Dependency direction:** TypeScript packages flow one way. No circular deps. Run `pnpm architecture:check` before any cross-package change.

---

## 6. Security-Sensitive Packages

Changes to these require `crypto-security-engineer` review:

- `packages/crypto/`, `packages/crypto-native/`
- `packages/security/`, `packages/verification/`, `packages/identity/`
- `rust/gtcx-crypto/`, `rust/gtcx-zkp/`

**Never:**

- Skip CI gates
- Commit secrets
- Use `unsafe` in Rust without ADR
- Let raw AI output approve consequential actions

---

## 7. Verification Gates (must pass before commit)

Protocol 27 V-ladder — execute every applicable step in-session before claiming done:

| Step | Command | Required when |
| ---- | ------- | ------------- |
| V1 | `git status`, `git diff` (scoped) | Always |
| V2 | `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm architecture:check` | Documented in `package.json` or `AGENTS.md` |
| V3 | `pnpm test` | Tests exist for changed behavior |
| V4 | `pnpm docs:check-links`, `pnpm docs:check-frontmatter`, `pnpm bundle:check-budgets` | Story touches docs, deploy evidence, or cross-repo probes |
| V5 | `pnpm quality:governance:check` | Governance-related changes |
| V6 | Rust: `cargo test`, `cargo test --features trusted-setup-verify --release` | Rust changes |

**Run in session:**

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm architecture:check
pnpm docs:check-links
pnpm docs:check-frontmatter
pnpm bundle:check-budgets
pnpm quality:governance:check
pnpm readiness:lanes:check
pnpm agent:protocols:check
```

---

## 7.6 Agent protocols enforcement (P1–P28)

| Resource | Path |
|----------|------|
| Catalog + hub links | `docs/agents/agent-protocols-manifest.json` |
| Hub drift snapshot | `docs/agents/agent-protocols-hub-snapshot.json` |
| Enforcement guide | `docs/agents/agent-protocols-enforcement.md` |
| Session start (terminal) | `pnpm agent:session-start` |
| Attestation template | `docs/operations/agent-attestation-template.md` |
| Gate | `pnpm agent:protocols:check` |

CI and `pnpm quality:governance:check` run this gate. Includes P1–P21 foundation wiring, P22–P28 session cluster, hub drift probe, P24 coordination `--strict`, and PR attestation for agent-path changes.

---

## 7.45 Readiness & audit lanes (all agents)

**Canonical guide:** `docs/agents/readiness-and-audit-lanes.md` — five lanes, domain scores, forensic prompts, anti-drift rules.

| Lane | Never confuse with |
| ---- | ------------------ |
| 1 Engineering 9.5/10.0 | Bank-grade 8.9 |
| 2 Internal 9.0 composite | Old “~9.6 docs/hygiene” single score |
| 3 Industry Compliance | “External-dependent”; use **IC-T0–T4** not 1–10 delivery |
| 4 Bank-grade 8.9 | Engineering or internal composite |
| 5 GTM-Readiness | Lane name “GTM”; use **GR-T0–GR-T6** |

After audit work: update lane index + `docs/audit/latest.json`; run `pnpm readiness:lanes:check`; sync agents via `pnpm agent:sync`.

---

## 7.5 Agent Work Selection (Protocol 22) — MANDATORY

Agents must not ask the operator what to build next when the 10/10 cryptographic defensibility roadmap exists.

| Resource | Path |
|----------|------|
| Protocol | `gtcx-docs/docs/governance/protocols/22-agent-work-selection/protocol.md` |
| Manifest | `docs/operations/agent-work-selection.md` |
| Command | `npm run agent:next-work` |

## 7.55 Defensibility tiers (DTF-001) — moat claims

For GTM, investor, or competitive moat language use **Defensibility Tier 1–5** (higher tier = harder to replicate = longer replication time). Canonical: `gtcx-docs/frameworks/defensibility-tiers/v1.0.0/`. Do not use undifferentiated “90-day moat” (that is **Tier 1** only). Path to **Tier 5**: `path-to-tier-5.md` in that framework.

1. At session start (after Phase 3), run `npm run agent:next-work` and implement the returned milestone.
2. Critical-path dimensions (D1, D6) outrank non-critical polish when scores are tied.
3. External-blocked dimensions (D8, D9) must not be started without explicit human authorization.
4. In `development` frame, skip `evidence-capture`; take the next automatable code/docs milestone.
5. Escalate only for true blockers — not for prioritization.
6. Refresh `.baseline/memory/session.md` after each completed milestone.

---

## 8. Commit Style

```
type(scope): description

- type: feat, fix, docs, refactor, test, chore
- scope: package name or rust crate
- description: imperative, lowercase, no period
```

---

## 9. Cross-Agent Handoff Protocol

If you need to hand off to another agent:

1. **Write `docs/agents/sessions/<YYYY-MM-DD>-handoff-<agent-from>-<agent-to>.md`**
2. **Include:**
   - What was done (with commit SHAs)
   - What is in progress
   - Blockers and decisions made
   - Files touched
   - Next steps with estimated effort
3. **Update `docs/agents/sessions/INDEX.md`**
4. **Tag the handoff:** `handoff`, `<agent-from>`, `<agent-to>`, `<scope>`

**Read handoffs on session start:** Check `docs/agents/sessions/INDEX.md` for recent handoffs.

---

## 10. Machine-Readable First

All docs you create must have YAML frontmatter per `docs/agents/docs-standard-machine-readable.md`.

All code must respect bundle size budgets per `docs/agents/docs-standard-lightweight.md`.

All rules must be structured JSON per `docs/agents/safety-rules.json`.

All tasks must route through `docs/agents/routing-rules.json`.

<!-- AGENT-SYNC:START -->
<!-- AUTOGENERATED FROM .agent/*.md — DO NOT EDIT THIS SECTION.
     Edit the source partials and run `pnpm agent:sync`. -->

## Universal agent behavior (ANY LLM — terminal, IDE, CLI)

**Read every session:** [docs/operations/agent-universal-instructions.md](docs/operations/agent-universal-instructions.md)

**First command:** `pnpm agent:start` · **Execution bout** drain Class R before check-in · **P22** no menus · **P26** Proceed Brief then work · **P27** you run commands (never "Say push if you want").

**Ecosystem push (harness):** `pnpm --dir ../gtcx-agentic ecosystem:push-all`

## Persona selection (Phase 4 — mandatory)

**Bridge:** [ecosystem-persona-bridge-2026-06.md](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/ecosystem-persona-bridge-2026-06.md)  
**Registry:** [gtcx-docs institutional personas](https://github.com/gtcx-ecosystem/gtcx-docs/tree/main/docs/governance/institutional/personas)

| Step | Action                                                                                        |
| ---- | --------------------------------------------------------------------------------------------- |
| 1    | Run `pnpm agent:next-work` — use JSON `persona.institutional` + `persona.docUrl` when present |
| 2    | **Read** the persona `.md` file (not only the ID)                                             |
| 3    | State **Active persona** + **Frame** in every Proceed Brief (Protocol 26)                     |
| 4    | On **task switch**, re-select persona and read the new doc                                    |

**MCP personas** (`builder`, `security`, …) apply when using BaselineOS MCP tools; **institutional** names apply in chat, commits, and hub docs.

**Forbidden:** defaulting to generic coder voice for security, compliance, or coordination tasks.

## Protocol 26 — Proceed Brief (no menus)

Template: `docs/operations/agent-proceed-brief-template.md` · **Forbidden:** Your call · Two options · Say push if you want.

## Protocol 27 — execution obligation (v1.1.0)

**You run commands.** Dev servers, gates, `adb`, and probes are agent-run — not operator checklists.

| Resource   | Path                                                                            |
| ---------- | ------------------------------------------------------------------------------- |
| Hub spec   | `gtcx-docs/docs/governance/protocols/27-agent-execution-obligation/protocol.md` |
| Local rule | `.cursor/rules/protocol-27-agent-execution-obligation.mdc`                      |

**Before asking the human to run anything:** D1 Shell → D2 background → D3 `pnpm agent:git-push` (node spawn) → D4 owner repo → D5 `pnpm --dir ../gtcx-agentic ecosystem:push-all` → D6 Permission Unblock Report.

**IDE vs CLI:** Yolo (`~/.cursor/cli-config.json`, `approvalMode: unrestricted`) applies to **Cursor CLI** — not IDE Composer. IDE push: `pnpm agent:git-push`.

**Mobile:** background `expo start` / Metro; `adb reverse` + `am start` — not “press r” alone.

**Forbidden:** “verify locally”, “focus your terminal”, “run these commands”, “let me know when you've run”.

## Agent git workflow — micro-commit and preserve (P4 + P24 + P26 + P27)

**Normative:** [agent-git-workflow.md](docs/operations/agent-git-workflow.md)

| Action | Practice |
| ------ | -------- |
| **Commit** | Micro-commit **immediately** after each Class R story (gates pass) — **never ask** |
| **Push** | **After every micro-commit** — `pnpm agent:git-push` when IDE blocks bare `git push` |
| **Run commands** | P27 ladder D1→D6 — agents execute gates/probes/git; never defer to operator |
| **Owner repo** | Git writes **only** in owner checkout (P24); wrong repo → handoff, switch workspace |

**IDE vs CLI:** Yolo (`~/.cursor/cli-config.json`) applies to **Cursor CLI**; Composer uses `pnpm agent:git-push`.

**Forbidden:** "Should I commit?", "Say push if you want", "run in your terminal".

**Cross-repo deps (session):** `pnpm agent:cross-repo-deps:check`

**Report:** Status Update **Done** — `commit <sha>` · `pnpm agent:git-push` exit code.

## Session start (all terminals / LLMs — not IDE-specific)

**First command every session:**

```bash
pnpm agent:start
```

**Without `pnpm`** (one-time — from gtcx-core root):

```bash
pnpm agent:cli:path   # copy export line into ~/.zshrc
# then:
agent start
agent next-work --json
agent bout-progress
```

Runs Protocol 22 next-work, provisions **launch focus** + **execution bout**, **progress gauge**, refreshes `.baseline/memory/session.md`, prints Proceed Brief + bout scope (P26 + P28). Works in Cursor, Claude Code, Kimi CLI, Codex, plain terminal.

**Legacy alias:** `pnpm agent:session-start` (same script).

**Bout:** `docs/operations/agent-execution-bout.md` · `pnpm agent:bout`

**JSON for automation:** `pnpm agent:start --json`

**Before PR (agent-path changes):** include attestation from `docs/operations/agent-attestation-template.md` · `pnpm agent:attestation:check --pr`

## Repository

`gtcx-core` — shared TypeScript and Rust protocol foundation for cryptography, identity, verification, resilience, and downstream GTCX integrations.

## Stack

- TypeScript packages under `packages/*`, built with `tsup`, tested with `vitest`, orchestrated by `turbo`.
- Rust crates under `rust/*`, built and tested with Cargo.
- Package manager: `pnpm@9.15.0`.
- Runtime baseline: Node.js 20+ and Rust 1.91+.

## Non-Negotiables

1. **Conventional commits** — `type(scope): subject`, lowercase, imperative.
2. **No emojis** unless explicitly requested.
3. **No going in circles** — read this file + the repo's own docs before exploring.
4. **Session start (ALL terminals / LLMs)** — run `pnpm agent:session-start` (alias `pnpm agent:start`; provisions **execution bout** via `pnpm agent:next-work`). Drain Class R stories in `.baseline/execution-bout.json` before bout check-in; **micro-commit per story; push after each commit** — see `docs/operations/agent-git-workflow.md`. `pnpm agent:cross-repo-deps:check` at session start. Never ask which roadmap story to pick. Verify: `pnpm agent:bout:check` · `pnpm agent:protocols:check`.

## Build & Run

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm architecture:check
pnpm docs:check-links
pnpm docs:check-frontmatter
pnpm bundle:check-budgets
```

## Readiness & audit lanes (canonical — all agents)

**Read before citing scores:** `docs/agents/readiness-and-audit-lanes.md` · SSOT: `docs/audit/readiness-model.md` · `docs/audit/latest.json`

| Lane                   | Readiness (current)              | Index                                                       |
| ---------------------- | -------------------------------- | ----------------------------------------------------------- |
| 1 Engineering          | 9.5 / 10.0 signoff               | `docs/audit/engineering-completeness-quality-2026-06-05.md` |
| 2 Internal compliance  | **9.0** (5 domains)              | `docs/audit/internal-compliance-2026-06-05.md`              |
| 3 Industry Compliance  | **IC-T0** OPEN 0/12              | `docs/audit/industry-compliance-2026-06-05.md`              |
| **GCR** (rollup L2+L3) | **GCR-T0** **BLOCKED**           | `docs/audit/global-compliance-rating-2026-06-05.md`         |
| 4 Bank-grade           | **8.9** composite only           | `docs/audit/bank-grade-2026-06-05.md`                       |
| 5 GTM-Readiness        | **GR-T1** / sovereign &lt; GR-T2 | `docs/audit/gtm-readiness-2026-06-05.md`                    |

**Anti-drift:** 1–10 = audit _quality_ unless labeled readiness. Never use 8.9 for engineering. Industry/GTM use **tiers**, not 1–10 delivery. Deprecated: external-dependent lane, lane-2-only ~9.6, S1/S2 without GR-T.

**Check:** `pnpm readiness:lanes:check` · after audit doc edits update indexes + `latest.json` then `pnpm agent:sync`.

## Audits — lane + domain commands

**Lane scores (run for readiness):** `gtcx-docs/tools/audit/lane-audits/README.md`

| Goal                | Command                   |
| ------------------- | ------------------------- |
| Engineering         | `engineering-audit`       |
| Internal compliance | `compliance-audit`        |
| Industry / external | `external-audit`          |
| Bank-grade          | `bank-grade-audit`        |
| GTM                 | `gtm-audit`               |
| GCR rollup          | `global-compliance-audit` |

**Domain depth (run first, then lane):** `gtcx-docs/tools/audit/domain-audits/README.md`

| Domain       | Command             | Feeds                                   |
| ------------ | ------------------- | --------------------------------------- |
| Sales        | `sales-audit`       | `gtm-audit`                             |
| Partnerships | `partnership-audit` | `gtm-audit`                             |
| API          | `api-audit`         | `engineering-audit`                     |
| Security     | `security-audit`    | `compliance-audit`                      |
| Deployment   | `deployment-audit`  | `engineering-audit`, `bank-grade-audit` |

**Kimi (this repo):** all GTCX-native commands live under `.kimi/skills/<name>/SKILL.md` — invoke `/skill:<name>` (see `.agent/kimi-skills-pointer.md`). Sync: `pnpm kimi:skills:sync` · check: `pnpm kimi:skills:check`. No bare `/master-audit` in Kimi.

**Cursor/Claude:** global `~/.cursor/commands/` via `../gtcx-docs/tools/audit/agent-commands/install.sh` optional; project skills work without it.

**Aliases:** `master-audit` / `comprehensive-audit` → `bank-grade-audit` · `full-audit` / `forensic-audit` → `engineering-audit`.

**How to run:** `gtcx-docs/tools/audit/audit-framework/AGENT-START.md` → `commands/<command>.md` → prompt → forensic → lane index + `latest.json` → `pnpm readiness:lanes:check`.

## Credentials: system-of-record + ownership split (cross-repo)

**Canonical policy:** `gtcx-docs/docs/governance/protocols/19-agent-credential-access/protocol.md` (see “System-of-Record and Operational Ownership Split”).

- **System-of-record (SoR)**: `gtcx-agentic` Baseline vault (shared provider creds + audited access)
- **Runtime usage owner**: product repo (e.g. `gtcx-intelligence`) owns its runtime secrets
- **CI/automation owner**: `gtcx-infrastructure` owns org automation secrets/policy
- **Contracts only**: `gtcx-protocols` defines env var names, redaction rules, and artifact paths/globs

**Credentialed evidence packs:** run either via vault injection on a dev laptop or in infra-owned CI; write redacted JSON evidence only (no raw secrets).

## LLM routing + token usage (BaselineOS SoR)

| Concern                       | Owner          | Operator entry                                                |
| ----------------------------- | -------------- | ------------------------------------------------------------- |
| Route decisions + pricing     | `baseline-os`  | `baseline cost-route --prompt "..." --json`                   |
| Token usage aggregate         | `baseline-os`  | `baseline cost-stats --json`                                  |
| Agent vault (populate/verify) | `gtcx-agentic` | `pnpm agent:vault:verify`                                     |
| Staging vs production keys    | `gtcx-agentic` | `docs/operators/vault-environments.md`                        |
| Ecosystem coordination        | `baseline-os`  | `workstream/coordination/ECOSYSTEM-COST-ROUTER-2026-06-03.md` |

**Do not** use `baseline-os/infra/docker/.env.staging` for production vault work.

## Execute roadmap (planning / reconcile only)

Use when audits must be **reconciled** into a living plan — not for session-by-session implementation drain.

1. Read `../gtcx-docs/tools/roadmap/roadmap-framework/AGENT-START.md`
2. Command `execute-roadmap` — update `docs/audit/execution-roadmap.md`
3. **Then ship** via **execution bout** (intrinsic): `docs/operations/agent-execution-bout.md` · `pnpm agent:session-start`

**Do not** stop after planning. **Do not** use execute-roadmap as a substitute for `pnpm agent:next-work` + bout drain.

**Git:** reconcile-only passes may defer commit until ship slice; implementation follows [agent-git-workflow.md](docs/operations/agent-git-workflow.md) (micro-commit per story; push after each commit; never ask operator).

## Execution bout (intrinsic — prefer over execute-roadmap for shipping)

**Normative:** `docs/operations/agent-execution-bout.md` · state: `.baseline/execution-bout.json`

Every `pnpm agent:session-start` and `pnpm agent:next-work` provisions `executionBout` (Class R drain queue). **Drain the bout before check-in** — micro-commit per story; progress Status Update every 2 stories; full check-in at bout end.

```bash
pnpm agent:session-start --json   # includes executionBout
pnpm agent:bout                   # human summary
```

`backlogClear` ≠ stop — continue `repoCompletable` Class R items in the bout plan.

**Planning only:** `execute-roadmap` (gtcx-docs framework) reconciles audits into `docs/audit/execution-roadmap.md` — does not replace the bout loop for implementation.

## Bout progress gauge + task backlog (all agents)

**Normative:** [agent-bout-progress-gauge.md](docs/operations/agent-bout-progress-gauge.md) · [agent-task-backlog-format.md](docs/operations/agent-task-backlog-format.md)

**Per repo:** `.baseline/bout-progress.config.json` — dimensions **A** (engineering), **B** (workflow, product repos), **C** (GTM buyer S0–S6).

```bash
pnpm agent:bout-progress              # standup composite + buyer stage
pnpm agent:bout-progress --json
pnpm agent:reconcile-bout-progress    # sync A from latest.json
```

**Status Update:** include `### Progress gauge` block (auto text from `pnpm agent:bout-progress`). Use **task IDs** (`EOS-UX-052`, `CORE-004`) — not “next slices”.

**Product repo example:** [bout-progress-exploration-os.config.json](docs/operations/examples/bout-progress-exploration-os.config.json) — copy to exploration-os `.baseline/`.

**GTM stage assessment:** Cursor `/gtm` or `~/.claude/GTM.md` — buyer truth separate from bout composite.

## Launch focus (GTM — every session, no audit required)

**Normative:** `docs/operations/agent-launch-focus.md` · **SoR:** `.baseline/launch-focus.json`

**North star:** Finish **gtcx-core** foundation so **markets / intelligence / infrastructure** can launch apps → GTM closes sovereign deals (GR-T2+).

| Mode          | Meaning                                                                |
| ------------- | ---------------------------------------------------------------------- |
| **implement** | Drain `workSet.implement` (bout)                                       |
| **plan**      | No code queue — drain `workSet.plan` (reconcile roadmaps/coordination) |
| **witness**   | Human gates only                                                       |

```bash
pnpm agent:session-start --json
pnpm agent:reconcile-launch
```

**Forbidden:** Asking operator to run forensic audit or execute-roadmap to discover priorities.

## Cross-repo coordination (Protocol 24)

**Canonical policy:** [Protocol 24 — Cross-Repo Coordination](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/24-cross-repo-coordination/protocol.md)  
**Complements:** [Protocol 22 — Agent Work Selection](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/governance/protocols/22-agent-work-selection/protocol.md) (what to work on next).

**Session card (normative — read first):** [ecosystem-unblock-playbook-2026-06.md](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/ecosystem-unblock-playbook-2026-06.md) — INT-S9-01 → IR vs XC; F1–F7; foundation evidence stays in **gtcx-core**.

When a story is **blocked on a sibling repo** or you **hand off** cross-repo work, follow these five steps in order:

| Step                | Action                                                                                                                                                                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Ack**          | Read open handoffs: `baseline-os/workstream/coordination/coordination-report-latest.md` (if present) and any `from-*` / `to-*` tickets naming this repo. Reply with `outbound-ack` template when you receive a durable inbound.                                                |
| **2. Roadmap**      | Record ticket IDs and blocker repo in `docs/audit/auto-dev-state.md`, `.baseline/memory/dependencies.md`, and/or `docs/audit/agent-work-pointer.md` (if used). Do not leave blockers chat-only.                                                                                |
| **3. Inbound doc**  | File a durable handoff: `docs/gtm/inbound-tickets/from-<this-repo>-<topic>-YYYY-MM-DD.md` or `docs/coordination/<initiative>-coordination.md` ([template](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/docs/reference/templates/agents/3-structure/coordination.md)). |
| **4. Hub if P0**    | Ecosystem-critical path: from `baseline-os`, `pnpm ecosystem:repo:report-work --repo=<repo> --item="..." --status=blocked`. Use `gtcx-docs/docs/gtm/inbound-tickets/` only when the **docs hub** is the coordination witness (releases, standards).                            |
| **5. No duplicate** | Link [deployment-proof-index](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/audit/evidence/deployment-proof-index.md) and protocol contracts — **do not** copy harness YAML, evidence indexes, or normative protocol text into product repos.                |

**Not in this repo:** inbound archive SoR for ecosystem-wide weekly reports — that stays **`baseline-os`** (`workstream/coordination/`).

**Evidence paths (link only):** production smoke and EAP issuance artifacts live in owning repos per deployment-proof-index (e.g. `gtcx-intelligence/docs/audit/evidence/`).

## Agent protocols (P22–P28) — machine-enforced

| Resource          | Path                                                      |
| ----------------- | --------------------------------------------------------- |
| Hub index         | `gtcx-docs/docs/governance/protocols/`                    |
| Local manifest    | `docs/agents/agent-protocols-manifest.json`               |
| Enforcement guide | `docs/agents/agent-protocols-enforcement.md`              |
| P22 manifest      | `docs/operations/agent-work-selection.md`                 |
| P26 template      | `docs/operations/agent-proceed-brief-template.md`         |
| P24 bridge        | `docs/operations/coordination/cross-repo-agent-bridge.md` |

**Startup phases (INST-003):** 5.4 P22 · 5.5 P24 · 5.6 P26+P28 · 5.7 P27

**Session start (all LLMs):** `pnpm agent:session-start` — run before implementation (terminal, Kimi, Claude Code, Codex; not IDE-specific).

**Verify wiring:** `pnpm agent:protocols:check` (CI + `pnpm quality:governance:check`).

## Claude-Specific Notes

- Session-start protocol from `~/.claude/CLAUDE.md` applies: read `DESIGN_BAR.md` and `AI_NATIVE_PATTERNS.md` before UI work.
- Reject conventional UI anti-patterns: AI sidebar, AI tab, "Run AI" buttons, blank forms, dashboard-as-report.
- No emojis, no preamble, no time estimates, lead with the answer.

## Status Update (progress / handoff / end of turn)

Use **after work in the turn** or when reporting cluster/repo state — not instead of Proceed Brief at session start.

```markdown
## Status Update

### Done

- <outcome> — <evidence: command exit N, commit SHA, probe result>

### Next priority

- **Owner:** <repo or role>
- **Action:** <single imperative>
- **Because:** <1 line — P22 ID, blocker, witness>

### Approval needed

- <only Class A or S gates — secret, prod, legal, force-push; omit section if none>
```

**Rules:** One next priority (not a menu). **Approval needed** only for real gates — never "I can push / I can help / if you want." Class **R**: execute, then show Done + Next.

Template: `docs/operations/agent-status-update-template.md` · Spec: P26 §3b (gtcx-docs).

## Ecosystem agent learning card (normative — read every session)

**Canonical SoR:** [ecosystem-agent-learning-card-2026-06.md](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/ecosystem-agent-learning-card-2026-06.md) (gtcx-protocols).

### Read order

| Step | Link                                                                                                                                                                                     |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | [Unblock playbook F1–F10](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/ecosystem-unblock-playbook-2026-06.md)                                 |
| 2    | [P26 Status Update + post-pilot gating](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/agent-status-update-and-post-pilot-gating-2026-06-06.md) |
| 3    | [Human-external register](https://github.com/gtcx-ecosystem/gtcx-agentic/blob/main/docs/operations/coordination/human-external-blocker-register-2026-06.md)                              |
| 4    | [Cross-repo bridge — Latest updates](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/cross-repo-agent-bridge.md)                                 |
| 5    | This repo `docs/operations/agent-work-selection.md` · `docs/audit/auto-dev-state.md`                                                                                                     |

**End of turn:** one P26 Status Update (not a menu) → append [cross-repo-agent-log](https://github.com/gtcx-ecosystem/gtcx-protocols/blob/main/docs/operations/coordination/cross-repo-agent-log.md) if state changed.

### Rules (all repos)

- **`backlogClear`** on a sibling (e.g. gtcx-protocols) does **not** stop IR in **this** repo.
- **Class S** (H-03, DTF-5.5.4 LOI, pen-test SOW, …) → **Approval needed** only — never execute from wrong repo.
- **Class R** (tests, manifests, capture scripts) → run in-session; never list under Approval needed.
- **Never** execute H-03 countersign or XR-518 `--confirm` unless owner repo + Class A artifact says so.
<!-- AGENT-SYNC:END -->

## Coordination Contract

This repo participates in the GTCX ecosystem coordination system managed by `baseline-os`.

| Field | Value |
|-------|-------|
| Repo ID | `gtcx-core` |
| Tier | Tier 1 (Core) |
| Human Lead | TBD — update this |
| Agent Roles | Builder, Reviewer, Coordinator |
| QA Gates | `typecheck`, `test`, `arch-check`, `spec-drift` |

### Reporting Work

Report work items to the coordination hub:

```bash
cd /path/to/baseline-os
pnpm ecosystem:repo:report-work --repo=gtcx-core --item="Description" --status=in-progress
```

Valid statuses: `pending`, `in-progress`, `blocked`, `completed`, `deferred`.

### Querying Blockers

Check `baseline-os/workstream/coordination/coordination-report-latest.md` for cross-repo blockers.

### Trust Requirements

- Builders: trust ≥ 70 (Permissioned)
- Reviewers: trust ≥ 80 (Authorized)
- Coordinators: trust ≥ 85 (Authorized)
- Cross-repo changes require human approval

---

*Coordination contract added: 2026-05-26*
\n## Credential Access\n\nThe credential vault is managed by **gtcx-agentic** (consumes `@baselineos/vault` from baseline-os).\n\nAgents access credentials via the MCP tool:\n\n```\nTool: baseline_vault\n  action: "list"     → show available credentials and trust requirements\n  action: "get"      → retrieve a value (requires: name, agentId)\n  action: "status"   → vault health check\n```\n\nThe vault is centrally located at `~/.baseline/vault` (SQLite, AES-256 encrypted).\nTrust-score gated. All access is audited.\n\nStandard env vars: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DATABASE_URL`, `REDIS_URL`, `BASELINE_MASTER_KEY`.\n\nNever commit secrets. Never ask users for credentials in chat.\nRead Protocol 19 (`gtcx-docs/docs/governance/protocols/19-agent-credential-access/protocol.md`) for the full standard.
