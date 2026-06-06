# @gtcx/types

Core type definitions for the GTCX ecosystem.

## Installation

```bash
pnpm add @gtcx/types
```

## Quick Start

```typescript
import type { Identity, TradePass, GeoTag, User, Lot } from '@gtcx/types';
```

## API

| Export      | Description                  |
| ----------- | ---------------------------- |
| `Identity`  | Core identity protocol type  |
| `TradePass` | Trade pass protocol type     |
| `GeoTag`    | Geo-location tagging type    |
| `GCI`       | Global Compliance Identifier |
| `PvP`       | Proof-vs-Provenance protocol |
| `VaultMark` | Vault marking protocol       |
| `User`      | User model type              |
| `Lot`       | Lot model type               |
| `Permit`    | Permit model type            |
| `Site`      | Site model type              |

> **Note:** Types-only package — no runtime dependencies.

## When to use `@gtcx/types` vs `@gtcx/domain`

These packages serve different layers of the stack:

- **`@gtcx/types`** — Protocol-level types. Use when building protocol implementations (gtcx-protocols) or platform integrations that work directly with the six verification protocols. Defines: `TradePass`, `GeoTag`, `GCI`, `VaultMark`, `PvP`, `Identity`, `Lot`, `User`, `Permit`, `Site`.

- **`@gtcx/domain`** — Business-domain types and runtime services. Use when building application services (gtcx-platforms, gtcx-mobile) that handle asset registration, trading, and compliance workflows. Defines: `AssetLot`, `Transaction`, `Trader`, `ComplianceRecord`, plus events, schemas, metrics, and offline infrastructure.

`@gtcx/types` has zero runtime code and zero internal dependencies. `@gtcx/domain` depends on `@gtcx/utils` and peers on `@gtcx/types` and `@gtcx/crypto`.

If you need both, import protocol types from `@gtcx/types` and business logic types from `@gtcx/domain`.

## Related

- [Architecture Decision Records](../../../01-docs/decisions/README.md)

## License

MIT
