# Documentation

Agent and contributor handbook for `gtcx-core`. Covers orientation, roles, architecture, specs, devops, and agile planning.

**Last reviewed:** 2026-05-06

---

## Contents

| Folder                             | Purpose                                                         |
| ---------------------------------- | --------------------------------------------------------------- |
| [`agents/`](./agents/)             | Agent team, onboarding, roles, safety rules, and task playbooks |
| [`architecture/`](./architecture/) | System architecture, trust boundaries, and resilience profiles  |
| [`specs/`](./specs/)               | Package specs and core system specification                     |
| [`devops/`](./devops/)             | CI/CD docs, runbooks, release management, and operations        |
| [`security/`](./security/)         | Security framework, threat model, FIPS posture, and controls    |
| [`agile/`](./agile/)               | Roadmap, sprint standards, testing evidence, and readiness work |
| [`audits/`](./audits/)             | Audit history and current remediation status                    |
| [`release/`](./release/)           | Release artifacts, migration policy, and downstream readiness   |
| [`testing/`](./testing/)           | Quality standards and testing policy                            |
| [`decisions/`](./decisions/)       | ADRs and accepted architectural decisions                       |

## Where to Start

Any agent or contributor entering this repo reads in this order:

1. [`../CLAUDE.md`](../CLAUDE.md) — foundational repo identity and working rules
2. [`agents/onboarding/orientation.md`](./agents/onboarding/orientation.md) — codebase map
3. [`agents/workflows/safety-rules.md`](./agents/workflows/safety-rules.md) — what requires human approval
4. The role file for your current work ([`agents/roles/`](./agents/roles/))
5. The package spec before touching any package ([`specs/packages/`](./specs/packages/))
