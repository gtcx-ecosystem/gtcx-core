# Task Playbook: Investigate a CI Failure

**Owner:** Quality & Evidence Lead (triage) + relevant role (fix)
**Safety tier:** Autonomous (investigation) / role-dependent (fix)

---

## When to Run This

Run when a CI gate fails on a PR or on `main`. Do not retry the same failing command repeatedly. Investigate, identify root cause, and fix at the source.

---

## Triage Order

Work through failures in this order — resolve each before moving to the next:

1. `pnpm architecture:check` — boundary violations block everything
2. `pnpm typecheck` — type errors indicate structural problems
3. `pnpm lint` — surface issues before running tests
4. `pnpm test` — test failures after clean type and lint
5. `pnpm build` — build failures after tests pass
6. `pnpm api:check` — API drift after build
7. `pnpm perf:check-budgets` — budget failures after build
8. `pnpm security:threat-matrix` — security gate
9. `pnpm quality:governance:check` — governance gate
10. Rust gates (`cargo test`, `cargo clippy`) — run parallel to TS gates

Never skip a gate to get to the next one. Never use `--no-verify`.

---

## Investigation Protocol

### Step 1 — Read the full error output

Do not act on the first line of an error. Read the complete output. Errors frequently have a root cause earlier in the output than the final failure message.

---

### Step 2 — Identify the failure category

| Category                        | Indicator                        | Owner                                                                                    |
| ------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| Architecture boundary violation | `check-package-boundaries` error | Protocol Architect                                                                       |
| Phantom dependency              | Import not in `package.json`     | Protocol Architect                                                                       |
| Type error                      | `TS2XXX` error code              | Role owning the affected package                                                         |
| Test failure                    | `FAIL` in test output            | Role owning the affected package                                                         |
| Build error                     | Compilation or bundling failure  | Role owning the affected package                                                         |
| API drift                       | `api:check` diff output          | Quality & Evidence Lead                                                                  |
| Performance budget exceeded     | `perf:check-budgets` failure     | Frontier Infrastructure Engineer (sync/network) or Cryptographic Security Engineer (ZKP) |
| Security gate failure           | `security:threat-matrix` output  | Cryptographic Security Engineer                                                          |
| Rust compilation error          | `cargo build` error              | Crate owner                                                                              |

---

### Step 3 — Read the affected file before modifying it

Read the failing test, the failing module, and the spec for the affected package before writing any fix.

---

### Step 4 — Identify root cause, do not fix symptoms

| Symptom                         | Root cause to investigate                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| Test failure after merge        | Was a shared type changed? Does the test reflect the contract or an implementation detail?      |
| Architecture boundary violation | Was a new import added without updating the boundary config? Is the import direction correct?   |
| Performance budget exceeded     | Was a new operation added in the hot path? Was the benchmark run on an under-resourced machine? |
| API drift                       | Was a public export changed, added, or removed intentionally? Does it need a version bump?      |
| Phantom dependency              | Was a new package used without adding it to `package.json`?                                     |

---

### Step 5 — Fix at the source

Acceptable fixes:

- Correct the code to match the spec
- Update the test to reflect a valid spec change (not to make it pass artificially)
- Declare the missing dependency
- Restore the architectural boundary

Unacceptable fixes:

- `--no-verify`
- Disabling a gate
- Widening a boundary beyond what the spec allows
- Skipping a test

---

### Step 6 — Verify the fix

Run the specific failing gate first:

```bash
pnpm architecture:check          # if boundary failure
pnpm typecheck                   # if type failure
pnpm test --filter=<package>     # if test failure
```

Then run the full sequence:

```bash
pnpm architecture:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

---

## Escalation Criteria

Escalate to human review if:

- The fix requires changing a security-sensitive package (`@gtcx/crypto`, `@gtcx/security`, `@gtcx/verification`, `@gtcx/identity`, any Rust crate)
- The fix requires updating `quality/api-surface-baseline.json`
- The fix requires modifying `benchmarks/performance-budgets.json`
- Root cause is unclear after 2 investigation cycles
- The CI failure is in a gate that has never failed before (potential regression in the gate itself)

When escalating: state the gate that failed, the full error output, the root cause hypothesis, and why human judgment is needed.

---

## Post-Fix

- All gates pass: `pnpm architecture:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- Root cause documented in the PR description
- If the fix changes a spec: spec is updated
- If the fix reveals a spec gap: gap is added to `_sop/2-docs/3-engineering/5-compliance/spec-to-code-traceability.md`

---

## Reference

- [`_sop/1-agents/2-roles/quality-evidence-lead.md`](../../2-roles/quality-evidence-lead.md) — full CI gate sequence and triage order
- [`_sop/1-agents/4-workflows/safety-rules.md`](../safety-rules.md) — what requires escalation
- [`_sop/2-docs/3-engineering/5-compliance/spec-to-code-traceability.md`](../../../2-docs/3-engineering/5-compliance/spec-to-code-traceability.md) — traceability matrix
