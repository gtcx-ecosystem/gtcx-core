# @gtcx/schemas

Core12 compliance framework — structured access to compliance domains and controls.

## Installation

```bash
pnpm add @gtcx/schemas
```

## Quick Start

```typescript
import { getDomain, getControl, getAllControls } from '@gtcx/schemas';

const controls = getAllControls();
console.log(`Total controls: ${controls.length}`);

const domain = getDomain('D01');
console.log(domain?.name, domain?.controls.length);
```

## Sub-exports

| Path                   | Description                            |
| ---------------------- | -------------------------------------- |
| `@gtcx/schemas/core12` | Core12 compliance domains and controls |

## API

| Export             | Description                 |
| ------------------ | --------------------------- |
| `getDomain(id)`    | Get compliance domain by ID |
| `getControl(id)`   | Get specific control        |
| `getAllControls()` | List all controls           |

## Related

- [Architecture Decision Records](../../docs/adr/README.md)

## License

MIT
