---
title: 'Events'
status: 'current'
date: '2026-05-17'
owner: 'protocol-architect'
role: 'protocol-architect'
tier: 'standard'
tags: ['docs', 'specs']
review_cycle: 'on-change'
---

# Package Spec — `@gtcx/events`

> **Status:** Current
> **Date:** 2026-05-10
> **Owner:** Protocol Architect

**Classification:** Standard — changes follow normal PR review process.

---

## Purpose

Core event bus for the GTCX architecture. Provides a typed `EventEmitter` with offline buffering, replay capability, and domain event re-exports. Decouples producers from consumers across `@gtcx/domain` service boundaries.

---

## Public API

### Event Bus

| Export              | Description                                         |
| ------------------- | --------------------------------------------------- |
| `TypedEventBus`     | Typed EventEmitter class — subscribe, emit, replay  |
| `EventHandler<T>`   | Type: event handler function signature              |
| `EventSubscription` | Type: subscription handle (for unsubscribing)       |
| `EventBusOptions`   | Type: bus configuration (buffer size, replay limit) |
| `BufferedEvent<T>`  | Type: a buffered event with timestamp and sequence  |

### Offline Buffer

Events emitted while offline are buffered in memory (configurable size limit). On reconnection, buffered events are replayed in emission order. Buffer overflow drops the oldest events.

### Domain Event Re-exports

All `@gtcx/domain` domain event types and the `DomainEventFactory` are re-exported from this package for convenience:

| Re-export                   | Source                                     |
| --------------------------- | ------------------------------------------ |
| `DomainEventType`           | `@gtcx/domain`                             |
| `DomainEvent`               | `@gtcx/domain`                             |
| `IDomainEventEmitter`       | `@gtcx/domain`                             |
| Registration event payloads | `@gtcx/domain`                             |
| Trade event payloads        | `@gtcx/domain`                             |
| Compliance event payloads   | `@gtcx/domain`                             |
| `DomainEventFactory`        | `@gtcx/domain`                             |
| `nullEventEmitter`          | `@gtcx/domain` — no-op emitter for testing |

---

## Dependencies

| Dependency                   | Role                           |
| ---------------------------- | ------------------------------ |
| `@gtcx/domain` `workspace:*` | Domain event types and factory |

---

## Non-Goals

- Does not persist events to disk or network — buffering is in-memory only
- Does not implement message queue semantics (durability, acknowledgement, dead letters) — use a proper message broker for those requirements
- Does not define domain event shapes — those are defined in `@gtcx/domain`

---

## Implementation

`packages/events/src/`

---

## Reference

- [`docs/specs/packages/domain.md`](./domain.md) — domain event types
- [`docs/specs/packages/sync.md`](./sync.md) — sync engine consumes events
- [`docs/specs/core-spec.md`](../core-spec.md) — system overview
