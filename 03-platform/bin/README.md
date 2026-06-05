# bin/ — repo CLI entrypoints

Thin wrappers so agents and operators can run session commands without the `pnpm` prefix.

| Entry                                           | Purpose                                                                                      |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`agent`](./agent) · [`agent.mjs`](./agent.mjs) | `agent start`, `agent next-work`, `agent protocols:check` → `package.json` `agent:*` scripts |

## Setup

```bash
export PATH="$(pwd)/bin:$PATH"
agent start
```

Or: `pnpm agent:cli:path` — paste export into shell profile.

## Baseline session

`baseline start` Phase B resolves to `bin/agent.mjs start` when present (same as `pnpm agent:start`).
