# Auto-Dev State — gtcx-core

**Last updated:** 2026-05-04
**Last cycle:** Cycle 1 (complete) + Spec-drift sprint (complete)
**Next action:** Score against STANDARDS.md (Step 3.6 of /start-fresh)

## Current Status

The codebase has been through:

1. Full hygiene audit → 10/10
2. GTM assessment → S1 (packages published to npm)
3. 4-sprint remediation (ZKP bridge, offline wiring, threat model, CI hardening)
4. Spec-drift audit → 100% fidelity (6 findings fixed)
5. Test coverage sprint (services fallback tests added)

## Scores (from hygiene audit, not yet scored against STANDARDS.md)

| Dimension          | Score |
| ------------------ | ----- |
| Documentation      | 10/10 |
| File Structure     | 10/10 |
| Naming Conventions | 10/10 |
| Package / Build    | 10/10 |
| Code Hygiene       | 10/10 |
| Test Hygiene       | 10/10 |
| CI / CD            | 10/10 |
| Dependency Health  | 10/10 |
| Git Hygiene        | 10/10 |
| Monorepo           | 10/10 |

**Note:** These are hygiene scores, not STANDARDS.md scores. STANDARDS.md has different dimensions (Security, Architecture, Test Coverage, Code Quality, Operational Readiness, Documentation, Dependency Health, CI/CD, Production Readiness, Developer Experience) with service-oriented criteria. Many are N/A for a library repo.

## Pending STANDARDS.md Assessment

STANDARDS.md is written for service repos (endpoints, health checks, K8s, Redis, CORS, JWT). gtcx-core is a pure library — no server, no endpoints, no deployment surface. The next session should:

1. Score each STANDARDS.md dimension, marking service-specific standards as N/A
2. Identify which library-applicable standards are not met
3. Plan and execute any remaining fixes

## Commits This Session

```
2289227 fix(hygiene): remediate 9 audit findings across deps, CI, docs, and code
77a1418 fix(sprint-1): resolve runtime gaps, harden test config, add CodeQL and NAPI CI
9bd26ff feat(api-client): add offline-aware request handling via OfflineHandler
0c72312 feat(sprint-2): add threat model, external integration guide, CI benchmarks
8cae1bf feat(sprint-3): expose real ZKP circuits via NAPI, add NativeZkpEngine
30fdfa6 fix(sprint-4): add cross-platform NAPI matrix, fix coverage and clippy
e156eed fix(hygiene): update API baseline, align services coverage to 0.x status
e8db15f chore(release): version packages for sprint 1-4 remediation
66205f8 fix(services): add no-repository fallback tests, raise coverage thresholds
0249fa7 fix(docs): resolve 6 spec-drift findings across 9 files
```

## Open Items (non-code)

1. `_archive/` and `_sop/` — user needs to delete from working tree
2. `.npmrc` auth token — should be rotated
3. Pen test — needs to be scheduled (logistics, not code)
4. Downstream repo validation — needs to be done against published packages
5. Rust crates not yet published to crates.io
