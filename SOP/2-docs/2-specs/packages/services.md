# @gtcx/services

Application-level business services built on `@gtcx/domain`. Encapsulates registration, trading, and compliance workflows with dependency injection for all externals.

## Scope

- Asset lot registration workflows
- Trading price calculation and execution
- Compliance checks and reporting

## Key Exports (`packages/services/src/index.ts`)

| Export                        | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| `AssetLotRegistrationService` | Asset registration with validation and event emission   |
| `ValidationError`             | Registration validation error                           |
| `TradingService`              | Price calculation, opportunity finding, trade execution |
| `LicenseValidationError`      | Trading license validation failure                      |
| `ComplianceError`             | Compliance gate failure                                 |
| `MaxValueError`               | Trade value limit exceeded                              |
| `UnifiedComplianceService`    | Unified compliance check and reporting                  |

## Injected Dependencies

All externals are injected via interfaces from `@gtcx/domain`:

| Interface            | Purpose             |
| -------------------- | ------------------- |
| `ICryptoService`     | Signing and hashing |
| `ILocationService`   | Location validation |
| `IStorageService`    | Persistence         |
| `IPriceService`      | Price feeds         |
| `IComplianceService` | Compliance rules    |

## Notes

- Zod validation runs at service boundaries using `@gtcx/domain` schemas.
- Events are emitted via `DomainEventFactory` + an event emitter from `@gtcx/domain`.
- Services are business logic only — persistence and transport are injected.

## References

- `domain.md`
- `packages/services/src/`
