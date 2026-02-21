# {repo-name}

> {one-line-description}

---

## Structure

```
{repo-name}/
├── apps/
│   ├── {app-1}/              ← {app-1-description}
│   └── {app-2}/              ← {app-2-description}
├── packages/
│   ├── {package-1}/          ← {package-1-description}
│   ├── {package-2}/          ← {package-2-description}
│   └── {package-3}/          ← {package-3-description}
├── services/
│   ├── {service-1}/          ← {service-1-description}
│   └── {service-2}/          ← {service-2-description}
├── docs/                     ← Documentation (see docs/README.md)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Packages

| Package                | Path                   | Description             |
| ---------------------- | ---------------------- | ----------------------- |
| `@{scope}/{package-1}` | `packages/{package-1}` | {package-1-description} |
| `@{scope}/{package-2}` | `packages/{package-2}` | {package-2-description} |
| `@{scope}/{package-3}` | `packages/{package-3}` | {package-3-description} |

## Prerequisites

| Tool              | Version           | Install                          |
| ----------------- | ----------------- | -------------------------------- |
| Node.js           | {node-version}    | [nodejs.org](https://nodejs.org) |
| pnpm              | {pnpm-version}    | `corepack enable`                |
| Docker            | {docker-version}+ | [docker.com](https://docker.com) |
| {additional-tool} | {tool-version}    | {tool-install-link}              |

## Quick Start

```bash
# Clone and install
git clone https://github.com/gtcx-ecosystem/{repo-name}.git
cd {repo-name}
pnpm install

# Build all packages
pnpm build

# Run development servers
pnpm dev

# Run all tests
pnpm test
```

## Services

| Service     | Port       | Description             |
| ----------- | ---------- | ----------------------- |
| {service-1} | `{port-1}` | {service-1-description} |
| {service-2} | `{port-2}` | {service-2-description} |
| {app-1}     | `{port-3}` | {app-1-description}     |

## Documentation

Full documentation lives in [`docs/`](docs/README.md), organized by the GTCX documentation standard:

| Folder          | Question It Answers           |
| --------------- | ----------------------------- |
| `architecture/` | How does the system work?     |
| `specs/`        | What are we building?         |
| `engineering/`  | How do I build/contribute?    |
| `operations/`   | How do I run/maintain this?   |
| `reference/`    | Where do I look something up? |
| `gitbook/`      | What do external users need?  |

---

Part of the [GTCX ecosystem](https://github.com/gtcx-ecosystem).
