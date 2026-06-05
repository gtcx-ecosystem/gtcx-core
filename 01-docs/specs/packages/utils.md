---
title: 'Package Spec — `@gtcx/utils`'
status: 'current'
date: '2026-05-27'
owner: 'gtcx-core'
role: 'protocol-architect'
agent_id: 'agent://gtcx-core/2026-05-27/session-backfill'
trust_score: 60
autonomy_level: 'permissioned'
tier: 'standard'
tags: ['documentation', 'specs']
review_cycle: 'on-change'
---

---

title: 'Utils'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'

---

# Package Spec — `@gtcx/utils`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Common utility functions for GTCX applications. Covers universal primitives — ID generation, sleep, safe JSON parsing with optional Zod validation — that appear in every package but have no logical home in a domain-specific package.

---

## Public API

| Export                                   | Signature                       | Description                                                                             |
| ---------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| `sleep(ms)`                              | `(number) => Promise<void>`     | Delay for a given number of milliseconds                                                |
| `generateId(prefix?)`                    | `(string?) => string`           | Generate a UUID, optionally prefixed                                                    |
| `safeJsonParse(json, fallback, schema?)` | `(string, T, ZodType<T>?) => T` | Parse JSON safely; validate with Zod schema if provided; return fallback on any failure |

Additional utility functions are added here as they meet the bar: used in 3+ packages and have no domain-specific home.

---

## Dependencies

| Dependency      | Role                                          |
| --------------- | --------------------------------------------- |
| `zod` `^3.23.0` | Optional schema validation in `safeJsonParse` |

Uses Node.js built-in `node:crypto` (`randomUUID`) — no external randomness dependency.

---

## Addition Criteria

A function belongs in `@gtcx/utils` if:

1. It is used in 3 or more `@gtcx/*` packages
2. It has no domain-specific semantics
3. It has no dependency on any `@gtcx/*` package (to avoid circular dependencies)

Do not add business logic, domain types, or `@gtcx/*` imports to this package.

---

## Non-Goals

- Not a general-purpose utility library — only GTCX-cross-cutting primitives
- Does not re-export third-party utilities — consumers import directly from the library

---

## Implementation

`03-platform/packages/utils/src/`

---

## Reference

- [`01-docs/specs/core-spec.md`](../core-spec.md) — system overview and dependency rules
