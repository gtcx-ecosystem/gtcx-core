# Task Playbook: Cut a Release

**Owner:** Quality & Evidence Lead (gates + evidence) + Protocol Architect (version decision)
**Safety tier:** Requires human approval before publishing

---

## When to Run This

Run when the team has decided to cut a release of `gtcx-core`. A release publishes updated `@gtcx/*` packages to the package registry. This affects every downstream GTCX repo.

Gate execution is autonomous. Publishing requires explicit human confirmation — do not proceed past the escalation step without it.

---

## Pre-Flight

Confirm with the human reviewer:

- Target version bump type: `patch`, `minor`, or `major`
- Packages included in this release (not all packages need to bump on every release)
- Whether any API changes are included (triggers mandatory `api:check` review)

Then read:

- `_sop/2-docs/4-devops/7-release-mgmt/release-checklist.md` — authoritative gate list
- `_sop/2-docs/3-engineering/5-compliance/governance-and-evidence.md` — evidence requirements
- `_sop/3-agile/2-scrum-board/6-testing/uat-evidence-log.md` — confirm UAT evidence exists for any new features

---

## Gate Sequence

Execute in order. Do not proceed past a failing gate.

### Gate 1 — Architecture

```bash
pnpm architecture:check
```

Zero violations required.

---

### Gate 2 — Code quality

```bash
pnpm lint
pnpm typecheck
```

Zero warnings, zero type errors.

---

### Gate 3 — Tests

```bash
pnpm test
```

All tests pass. Coverage must meet the threshold in `_sop/2-docs/5-specs/6-testing/quality-standards.md`.

---

### Gate 4 — Build

```bash
pnpm build
```

All 18 TypeScript packages and 6 Rust crates build cleanly.

---

### Gate 5 — API surface

```bash
pnpm api:check
```

Review the diff in `quality/api-surface-report.json` against `quality/api-surface-baseline.json`.

| Diff type       | Required action                                          |
| --------------- | -------------------------------------------------------- |
| Breaking change | Major version bump — escalate to human before proceeding |
| Additive change | Minor version bump minimum                               |
| No change       | Patch version is acceptable                              |

Do not run `pnpm api:update-baseline` yet — that happens after human review.

---

### Gate 6 — Performance

```bash
pnpm perf:check-budgets
```

All benchmarks within budget. If any budget is exceeded: block release and escalate. Do not raise the budget to unblock the release.

---

### Gate 7 — Security

```bash
pnpm security:threat-matrix
```

All threat controls passing. Failures here must be escalated to the Cryptographic Security Engineer immediately.

---

### Gate 8 — Governance

```bash
pnpm quality:governance:check
```

Branch protection, CODEOWNERS, and evidence artifacts all valid.

---

### Gate 9 — Rust gates

```bash
cargo test --workspace
cargo clippy --workspace -- -D warnings
```

All Rust tests pass. Zero clippy warnings.

---

## Evidence Artifacts

After all gates pass, commit the following to `quality/`:

- `quality/api-surface-report.json` — from `pnpm api:check`
- `quality/release-<version>-evidence.md` — gate results summary
- Any benchmark results that changed from the previous release

---

## Escalate for Human Approval

Surface to the human reviewer:

1. Gate results summary (all pass / any failures)
2. API diff summary — breaking, additive, or no change
3. Version bump recommendation with rationale
4. List of packages included in the release
5. Any UAT gaps (features without evidence in `_sop/3-agile/2-scrum-board/6-testing/uat-evidence-log.md`)

Do not proceed to version bump or publish without confirmation.

---

## After Human Approval

### Step 1 — Update API baseline (if API changed)

```bash
pnpm api:update-baseline
```

Commit `quality/api-surface-baseline.json`.

### Step 2 — Version bump

Use the version bump type confirmed by the human reviewer.

### Step 3 — Tag and publish

Follow the publish procedure in `_sop/2-docs/4-devops/3-ci-cd-pipelines/ci-cd.md`.

### Step 4 — Update UAT evidence log

If this release closes sprint UAT gates, update `_sop/3-agile/2-scrum-board/6-testing/uat-evidence-log.md`.

---

## Post-Flight

- [ ] All 9 gates passed and documented
- [ ] Evidence committed to `quality/`
- [ ] API baseline updated (if applicable)
- [ ] Release checklist completed and committed
- [ ] `_sop/3-agile/2-scrum-board/6-testing/uat-evidence-log.md` updated for completed sprints

---

## Hard Rules

- Never publish without all gates passing
- Never run `pnpm api:update-baseline` without human approval
- Never force-push a release tag
- Never mark a checklist item complete without running the actual gate
- Never push to `main` without explicit instruction

---

## Reference

- [`_sop/2-docs/4-devops/7-release-mgmt/release-checklist.md`](../../../2-docs/4-devops/7-release-mgmt/release-checklist.md) — release checklist
- [`_sop/2-docs/4-devops/3-ci-cd-pipelines/ci-cd.md`](../../../2-docs/4-devops/3-ci-cd-pipelines/ci-cd.md) — publish procedure
- [`_sop/1-agents/2-roles/quality-evidence-lead.md`](../../2-roles/quality-evidence-lead.md) — gate sequence and triage order
- [`_sop/1-agents/4-workflows/safety-rules.md`](../safety-rules.md) — approval requirements
