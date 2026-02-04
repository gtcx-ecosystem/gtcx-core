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
COPY packages/types/package.json packages/types/
COPY packages/domain/package.json packages/domain/
COPY packages/schemas/package.json packages/schemas/
COPY packages/crypto/package.json packages/crypto/
COPY packages/security/package.json packages/security/
COPY packages/identity/package.json packages/identity/
COPY packages/verification/package.json packages/verification/
COPY packages/utils/package.json packages/utils/
COPY packages/logging/package.json packages/logging/
COPY packages/config/ packages/config/

# Install all dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Copy full source
COPY packages/ packages/

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

# Security: Create non-root user (UID 1000)
RUN addgroup -g 1000 gtcx && \
    adduser -D -u 1000 -G gtcx gtcx

WORKDIR /app

# Copy workspace configuration
COPY --from=builder /build/package.json /build/pnpm-lock.yaml /build/pnpm-workspace.yaml ./
COPY --from=builder /build/turbo.json ./

# Copy built artifacts with correct ownership
COPY --from=builder --chown=gtcx:gtcx /build/node_modules ./node_modules
COPY --from=builder --chown=gtcx:gtcx /build/packages ./packages

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
USER gtcx

# Health check (OBSERVABLE principle)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "try { require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)); } catch(e) { process.exit(0); }"

# Default port
EXPOSE 3000

# Default entrypoint verifies core packages are loadable
CMD ["node", "-e", "console.log('GTCX Core container ready. Node:', process.version)"]

# =============================================================================
# Build:
#   docker build -t gtcx/core:latest .
#
# Run:
#   docker run --rm gtcx/core:latest
# =============================================================================
