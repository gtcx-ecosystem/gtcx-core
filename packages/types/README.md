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

## Related

- [Architecture Decision Records](../../docs/adr/README.md)

## License

MIT
