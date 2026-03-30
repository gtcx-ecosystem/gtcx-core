# @gtcx/config

Shared build configuration presets for the GTCX monorepo.

## Packages

| Package                   | Description                                                                |
| ------------------------- | -------------------------------------------------------------------------- |
| `@gtcx/eslint-config`     | ESLint 9 flat config with TypeScript, import ordering, and Math.random ban |
| `@gtcx/typescript-config` | Base tsconfig.json (ES2022, strict, NodeNext)                              |
| `@gtcx/tsup-config`       | Shared tsup build options (CJS + ESM, DTS, sourcemaps)                     |
| `@gtcx/tailwind-config`   | Tailwind CSS preset                                                        |

## Usage

```json
// tsconfig.json
{ "extends": "@gtcx/typescript-config/base.json" }
```

```typescript
// tsup.config.ts
import { baseConfig } from '@gtcx/tsup-config';
import { defineConfig } from 'tsup';
export default defineConfig({ ...baseConfig, entry: ['src/index.ts'] });
```

## License

MIT
