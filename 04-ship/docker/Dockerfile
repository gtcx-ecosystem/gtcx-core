# =============================================================================
# GTCX Core Dockerfile
# =============================================================================
#
# Multi-stage build for GTCX core foundation packages.
# Builds shared packages: types, domain, schemas, crypto, security, identity,
# verification, utils, logging, and build configurations.
#
# Principles Implemented:
#   - DEPLOYABLE (14): Same image runs everywhere
#   - SECURE (11): Minimal attack surface, non-root user
#   - PORTABLE (22): No cloud-specific dependencies
#
# Target Size: < 200MB
# =============================================================================

# Build arguments
ARG NODE_VERSION=20
ARG PNPM_VERSION=9

# -----------------------------------------------------------------------------
# Stage 1: Builder
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder

ARG PNPM_VERSION

# Install pnpm
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /build

# Copy dependency manifests first (layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.json turbo.json ./

# Copy all workspace package manifests for dependency resolution
COPY 03-platform/packages/types/package.json 03-platform/packages/types/
COPY 03-platform/packages/domain/package.json 03-platform/packages/domain/
COPY 03-platform/packages/schemas/package.json 03-platform/packages/schemas/
COPY 03-platform/packages/crypto/package.json 03-platform/packages/crypto/
COPY 03-platform/packages/crypto-native/package.json 03-platform/packages/crypto-native/
COPY 03-platform/packages/security/package.json 03-platform/packages/security/
COPY 03-platform/packages/identity/package.json 03-platform/packages/identity/
COPY 03-platform/packages/verification/package.json 03-platform/packages/verification/
COPY 03-platform/packages/workproof/package.json 03-platform/packages/workproof/
COPY 03-platform/packages/events/package.json 03-platform/packages/events/
COPY 03-platform/packages/services/package.json 03-platform/packages/services/
COPY 03-platform/packages/utils/package.json 03-platform/packages/utils/
COPY 03-platform/packages/logging/package.json 03-platform/packages/logging/
COPY 03-platform/packages/ai/package.json 03-platform/packages/ai/
COPY 03-platform/packages/api-client/package.json 03-platform/packages/api-client/
COPY 03-platform/packages/connectivity/package.json 03-platform/packages/connectivity/
COPY 03-platform/packages/network/package.json 03-platform/packages/network/
COPY 03-platform/packages/sync/package.json 03-platform/packages/sync/
COPY 03-platform/packages/config/ 03-platform/packages/config/

# Install all dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Copy full source
COPY 03-platform/packages/ 03-platform/packages/

# Build everything (turbo handles dependency ordering)
RUN pnpm build

# -----------------------------------------------------------------------------
# Stage 2: Production
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS production

ARG PNPM_VERSION

# OCI Image Labels
LABEL org.opencontainers.image.source="https://github.com/gtcx-ecosystem/gtcx-core"
LABEL org.opencontainers.image.description="GTCX Core - Shared foundation packages, cryptographic primitives, and type definitions"
LABEL org.opencontainers.image.vendor="GTCX Protocol"
LABEL org.opencontainers.image.licenses="MIT"

# Install pnpm for production use
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app

# Copy workspace configuration
COPY --from=builder /build/package.json /build/pnpm-lock.yaml /build/pnpm-workspace.yaml ./
COPY --from=builder /build/turbo.json ./

# Copy built artifacts with correct ownership
COPY --from=builder --chown=node:node /build/node_modules ./node_modules
COPY --from=builder --chown=node:node /build/packages ./packages

# Remove TypeScript source files, tests, and dev artifacts to reduce image size
RUN find /app/packages -name "*.ts" ! -name "*.d.ts" -delete 2>/dev/null; \
    find /app/packages -name "*.test.*" -delete 2>/dev/null; \
    find /app/packages -name "*.spec.*" -delete 2>/dev/null; \
    find /app/packages -type d -name "__tests__" -exec rm -rf {} + 2>/dev/null; \
    find /app/packages -type d -name "coverage" -exec rm -rf {} + 2>/dev/null; \
    rm -rf /app/node_modules/.cache 2>/dev/null; \
    true

# Environment
ENV NODE_ENV=production

# Security: Switch to non-root user
USER node

# Health check — verify core packages are loadable (library image, no HTTP server)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('@gtcx/crypto'); require('@gtcx/types'); require('@gtcx/domain'); process.exit(0);"

# Default entrypoint verifies all critical packages are loadable
CMD ["node", "-e", "\
  const pkgs = ['@gtcx/types','@gtcx/crypto','@gtcx/domain','@gtcx/schemas',\
    '@gtcx/security','@gtcx/identity','@gtcx/verification','@gtcx/events',\
    '@gtcx/services','@gtcx/utils','@gtcx/logging','@gtcx/workproof'];\
  pkgs.forEach(p => { require(p); });\
  console.log('GTCX Core container ready.', pkgs.length, 'packages verified. Node:', process.version);\
"]

# =============================================================================
# Build:
#   docker build -t gtcx/core:latest .
#
# Run:
#   docker run --rm gtcx/core:latest
# =============================================================================
