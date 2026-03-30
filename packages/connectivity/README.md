# @gtcx/connectivity

Network connectivity detection and profiling for offline-first applications.

## Installation

```bash
pnpm add @gtcx/connectivity
```

## Quick Start

```typescript
import { ConnectivityDetector, classifyProfile } from '@gtcx/connectivity';

const detector = new ConnectivityDetector();
const profile = classifyProfile(await detector.check());
```

## API

| Export                    | Description                   |
| ------------------------- | ----------------------------- |
| `ConnectivityDetector`    | Network state detector        |
| `classifyProfile(result)` | Classify connectivity profile |
| `ConnectivityState`       | Current state type            |

## Related

- [ADR-007: Offline-First Architecture](../../_sop/2-docs/3-engineering/6-decisions/007-offline-first-architecture.md)

## License

MIT
