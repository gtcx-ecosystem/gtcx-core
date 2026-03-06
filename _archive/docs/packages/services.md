# @gtcx/services

Application‑level business services built on `@gtcx/domain`. These services encapsulate registration, trading, and compliance logic with dependency injection for all externals.

## Scope

- Asset registration workflows
- Trading price calculation + execution
- Compliance checks and reporting

## Key Exports

From `packages/services/src/index.ts`:

- `AssetLotRegistrationService` (+ `ValidationError`)
- `TradingService` (+ `LicenseValidationError`, `ComplianceError`, `MaxValueError`)
- `UnifiedComplianceService`

## Dependencies (Injected)

Services rely on interfaces from `@gtcx/domain`:

- `ICryptoService`
- `ILocationService`
- `IStorageService`
- `IPriceService`
- `IComplianceService`

## Notes

- Zod validation runs at service boundaries using `@gtcx/domain` schemas.
- Events are emitted via `DomainEventFactory` and an event emitter.
- The services are business‑logic only; persistence and transport are injected.

## References

- `docs/packages/domain.md`
- `packages/services/src/*`
