---
title: 'ADR-002: Zod over JSON Schema for Runtime Validation'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'decisions']
review_cycle: 'on-change'
---

---

title: '002 Zod Over Json Schema'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'

---

# ADR-002: Zod over JSON Schema for Runtime Validation

## Status

Accepted

## Date

2025-01-15

## Context

GTCX enforces runtime validation at every package boundary — data entering any `@gtcx/*` package must be validated before processing. This is a security requirement (P9) and a type safety requirement (P2).

Two mainstream options exist for TypeScript runtime validation:

1. **JSON Schema** — Language-agnostic, widely supported, but requires separate type definitions and schema definitions (two sources of truth). Libraries like `ajv` compile schemas to validators but don't infer TypeScript types.

2. **Zod** — TypeScript-first schema library that infers types directly from schema definitions. Single source of truth: define the schema once, get both runtime validation and compile-time types.

The GTCX `@gtcx/schemas` package defines the Core12 compliance framework with 12 domain schemas, each containing multiple controls with nested validation rules. Maintaining separate TypeScript interfaces and JSON Schemas for this volume would be error-prone.

## Decision

Use Zod as the single source of truth for all data validation and TypeScript type inference across the `@gtcx/*` package ecosystem.

- Every package boundary validates inputs with Zod schemas
- TypeScript types are inferred via `z.infer<typeof Schema>` — no manual interface definitions
- The `@gtcx/schemas` package exports all Core12 domain schemas as Zod objects
- `@gtcx/domain` uses Zod for asset, event, and metric type definitions

## Consequences

### Positive

- Single source of truth: schema changes automatically update TypeScript types
- Rich validation: `.min()`, `.max()`, `.regex()`, `.refine()`, `.transform()` — more expressive than JSON Schema
- Composable: `.merge()`, `.extend()`, `.pick()`, `.omit()` for schema composition
- Tree-shakeable: Only imported schemas are bundled
- Excellent error messages with `.safeParse()` returning structured `ZodError`

### Negative

- Not language-agnostic: Rust crates and Python services can't consume Zod schemas directly (need separate validation)
- Larger bundle than `ajv` for simple validations
- Zod is a runtime dependency, not just a dev dependency

### Neutral

- Zod schemas can be converted to JSON Schema via `zod-to-json-schema` if interop is needed later
- The Core12 framework's 12 domains × N controls would require the same validation logic regardless of library choice
