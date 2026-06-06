# config/ — toolchain and ops manifest

| Path                                   | Role                       |
| -------------------------------------- | -------------------------- |
| `config/ops.manifest.json`             | P29 operational domain map |
| `config/toolchain/tsconfig.base.json`  | TypeScript base            |
| `config/toolchain/turbo.json`          | Turborepo pipeline         |
| `config/toolchain/typedoc.json`        | TypeDoc API generation     |
| `config/toolchain/vitest.workspace.ts` | Vitest workspace topology  |

**Root stubs (real files, not symlinks):** `tsconfig.json` extends `config/toolchain/tsconfig.base.json`; `turbo.json` is copied from SoR.

```bash
pnpm config:stubs:sync   # refresh root copies after editing config/
pnpm config:stubs:check  # CI gate — root must match SoR
```

Ship artifacts: `04-ship/docker/Dockerfile`
