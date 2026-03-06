# EventCore (Domain Events)

**Status**: Active (2026-02-21)

EventCore in `gtcx-core` is the canonical domain event model used for observability and cross-service coordination. It is implemented in `@gtcx/domain` and re‑exported by `@gtcx/events` with buffering utilities.

## Purpose

- Provide a single, typed event envelope for domain workflows.
- Enable consistent telemetry across registration, trading, and compliance flows.
- Support offline buffering and replay in edge/mobile scenarios.

## Event Envelope

Implemented in `packages/domain/src/events.ts`:

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

## Event Types (Current)

- **Registration**: `registration.started`, `registration.validated`, `registration.completed`, `registration.failed`, `registration.progress_updated`
- **Trading**: `trading.price_calculated`, `trading.opportunity_found`, `trading.trade_initiated`, `trading.trade_executed`, `trading.trade_failed`, `trading.settlement_started`, `trading.settlement_completed`
- **Compliance**: `compliance.check_started`, `compliance.check_completed`, `compliance.violation_detected`, `compliance.warning_issued`, `compliance.report_generated`, `compliance.framework_registered`, `compliance.zk_proof_invalid`, `compliance.zk_proof_verified`

## Event Bus + Offline Buffering

`@gtcx/events` provides a typed event bus with offline buffering and replay:

- `packages/events/src/event-bus.ts`
- `packages/events/src/offline-buffer.ts`

Use this for local or edge deployments where connectivity is intermittent.

## Schema Evolution

- Changes to payload shapes should increment the `version` field.
- Consumers should be tolerant to additive fields.

## References

- `docs/specs/data-models.md`
- `docs/packages/domain.md`
- `docs/packages/events.md`
