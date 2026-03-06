# EventCore — Domain Events

**Status**: Active
**Last reviewed**: 2026-02-21

The canonical domain event model for `gtcx-core`. Implemented in `@gtcx/domain` and re-exported by `@gtcx/events` with offline buffering utilities.

## Purpose

- Provide a single typed event envelope for all domain workflows.
- Enable consistent telemetry across registration, trading, and compliance flows.
- Support offline buffering and replay for edge and mobile deployments.

## Event Envelope

Defined in `packages/domain/src/events.ts`:

```ts
export interface DomainEvent<T = unknown> {
  type: DomainEventType;
  payload: T;
  timestamp: number; // Unix ms
  correlationId?: string; // optional tracing link
  source: 'registration' | 'trading' | 'compliance';
  version: number; // schema version
}
```

## Event Types

### Registration

`registration.started`, `registration.validated`, `registration.completed`, `registration.failed`, `registration.progress_updated`

### Trading

`trading.price_calculated`, `trading.opportunity_found`, `trading.trade_initiated`, `trading.trade_executed`, `trading.trade_failed`, `trading.settlement_started`, `trading.settlement_completed`

### Compliance

`compliance.check_started`, `compliance.check_completed`, `compliance.violation_detected`, `compliance.warning_issued`, `compliance.report_generated`, `compliance.framework_registered`, `compliance.zk_proof_invalid`, `compliance.zk_proof_verified`

## Event Bus + Offline Buffering

`@gtcx/events` provides a typed event bus with offline buffering and replay:

| Module                                  | Description                                 |
| --------------------------------------- | ------------------------------------------- |
| `packages/events/src/event-bus.ts`      | Typed event bus with handler registration   |
| `packages/events/src/offline-buffer.ts` | Persistent queue for edge/offline scenarios |

Use the offline buffer for deployments where connectivity is intermittent.

## Schema Evolution Rules

- Payload shape changes must increment the `version` field in `DomainEvent`.
- Consumers must be tolerant to additive fields.
- Breaking payload changes require a major version bump and ecosystem coordination.

## References

- `data-models.md`
- `packages/domain.md`
- `packages/events.md`
