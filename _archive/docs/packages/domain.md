# @gtcx/domain

Foundational domain types, schemas, events, metrics, and versioning for GTCX. This package intentionally excludes application services (see `@gtcx/services`).

## Scope

- Domain types and Zod schemas for registration, trading, and compliance
- Event types + in‑memory event emitter
- Metrics definitions + in‑memory metrics collector
- Versioning, deprecation markers, and API stability metadata
- Offline queue utilities (internal)

## Key Exports

From `packages/domain/src/index.ts`:

- **Types**: `AssetLot`, `TradeRequest`, `ComplianceRecord`, etc.
- **Schemas**: `AssetRegistrationDataSchema`, `TradeRequestSchema`, `ComplianceReportOptionsSchema` + helpers.
- **Events**: `DomainEventType`, `DomainEvent`, `DomainEventFactory`, `InMemoryEventEmitter`.
- **Metrics**: `IMetricsCollector`, `InMemoryMetricsCollector`, `METRIC_NAMES`.
- **Versioning**: `API_VERSION`, `DEPRECATIONS`, `deprecated()` helpers.

## Notes

- Business workflows live in `@gtcx/services`.
- Schemas are Zod‑based; callers should validate all external input.

## References

- `docs/specs/eventcore.md`
- `docs/packages/services.md`
