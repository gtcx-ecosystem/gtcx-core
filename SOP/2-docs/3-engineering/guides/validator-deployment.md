# Validator Deployment Guide

How to deploy a `gtcx-core` validator node. Validators participate in PBFT consensus (ADR-010) and process verification requests.

## Prerequisites

- Node.js 20+
- Rust toolchain (for native crypto bindings — required in production)
- `gtcx-node` native artifact built and staged

## Build Native Artifacts

```bash
cargo build --release --manifest-path rust/gtcx-node/Cargo.toml
```

Stage the artifact:

```bash
export GTCX_CRYPTO_NATIVE_PATH=/path/to/gtcx_node.node
export GTCX_REQUIRE_NATIVE=1
```

## Environment Variables

| Variable                  | Required   | Description                                                      |
| ------------------------- | ---------- | ---------------------------------------------------------------- |
| `GTCX_CRYPTO_NATIVE_PATH` | Yes (prod) | Path to the `.node` native binding artifact                      |
| `GTCX_REQUIRE_NATIVE`     | Yes (prod) | Set to `1` to fail hard if native binding is not loaded          |
| `GTCX_VALIDATOR_ROLE`     | Yes        | Stakeholder role: `government`, `vault`, `industry`, `technical` |
| `GTCX_VALIDATOR_WEIGHT`   | Optional   | Override default weight for this validator role                  |

## Consensus Role

Validators participate in weighted PBFT consensus per ADR-010:

| Role         | Default Weight |
| ------------ | -------------- |
| `government` | 40%            |
| `vault`      | 30%            |
| `industry`   | 20%            |
| `technical`  | 10%            |

Quorum: sum of approving weights must exceed ⅔ of total weight.

## Network Setup

The validator joins the mesh via `@gtcx/network` (libp2p TCP/QUIC). Configure:

- Peer bootstrap addresses
- Topic allowlists (rate limiting enforced by default)
- Telemetry sink for structured logs

## Health and Observability

- Telemetry events: `network.publish`, `network.receive`, `peer.error`
- SLO targets: see `SOP/2-docs/4-operations/runbooks/slo-targets.md`
- Monitoring runbook: `SOP/2-docs/4-operations/runbooks/monitoring.md`

## References

- `SOP/2-docs/1-architecture/decisions/001-rust-for-cryptography.md`
- `SOP/2-docs/1-architecture/decisions/010-pbft-weighted-consensus.md`
- `SOP/2-docs/2-specs/packages/rust/gtcx-node.md`
- `SOP/2-docs/2-specs/network-protocol.md`
