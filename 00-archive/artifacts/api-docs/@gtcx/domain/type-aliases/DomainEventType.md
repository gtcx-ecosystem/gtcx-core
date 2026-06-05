[**GTCX Core API Reference**](../../../README.md)

***

[GTCX Core API Reference](../../../README.md) / [@gtcx/domain](../README.md) / [](../README.md) / DomainEventType

# Type Alias: DomainEventType

> **DomainEventType** = `"registration.started"` \| `"registration.validated"` \| `"registration.completed"` \| `"registration.failed"` \| `"registration.progress_updated"` \| `"trading.price_calculated"` \| `"trading.opportunity_found"` \| `"trading.trade_initiated"` \| `"trading.trade_executed"` \| `"trading.trade_failed"` \| `"trading.settlement_started"` \| `"trading.settlement_completed"` \| `"compliance.check_started"` \| `"compliance.check_completed"` \| `"compliance.violation_detected"` \| `"compliance.warning_issued"` \| `"compliance.report_generated"` \| `"compliance.framework_registered"` \| `"compliance.zk_proof_invalid"` \| `"compliance.zk_proof_verified"`

Defined in: 03-platform/packages/events/dist/index.d.ts:9

Event type definitions for @gtcx/events

Canonical source for all domain event types, payloads, and infrastructure.
Other packages (including @gtcx/domain) re-export from here.

Package: @gtcx/events
