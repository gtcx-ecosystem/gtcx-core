# @gtcx/domain

Foundational domain types, schemas, events, metrics, and versioning for GTCX. Intentionally excludes application services — see `@gtcx/services`.

## Scope

- Domain types and Zod schemas for registration, trading, and compliance
- Domain event types and in-memory event emitter
- Metrics definitions and in-memory metrics collector
- Versioning, deprecation markers, and API stability metadata
- Internal offline queue utilities

## Key Exports (`packages/domain/src/index.ts`)

| Category   | Exports                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Types      | `AssetLot`, `TradeRequest`, `ComplianceRecord`, and related domain models                      |
| Schemas    | `AssetRegistrationDataSchema`, `TradeRequestSchema`, `ComplianceReportOptionsSchema` + helpers |
| Events     | `DomainEventType`, `DomainEvent`, `DomainEventFactory`, `InMemoryEventEmitter`                 |
| Metrics    | `IMetricsCollector`, `InMemoryMetricsCollector`, `METRIC_NAMES`                                |
| Versioning | `API_VERSION`, `DEPRECATIONS`, `deprecated()` helpers                                          |

## Notes

- Business workflows live in `@gtcx/services` — this package is domain primitives only.
- All external input should be validated using the Zod schemas exported from this package.

## References

- `../../../specs/eventcore.md`
- `services.md`
