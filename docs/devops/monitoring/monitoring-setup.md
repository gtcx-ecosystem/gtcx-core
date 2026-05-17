---
title: 'Monitoring Setup'
status: 'current'
date: '2026-05-17'
owner: 'frontier-infra-engineer'
role: 'frontier-infra-engineer'
tier: 'standard'
tags: ['docs', 'operations']
review_cycle: 'on-change'
---

# Monitoring — gtcx-core

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Quality & Evidence Lead

_Not applicable in the service-monitoring sense. `gtcx-core` is a library — it has no running servers, no production services, and no SLOs for uptime or latency._

---

## What Is Monitored

For a package library, "monitoring" means:

| Signal                     | Source                      | What to watch                                  |
| -------------------------- | --------------------------- | ---------------------------------------------- |
| CI pipeline health         | GitHub Actions              | Flaky tests, build failures, gate regressions  |
| Build times                | Turborepo + GitHub Actions  | Regressions in build or test execution time    |
| npm package health         | npm registry                | Download counts, version adoption by consumers |
| Dependency vulnerabilities | `pnpm audit`, `cargo audit` | New CVEs in dependency chain                   |
| API surface stability      | `pnpm api:check`            | Unintentional breaking changes                 |

---

## CI Failure Response

If any CI gate fails on `main`:

1. Identify the failing gate from the GitHub Actions log
2. Reproduce locally using the command from `2-runbooks/quality-runbook.md`
3. File a P1 if the gate blocks a release; P2 otherwise
4. Do not publish until all gates pass on `main`

For security-related failures (audit warnings, crypto test failures) — escalate to Cryptographic Security Engineer immediately and treat as P0.

---

## Dependency Vulnerability Monitoring

Run on every PR (automated via CI) and weekly manually:

```bash
pnpm audit          # npm ecosystem
cd rust && cargo audit  # Rust/Cargo ecosystem
```

For any high or critical severity finding:

- P0 if in a crypto package (`@gtcx/crypto`, `gtcx-crypto`, `gtcx-zkp`)
- P1 otherwise

---

## References

- `docs/devops/ci-cd/ci-cd.md` — full CI gate sequence
- `docs/compliance/compliance-requirements.md` — supply chain and SBOM requirements
