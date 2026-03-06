# Documentation — gtcx-core

Architecture, specifications, engineering standards, and operations documentation for `gtcx-core`.

## Structure

| Section                                         | Contents                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| [`1-architecture/`](./1-architecture/README.md) | System architecture, layer map, component diagrams, ADRs             |
| [`2-specs/`](./2-specs/README.md)               | Core system spec, package specs (18 TS packages, 6 Rust crates)      |
| [`3-engineering/`](./3-engineering/README.md)   | Code standards, naming conventions, guides, security, testing, CI/CD |
| [`4-operations/`](./4-operations/README.md)     | Runbooks, compliance evidence, quality gates                         |
| [`5-reference/`](./5-reference/)                | Benchmarks, API surface, glossary, reference index                   |
| `6-gitbook/`                                    | External-facing documentation (placeholder)                          |

## Navigation by Question

| Question                               | Location                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| How does the system work?              | [`1-architecture/overview.md`](./1-architecture/overview.md)                                           |
| What are the design decisions and why? | [`1-architecture/decisions/`](./1-architecture/decisions/README.md)                                    |
| What does each package do?             | [`2-specs/packages/`](./2-specs/packages/README.md)                                                    |
| What are the coding rules?             | [`3-engineering/code-standards.md`](./3-engineering/code-standards.md)                                 |
| How do I set up my environment?        | [`3-engineering/guides/dev-setup.md`](./3-engineering/guides/dev-setup.md)                             |
| How do I run the full quality gate?    | [`4-operations/runbooks/quality-runbook.md`](./4-operations/runbooks/quality-runbook.md)               |
| What is the threat model?              | [`3-engineering/security/threat-control-matrix.md`](./3-engineering/security/threat-control-matrix.md) |
| What are the SLO targets?              | [`4-operations/runbooks/slo-targets.md`](./4-operations/runbooks/slo-targets.md)                       |
| What are the performance benchmarks?   | [`5-reference/BENCHMARKS.md`](./5-reference/BENCHMARKS.md)                                             |
