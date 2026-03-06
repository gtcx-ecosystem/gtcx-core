# Validator Mesh Demo (Local)

This guide demonstrates how to run the local libp2p mesh demo included in `gtcx-core`. It is not a production validator deployment.

## Prerequisites

- Node.js 20+
- pnpm 9+

## 1. Build the Network Package

```bash
pnpm --filter @gtcx/network build
```

## 2. Run Mesh Demo (TCP)

```bash
GTCX_P2P_TRANSPORT=tcp pnpm network:mesh:demo
```

## 3. Run Mesh Demo (QUIC)

```bash
GTCX_P2P_TRANSPORT=quic pnpm network:mesh:demo
```

## Notes

- The demo uses `tools/network-mesh-demo.mjs` and the libp2p adapter in `packages/network/src/libp2p.ts`.
- Production validator deployment is outside the scope of this repo and will be documented separately.
