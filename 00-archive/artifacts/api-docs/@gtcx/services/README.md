[**GTCX Core API Reference**](../../README.md)

***

[GTCX Core API Reference](../../README.md) / @gtcx/services

# @gtcx/services

Application-level business services — registration, trading, compliance.

## Installation

```bash
pnpm add @gtcx/services
```

## Sub-exports

| Path                          | Description            |
| ----------------------------- | ---------------------- |
| `@gtcx/services/registration` | Asset lot registration |
| `@gtcx/services/trading`      | Trading operations     |
| `@gtcx/services/compliance`   | Compliance checking    |

## Usage

```typescript
import {
  AssetLotRegistrationService,
  TradingService,
  UnifiedComplianceService,
} from '@gtcx/services';

// Registration — inject your implementations of the service interfaces
const registration = new AssetLotRegistrationService(
  { cryptoService, locationService, storageService },
  { minGpsAccuracy: 10, minPhotos: 2, maxPhotos: 10 }
);
const steps = registration.getWorkflowSteps();

// Trading — inject trader repository and event emitter
const trading = new TradingService({ traderRepository, eventEmitter });

// Compliance — inject compliance repository
const compliance = new UnifiedComplianceService({ complianceRepository, eventEmitter });
```

All services use dependency injection. Required interfaces are defined in `@gtcx/domain`.

## API

| Export                        | Description                                                             |
| ----------------------------- | ----------------------------------------------------------------------- |
| `AssetLotRegistrationService` | Registration workflow with configurable validation rules                |
| `TradingService`              | Trade execution with license validation                                 |
| `UnifiedComplianceService`    | Compliance checks (includes optional commitment-based proof validation) |
| `ValidationError`             | Thrown on invalid registration input                                    |
| `LicenseValidationError`      | Thrown on invalid trading license                                       |
| `ComplianceError`             | Thrown on compliance check failure                                      |

## License

MIT

## Modules

- [](README.md)
- [registration](registration/README.md)
- [trading](trading/README.md)
