# Remediation Plan: gtcx-core — Target 10/10

> Verified audit: 2026-03-19
> Repo: `/Users/amanianai/Sites/gtcx-ecosystem/2-core`
> Purpose: Close every gap to achieve 10/10 across all 5 audit dimensions

---

## Audit Baseline (2026-03-19)

| Dimension      | Score | Key Finding                                                                |
| -------------- | ----- | -------------------------------------------------------------------------- |
| Code Quality   | 9/10  | Security package coverage 89.8% — below crypto (94.6%) and domain (96.4%)  |
| Architecture   | 10/10 | No gaps identified                                                         |
| System Design  | 9/10  | `defaultAIHooks` returns mock data — acceptable but undocumented rationale |
| Repo Hygiene   | 9/10  | CODEOWNERS path references `/SOP/` instead of `/_sop/`                     |
| Folder Hygiene | 10/10 | No gaps identified                                                         |

**Composite: 9.4/10 — target: 10/10**

---

## Remediation Items

### Code Quality: 9/10 → 10/10

#### Issue 1: Security package test coverage below peer packages

- **Audit finding:** Security package at 89.8% statement coverage vs crypto (94.6%) and domain (96.4%). While above the 85% threshold, the gap signals uncovered edge cases in a security-critical package.
- **Evidence:** `quality/kpi-metrics.json` — security package coverage data
- **Fix:** Add tests targeting uncovered branches in `packages/security/`. Identify uncovered lines with `pnpm --filter @gtcx/security test -- --coverage` and write tests for:
  - Edge cases in key derivation flows (empty input, max-length input, invalid salt)
  - Error paths in storage operations (corruption, concurrent access)
  - Boundary conditions in any crypto-adjacent logic
  - Target: 95%+ statements, matching crypto package level
- **Verification:** Run `pnpm --filter @gtcx/security test -- --coverage` and confirm statements >= 95%, branches >= 92%
- **Risk:** Low — adding tests only, no source changes

### System Design: 9/10 → 10/10

#### Issue 2: defaultAIHooks returns mock data without documented rationale

- **Audit finding:** `@gtcx/domain` includes `defaultAIHooks` that returns placeholder data. Appropriate for foundation layer but undocumented — readers may assume this is production AI integration.
- **Evidence:** `packages/domain/src/ai-integration.ts` — `defaultAIHooks` function
- **Fix:** Add a doc comment above `defaultAIHooks` explaining:
  1. This is intentionally a no-op/placeholder for the foundation layer
  2. Real AI integration lives in `5-intelligence` and `6-platforms`
  3. The provider interface pattern (`AIProvider`) is the extension point — consumers inject real implementations
  4. Example: `// Default AI hooks provide null implementations for the foundation layer. Real AI integration is injected by consuming packages (5-intelligence, 6-platforms) via the AIProvider interface. This ensures gtcx-core has zero AI service dependencies.`
- **Verification:** Read the file and confirm the doc comment exists and explains the design decision
- **Risk:** None — documentation only

### Repo Hygiene: 9/10 → 10/10

#### Issue 3: CODEOWNERS path references `/SOP/` vs `/_sop/`

- **Audit finding:** `.github/CODEOWNERS` references `/SOP/` (uppercase) but the actual directory is `/_sop/` (lowercase with underscore prefix).
- **Evidence:** `.github/CODEOWNERS` — path references
- **Fix:** Update all `/SOP/` references in `.github/CODEOWNERS` to `/_sop/`. Verify the paths match the actual directory structure.
- **Verification:** Run `grep -n 'SOP' .github/CODEOWNERS` — should return zero results. Then run `grep -n '_sop' .github/CODEOWNERS` — should show the corrected paths.
- **Risk:** Low — CODEOWNERS path fix. If the GitHub org uses case-sensitive matching, this fixes a silent bypass where changes to `_sop/` were not triggering required reviews.

---

## Execution Order

1. Fix CODEOWNERS path (independent, 2 minutes)
2. Add `defaultAIHooks` doc comment (independent, 5 minutes)
3. Write security package tests (requires identifying coverage gaps first, ~30 minutes)

No dependencies between items — can be done in any order or in parallel.

---

## Definition of Done

- [ ] `.github/CODEOWNERS` references `/_sop/` — zero instances of `/SOP/`
- [ ] `defaultAIHooks` in `packages/domain/src/ai-integration.ts` has doc comment explaining the null implementation pattern
- [ ] `@gtcx/security` test coverage: statements >= 95%, branches >= 92%
- [ ] All existing tests still pass: `pnpm test` green
- [ ] `pnpm lint` clean — zero errors, zero warnings
- [ ] `pnpm typecheck` clean

---

## Post-Remediation Verification Protocol

```bash
cd /Users/amanianai/Sites/gtcx-ecosystem/2-core

# 1. Verify CODEOWNERS fix
grep -c '/SOP/' .github/CODEOWNERS  # expect: 0
grep -c '/_sop/' .github/CODEOWNERS  # expect: >= 1

# 2. Verify AI hooks documentation
grep -c 'foundation layer' packages/domain/src/ai-integration.ts  # expect: >= 1

# 3. Verify security coverage
pnpm --filter @gtcx/security test -- --coverage  # statements >= 95%

# 4. Full quality gates
pnpm test          # all green
pnpm lint          # zero errors
pnpm typecheck     # zero errors
pnpm run architecture:check   # passing
pnpm run quality:governance:check  # passing
```
