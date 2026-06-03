---
title: 'System Overview — gtcx-core'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'architecture']
review_cycle: 'on-change'
---

---

title: 'System Overview'
status: 'current'
date: '2026-05-24'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['architecture', 'overview', 'system', 'mermaid']
review_cycle: 'quarterly'

---

# System Overview — gtcx-core

> **Status:** Current
> **Date:** 2026-05-24
> **Owner:** Protocol Architect

Canonical high-level view of the `gtcx-core` architecture per [Protocol 13 §Tier 1](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/system-sop/1-protocols/13-architecture-diagrams/protocol.md). Read this before making any cross-package or structural change. For the formal security spec, see [system-architecture-spec.md](./system-architecture-spec.md); for module-level detail, see [overview.md](./overview.md); for cross-repo flows, see [ecosystem-integration.md](./ecosystem-integration.md).

## What gtcx-core is

A cryptographic and protocol foundation library — pure code, no deployment runtime. Ships as 21 TypeScript packages (`@gtcx/*` to npm) and 6 Rust crates (`gtcx-*` to crates.io). Every downstream repo in the GTCX ecosystem consumes one or more of these packages; gtcx-core itself consumes nothing internal — it's the bottom of the dependency graph.

The exemption in [Protocol 13 §Exemptions](https://github.com/gtcx-ecosystem/gtcx-docs/blob/main/system-sop/1-protocols/13-architecture-diagrams/protocol.md) ("pure library repos with no deployment surface") applies — this doc is required regardless because cross-repo integration here is non-trivial.

## System architecture

The TypeScript surface is organized in tiers; the Rust surface backs the cryptographic primitives via NAPI bindings.

```mermaid
graph TB
    subgraph Consumers["Downstream Consumers (14 repos)"]
        MOBILE["gtcx-mobile"]
        PROTOCOLS["gtcx-protocols"]
        PLATFORMS["gtcx-platforms"]
        INFRA["gtcx-infrastructure"]
        INTEL["gtcx-intelligence"]
        OTHERS["+ 9 more"]
    end

    subgraph Aggregator["Tier 4: Runtime Substrate"]
        RUNTIME["@gtcx/runtime<br/>(api-client + connectivity +<br/>resilience + telemetry)"]
    end

    subgraph Services["Tier 3: Services & Higher-Level"]
        SERVICES["@gtcx/services"]
        WORKPROOF["@gtcx/workproof"]
        AI["@gtcx/ai"]
        SYNC["@gtcx/sync"]
        NETWORK["@gtcx/network"]
        TELEMETRY["@gtcx/telemetry"]
        RESILIENCE["@gtcx/resilience"]
        APICLIENT["@gtcx/api-client"]
        CONNECTIVITY["@gtcx/connectivity"]
    end

    subgraph TrustTier["Tier 2: Trust-Bearing (security review gated)"]
        IDENTITY["@gtcx/identity"]
        VERIFICATION["@gtcx/verification"]
        SECURITY["@gtcx/security"]
    end

    subgraph Core["Tier 1: Cryptographic Foundation"]
        CRYPTO["@gtcx/crypto"]
        CRYPTONATIVE["@gtcx/crypto-native"]
        DOMAIN["@gtcx/domain"]
    end

    subgraph Foundation["Tier 0: Foundation"]
        TYPES["@gtcx/types"]
        SCHEMAS["@gtcx/schemas"]
        UTILS["@gtcx/utils"]
        LOGGING["@gtcx/logging"]
        EVENTS["@gtcx/events"]
    end

    subgraph Rust["Rust Native (NAPI-RS bindings)"]
        RCRYPTO["rust/gtcx-crypto<br/>FIPS via aws-lc-rs"]
        RZKP["rust/gtcx-zkp"]
        RNODE["rust/gtcx-node"]
    end

    Consumers --> Aggregator
    Aggregator --> Services
    Services --> TrustTier
    TrustTier --> Core
    Core --> Foundation
    CRYPTONATIVE -.NAPI.-> RNODE
    RNODE --> RCRYPTO
    RNODE --> RZKP
```

Tier discipline is enforced: `pnpm architecture:check` (driven by [`tools/check-package-boundaries.mjs`](../../tools/check-package-boundaries.mjs)) blocks any PR that introduces a circular or upward dependency.

## Data flow — signing and verification round-trip

The cryptographic primitives produce the same shapes regardless of which downstream consumer invokes them. This is the path a typical signature takes end-to-end.

```mermaid
graph LR
    APP["Consumer App<br/>(e.g. gtcx-mobile)"] -->|"sign(message, privateKeyHex)"| CRYPTO["@gtcx/crypto"]
    CRYPTO -->|"native.sign()"| BINDINGS["@gtcx/crypto-native<br/>(NAPI boundary +<br/>hex validation)"]
    BINDINGS -->|"NAPI call"| RUST["rust/gtcx-crypto<br/>aws-lc-rs<br/>(CMVP #4816)"]
    RUST -->|"Ed25519 signature bytes"| BINDINGS
    BINDINGS -->|"hex string"| CRYPTO
    CRYPTO -->|"signature hex"| APP
    APP -->|"verify(message, sig, publicKeyHex)"| CRYPTO
    CRYPTO -->|"isHex() guard;<br/>false on malformed input"| RESULT["boolean"]
```

NAPI-boundary hex validation lands in [`packages/crypto-native/src/key-derivation.ts`](../../packages/crypto-native/src/index.ts) per commit `28c03ce`. Verifier-as-predicate semantics (return `false`, don't throw) are documented in the [api-change-migration-policy](../release/api-change-migration-policy.md).

## Trust boundaries

The repo enforces explicit security tiers; security-sensitive packages require Cryptographic Security Engineer review per [`AGENTS.md`](../../AGENTS.md).

```mermaid
graph TB
    subgraph Untrusted["Untrusted Inputs"]
        EXTERNAL["External callers<br/>(user input, network,<br/>untrusted hex strings)"]
    end

    subgraph Boundary["Validation Boundary"]
        ASSERT["assertHex / isHex<br/>(packages/crypto-native)"]
        ZOD["Zod schemas<br/>(packages/schemas)"]
        SANITIZE["sanitizeSecrets<br/>(packages/security)"]
    end

    subgraph Trusted["Trusted Internal"]
        FIPS["FIPS-validated crypto<br/>(rust/gtcx-crypto via<br/>aws-lc-rs CMVP #4816)"]
        HSM["HSM-backed keys<br/>(PKCS11 / AWS KMS)"]
        AUDIT["Audited operations<br/>(SecurityLogger strict mode)"]
    end

    EXTERNAL --> Boundary
    Boundary -->|"validated"| Trusted
    Boundary -.->|"rejected"| ERROR["TypeError<br/>or false (verifier)"]

    AUDIT -.->|"observed by"| OBSERVABILITY["Trust telemetry<br/>(redacted via<br/>sanitizeSecrets)"]
```

Cross-references: [`docs/security/threat-control-matrix.md`](../security/threat-control-matrix.md), [`docs/security/trust-contract-matrix.md`](./trust-contract-matrix.md), [`docs/security/fips-validation-boundary.md`](../security/fips-validation-boundary.md).

## Deployment topology

gtcx-core has no runtime — it ships as published packages that downstream consumers `pnpm install` (or pin via workspace links during development).

```mermaid
graph LR
    subgraph Source["Source"]
        REPO["gtcx-core repo<br/>(main branch)"]
    end

    subgraph CI["CI / Release Pipeline"]
        ACTIONS["GitHub Actions<br/>(.github/workflows/release.yml)"]
        GATES["Pre-publish gates:<br/>lint, typecheck, test,<br/>architecture:check,<br/>api:check:release,<br/>provenance:generate"]
        CHANGESETS["changesets/action<br/>(version + publish)"]
    end

    subgraph Registries["Public Registries"]
        NPM["npmjs.org<br/>@gtcx/* x 21<br/>+ SLSA provenance"]
        CRATES["crates.io<br/>gtcx-* x 6"]
    end

    subgraph Consumption["Consumption"]
        WORKSPACE["Workspace consumers<br/>(other gtcx-* repos<br/>via workspace:*)"]
        EXTERNAL["External consumers<br/>(npm install @gtcx/*)"]
    end

    REPO -->|"push main"| ACTIONS
    ACTIONS --> GATES
    GATES -->|"green"| CHANGESETS
    CHANGESETS -->|"changeset publish --provenance"| NPM
    REPO -->|"cargo publish<br/>(per crate)"| CRATES
    NPM --> EXTERNAL
    REPO -.-> WORKSPACE
```

Operational detail in [`docs/devops/release-mgmt/npm-publish-runbook.md`](../devops/release-mgmt/npm-publish-runbook.md).

## What's NOT here

- No service runtime. No HTTP/gRPC surface. No deployed long-running processes. The "deployment" is `npm publish` + `cargo publish`.
- No PII processing. The library handles cryptographic primitives over caller-provided bytes; it never sees user-identifiable data unless a downstream consumer chooses to put it in a payload.
- No persistent state. Stateful concerns (offline queues, sync) are library APIs the downstream consumer instantiates with its own storage backend.

## Linked artifacts

- [overview.md](./overview.md) — module-level overview, package responsibilities, ADR map
- [system-architecture-spec.md](./system-architecture-spec.md) — formal security-focused specification
- [ecosystem-integration.md](./ecosystem-integration.md) — cross-repo dependency graph
- [trust-contract-matrix.md](./trust-contract-matrix.md) — trust boundaries with control mappings
- [`docs/governance/trust-portal.md`](../governance/trust-portal.md) — external evidence index
