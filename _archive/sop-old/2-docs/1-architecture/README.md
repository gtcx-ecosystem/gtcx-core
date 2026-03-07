# Architecture Documentation

System architecture for `gtcx-core` — the shared foundation layer of the GTCX ecosystem.

## Contents

| Document                                                         | Description                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [overview.md](./overview.md)                                     | High-level architecture principles and layer map                                |
| [core-architecture-overview.md](./core-architecture-overview.md) | Full package inventory, design decisions, downstream consumption                |
| [components.md](./components.md)                                 | Component inventory — all packages and crates with responsibilities             |
| [data-flows.md](./data-flows.md)                                 | Canonical data flows: identity, verification, sync, network, ZKP, observability |
| [data-identity-core.md](./data-identity-core.md)                 | EventCore + Identity Core integration model                                     |
| [shared-infrastructure.md](./shared-infrastructure.md)           | Shared infrastructure layer — design principles, dependency rules               |
| [integration-patterns.md](./integration-patterns.md)             | Cross-repo integration patterns for downstream consumers                        |
| [cryptographic-verification.md](./cryptographic-verification.md) | Cryptographic vs. blockchain trust infrastructure decision                      |
| [crypto-research.md](./crypto-research.md)                       | Research brief: cryptographic infrastructure over blockchain                    |
| [zkp-circuit-plan.md](./zkp-circuit-plan.md)                     | ZKP circuit selection, performance budgets, and phased implementation           |

## Architecture Decision Records

All ADRs for `gtcx-core` live in [decisions/](./decisions/). See the [decisions README](./decisions/README.md) for the full index.
