# @gtcx/tsup-config

Shared [tsup](https://tsup.egoist.dev/) build presets for GTCX library packages.

## Usage

```typescript
import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';

export default defineConfig({ ...baseConfig, entry: ['src/index.ts'] });
```

See [`packages/config/README.md`](../README.md) for the full config package index.

## License

MIT
