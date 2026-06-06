# 03-platform

**Purpose:** Runnable code, shared packages, automation scripts, quality tools, and platform assets for `gtcx-core`.

**SoR:**

| Concern                                         | Path                                        |
| ----------------------------------------------- | ------------------------------------------- |
| TypeScript packages (`@gtcx/*`, config presets) | `packages/`                                 |
| Repo automation                                 | `scripts/`                                  |
| Quality gates and checkers                      | `tools/`                                    |
| Agent sync / workspace scripts                  | `scripts/agent-sync/`, `scripts/workspace/` |

**Not here:** Deploy manifests (`04-deploy/`), narrative docs (`01-docs/`), ops evidence (`05-audit/`), Rust crates (`rust/` at repo root — foundation exception).

**Forbidden:** Root-level `packages/` or `scripts/` (Protocol 31 closed root).

**Related:** [`config/sor-map.json`](../config/sor-map.json) · [`config/toolchain/`](../config/toolchain/) · [`AGENTS.md`](../AGENTS.md)
