# @gtcx/services

Application-level business services for registration, trading, and compliance workflows.
This package composes `@gtcx/domain` contracts with dependency-injected infrastructure
to keep business logic deterministic, testable, and commodity-agnostic.

## What This Package Provides

- `AssetLotRegistrationService`: Validates registration input, tracks workflow progress,
  generates cryptographic registration proofs, and persists asset lots.
- `TradingService`: Calculates fair pricing, discovers opportunities, executes trades,
  and emits market/trade telemetry events.
- `UnifiedComplianceService`: Evaluates asset and transaction compliance, builds dashboards,
  and produces compliance reports.

## Architecture Notes

- **Dependency inversion first**: every external capability (storage, pricing, crypto,
  compliance checks, location) is injected via interfaces from `@gtcx/domain`.
- **Schema-driven boundaries**: incoming payloads are validated with Zod schemas before
  business logic execution.
- **Event-native operations**: services emit domain events for observability and
  cross-service workflows.
- **Commodity abstraction**: logic is parameterized by `commodityType: string` and
  avoids protocol- or commodity-specific branching.

## Subpath Exports

| Import Path                   | Primary Export                   |
| ----------------------------- | -------------------------------- |
| `@gtcx/services`              | All services and service configs |
| `@gtcx/services/registration` | `AssetLotRegistrationService`    |
| `@gtcx/services/trading`      | `TradingService`                 |
| `@gtcx/services/compliance`   | `UnifiedComplianceService`       |

## Integration Example

```ts
import {
  AssetLotRegistrationService,
  TradingService,
  UnifiedComplianceService,
} from '@gtcx/services';
import type {
  ICryptoService,
  IStorageService,
  ILocationService,
  IPriceService,
  IComplianceService,
} from '@gtcx/domain';

const registration = new AssetLotRegistrationService({
  cryptoService: {} as ICryptoService,
  storageService: {} as IStorageService,
  locationService: {} as ILocationService,
});

const trading = new TradingService({
  cryptoService: {} as ICryptoService,
  storageService: {} as IStorageService,
  priceService: {} as IPriceService,
  complianceService: {} as IComplianceService,
});

const compliance = new UnifiedComplianceService({
  cryptoService: {} as ICryptoService,
  storageService: {} as IStorageService,
});
```

## Related

- [@gtcx/domain](./domain.md) — Shared types, schemas, domain events, and contracts used by services.
- [Shared Infrastructure](../architecture/shared-infrastructure.md) — Package boundaries and dependency graph.
- [Integration Patterns](../architecture/integration-patterns.md) — Cross-service orchestration patterns.
- [Security Framework](../specs/security-framework.md) — Security constraints and trust model.
