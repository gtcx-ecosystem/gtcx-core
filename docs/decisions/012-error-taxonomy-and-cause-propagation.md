---
title: 'ADR-012: Error Taxonomy and Cause Propagation'
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

title: '012 Error Taxonomy And Cause Propagation'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'critical'
tags: ['docs', 'architecture']
review_cycle: 'quarterly'

---

# ADR-012: Error Taxonomy and Cause Propagation

## Status

Accepted

## Date

2026-02-19

## Context

Service and verification layers require reliable error semantics for observability, auditability, and integration safety. Historically, some paths wrapped errors without preserving causal context.

## Decision

Adopt a taxonomy-first error model for application code:

- standardize error codes through `@gtcx/types` common errors
- preserve original failures through `Error` `cause` where wrapping occurs
- prefer explicit error classes/codes over ad hoc string-only errors in public service paths

This policy applies to all new service and verification code and is enforced by code review and CI coverage of critical flows.

## Consequences

### Positive

- Better operational diagnosis through preserved root causes.
- More predictable integration behavior for callers.
- Stronger incident forensics and audit trails.

### Negative

- Slight increase in implementation and test verbosity.
- Legacy code may require incremental refactors to conform.

### Neutral

- Existing error strings remain valid; taxonomy metadata is additive for compatibility.
