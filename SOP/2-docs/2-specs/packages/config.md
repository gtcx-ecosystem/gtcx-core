# @gtcx/config

Shared build configuration presets for the gtcx-core workspace. Packages extend these configs rather than maintaining their own from scratch.

## Scope

| Package                      | Exports                                  |
| ---------------------------- | ---------------------------------------- |
| `packages/config/eslint`     | Shared ESLint configuration              |
| `packages/config/typescript` | Shared TypeScript (`tsconfig.json`) base |
| `packages/config/tsup`       | Shared tsup build presets                |
| `packages/config/tailwind`   | Shared Tailwind CSS configuration        |

## Usage

Each package extends the relevant config:

```json
// tsconfig.json
{ "extends": "@gtcx/config/typescript" }
```

```ts
// tsup.config.ts
import { defineConfig } from '@gtcx/config/tsup';
export default defineConfig({ entry: ['src/index.ts'] });
```

## References

- `packages/config/*/package.json`
