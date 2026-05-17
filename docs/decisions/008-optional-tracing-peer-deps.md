---
title: '008 Optional Tracing Peer Deps'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'
---

# ADR-008: Optional Tracing via Peer Dependencies

## Status

Accepted

## Date

2025-01-15

## Context

The `@gtcx/crypto` and `@gtcx/verification` packages provide traced wrappers around their core operations (e.g., `tracedSign()`, `tracedVerify()`, `tracedGenerateCertificate()`). These traced variants log operation metadata via `@gtcx/ai`'s tracing infrastructure for observability and debugging.

Initially, `@gtcx/ai` was a hard dependency of `@gtcx/crypto`. This created problems:

- `@gtcx/crypto` is the foundation package — it should have zero internal dependencies to remain lightweight and universally importable
- `@gtcx/ai` imports were pulled into every consumer, even those that don't need tracing
- Circular dependency risk: if `@gtcx/ai` ever needed crypto primitives, it would create a cycle
- Bundle size impact for edge/WASM builds where tracing is unnecessary

## Decision

Make `@gtcx/ai` (and `@gtcx/types`) optional peer dependencies of `@gtcx/crypto` and `@gtcx/verification`. The traced wrappers use a tracing adapter pattern:

1. Each package has a `tracing.ts` adapter module that tries to import `@gtcx/ai`
2. If `@gtcx/ai` is installed, traced operations log to the AI tracing system
3. If `@gtcx/ai` is not installed, traced operations silently fall back to no-op logging
4. Core operations (`sign()`, `verify()`, `hash()`) have zero dependencies on tracing

Package.json configuration:

```json
{
  "peerDependencies": {
    "@gtcx/ai": "workspace:*",
    "@gtcx/types": "workspace:*"
  },
  "peerDependenciesMeta": {
    "@gtcx/ai": { "optional": true },
    "@gtcx/types": { "optional": true }
  }
}
```

## Consequences

### Positive

- `@gtcx/crypto` has zero hard internal dependencies — maximum portability
- Consumers who don't need tracing get a smaller dependency tree
- No circular dependency risk between crypto and AI packages
- Edge/WASM builds can exclude tracing entirely
- Core crypto operations are never affected by tracing failures

### Negative

- Traced wrappers need runtime detection of `@gtcx/ai` availability (dynamic import)
- Two code paths to maintain (with tracing, without tracing)
- TypeScript type inference is slightly weaker for optional peer deps

### Neutral

- pnpm handles optional peer dependencies correctly (no phantom dependency risk)
- The adapter pattern is a common solution in the Node.js ecosystem (e.g., `debug`, `pino`)
