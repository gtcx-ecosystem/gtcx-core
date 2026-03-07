# @gtcx/utils

Small shared utility helpers used across GTCX packages.

## Scope

- ID generation
- Sleep and retry helpers
- JSON parsing with optional Zod validation
- Object helpers
- Debounce and throttle

## Key Exports (`packages/utils/src/index.ts`)

| Export        | Description                            |
| ------------- | -------------------------------------- |
| ID generation | `generateId`, `generateShortId`        |
| Async         | `sleep(ms)`, `retry(fn, opts)`         |
| JSON          | `safeParseJson`, `parseJsonWithSchema` |
| Objects       | `pick`, `omit`, `deepClone`            |
| Functions     | `debounce`, `throttle`                 |

## Notes

- No runtime dependencies beyond the Node.js standard library.
- All helpers are individually importable for tree-shaking.
