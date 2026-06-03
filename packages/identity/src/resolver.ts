import { z } from 'zod';

import { isValidDID } from './did';
import type { DIDDocument } from './did';

/**
 * Zod schema for validating DID documents received from external resolvers.
 * Covers required W3C DID Core fields without being overly strict on extensions.
 */
const DIDDocumentSchema = z.object({
  '@context': z.array(z.string()).min(1),
  id: z.string().min(1),
  controller: z.string().optional(),
  verificationMethod: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        controller: z.string(),
        publicKeyMultibase: z.string().optional(),
        publicKeyHex: z.string().optional(),
      })
    )
    .min(1),
  authentication: z.array(z.string()).min(1),
  assertionMethod: z.array(z.string()).optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export type DIDRevocationStatus = 'active' | 'revoked' | 'unknown';

export interface DIDResolutionMetadata {
  resolver: string;
  cache: 'hit' | 'miss' | 'bypass';
  durationMs: number;
  revocationStatus?: DIDRevocationStatus | undefined;
}

export interface DIDResolverMetricsEvent extends DIDResolutionMetadata {
  did: string;
  errorCode?: DIDResolverErrorCode;
}

export interface DIDResolutionResult {
  document: DIDDocument | null;
  metadata: DIDResolutionMetadata;
}

export interface DIDResolverOptions {
  timeoutMs?: number | undefined;
  signal?: AbortSignal | undefined;
}

export interface DIDResolverAdapter {
  name: string;
  resolve(did: string, options?: DIDResolverOptions): Promise<DIDDocument | null>;
}

export interface DIDResolverCacheEntry {
  document: DIDDocument | null;
  expiresAt: number;
}

export interface DIDResolverCache {
  get(did: string): Promise<DIDResolverCacheEntry | null> | DIDResolverCacheEntry | null;
  set(did: string, entry: DIDResolverCacheEntry): Promise<void> | void;
  delete(did: string): Promise<void> | void;
}

export type DIDRevocationChecker = (
  did: string,
  document: DIDDocument
) => Promise<DIDRevocationStatus>;

export interface DIDResolverConfig {
  adapters: DIDResolverAdapter[];
  cache?: DIDResolverCache;
  cacheTtlMs?: number;
  cacheNullResults?: boolean;
  revocationChecker?: DIDRevocationChecker;
  timeoutMs?: number;
  metrics?: (event: DIDResolverMetricsEvent) => void;
}

export type DIDResolverErrorCode = 'INVALID_DID' | 'RESOLUTION_FAILED' | 'REVOKED' | 'TIMEOUT';

export class DIDResolverError extends Error {
  code: DIDResolverErrorCode;
  status?: number | undefined;
  retryable?: boolean | undefined;
  override cause?: unknown;

  constructor(
    message: string,
    code: DIDResolverErrorCode,
    options?: { status?: number; retryable?: boolean; cause?: unknown }
  ) {
    super(message);
    this.name = 'DIDResolverError';
    this.code = code;
    this.status = options?.status;
    this.retryable = options?.retryable;
    this.cause = options?.cause;
  }
}

export interface DIDResolver {
  resolve(did: string, options?: DIDResolverOptions): Promise<DIDResolutionResult>;
}

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_CACHE_TTL_MS = 5 * 60_000;

function mergeSignals(primary: AbortSignal, secondary: AbortSignal): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function') {
    return AbortSignal.any([primary, secondary]);
  }
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (primary.aborted || secondary.aborted) {
    controller.abort();
  } else {
    primary.addEventListener('abort', onAbort, { once: true });
    secondary.addEventListener('abort', onAbort, { once: true });
  }
  return controller.signal;
}

export function createInMemoryDIDCache(): DIDResolverCache {
  const store = new Map<string, DIDResolverCacheEntry>();
  return {
    get: (did) => store.get(did) ?? null,
    set: (did, entry) => {
      store.set(did, entry);
    },
    delete: (did) => {
      store.delete(did);
    },
  };
}

export function createStaticDIDResolverAdapter(
  records: Record<string, DIDDocument>,
  name = 'static'
): DIDResolverAdapter {
  return {
    name,
    resolve: async (did) => records[did] ?? null,
  };
}

export interface HttpDIDResolverConfig {
  baseUrl: string;
  name?: string;
  headers?: Record<string, string>;
  retries?: number;
  timeoutMs?: number;
  pathTemplate?: string; // default: /dids/{did}
}

async function fetchWithRetry(
  url: string,
  options: {
    headers?: Record<string, string> | undefined;
    timeoutMs?: number | undefined;
    signal?: AbortSignal | undefined;
    retries?: number | undefined;
  }
): Promise<Response> {
  const retries = options.retries ?? 2;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const signal = options.signal
      ? mergeSignals(options.signal, controller.signal)
      : controller.signal;
    try {
      const response = await fetch(url, {
        ...(options.headers !== undefined ? { headers: options.headers } : {}),
        signal,
      });
      clearTimeout(timeout);
      if (response.ok || response.status === 404) {
        return response;
      }
      if (response.status >= 500 && attempt < retries) {
        continue;
      }
      throw new DIDResolverError(`HTTP ${response.status}`, 'RESOLUTION_FAILED', {
        status: response.status,
      });
    } catch (error) {
      clearTimeout(timeout);
      if (attempt >= retries) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new DIDResolverError('Resolver timeout', 'TIMEOUT', { cause: error });
        }
        throw new DIDResolverError('Resolver request failed', 'RESOLUTION_FAILED', {
          cause: error,
        });
      }
    }
  }

  throw new DIDResolverError('Resolver request failed', 'RESOLUTION_FAILED');
}

export function createHttpDIDResolverAdapter(config: HttpDIDResolverConfig): DIDResolverAdapter {
  const pathTemplate = config.pathTemplate ?? '/dids/{did}';
  const name = config.name ?? 'http';

  return {
    name,
    resolve: async (did, options) => {
      const encodedDid = encodeURIComponent(did);
      const path = pathTemplate.replace('{did}', encodedDid);
      const url =
        config.baseUrl.endsWith('/') || path.startsWith('/')
          ? `${config.baseUrl}${path}`
          : `${config.baseUrl}/${path}`;

      const response = await fetchWithRetry(url, {
        headers: config.headers,
        retries: config.retries,
        timeoutMs: options?.timeoutMs ?? config.timeoutMs,
        signal: options?.signal,
      });

      if (response.status === 404) {
        return null;
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new DIDResolverError('Unexpected content type from resolver', 'RESOLUTION_FAILED');
      }

      const rawDoc = await response.json();
      const parsed = DIDDocumentSchema.safeParse(rawDoc);
      if (!parsed.success) {
        throw new DIDResolverError(
          `Invalid DID document structure: ${parsed.error.issues.map((e: { message: string }) => e.message).join(', ')}`,
          'RESOLUTION_FAILED'
        );
      }
      return parsed.data as DIDDocument;
    },
  };
}

export function createDIDResolver(config: DIDResolverConfig): DIDResolver {
  const cacheTtlMs = config.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
  const cacheNullResults = config.cacheNullResults ?? false;

  return {
    resolve: async (did, options) => {
      if (!isValidDID(did)) {
        throw new DIDResolverError('Invalid DID', 'INVALID_DID');
      }

      const started = Date.now();
      if (config.cache) {
        const cached = await config.cache.get(did);
        if (cached && cached.expiresAt > Date.now()) {
          return {
            document: cached.document,
            metadata: {
              resolver: 'cache',
              cache: 'hit',
              durationMs: Date.now() - started,
            },
          };
        }
        if (cached) {
          await config.cache.delete(did);
        }
      }

      let lastError: unknown;
      for (const adapter of config.adapters) {
        try {
          const document = await adapter.resolve(did, {
            timeoutMs: options?.timeoutMs ?? config.timeoutMs,
            signal: options?.signal,
          });
          if (!document) {
            continue;
          }

          let revocationStatus: DIDRevocationStatus | undefined;
          if (config.revocationChecker) {
            revocationStatus = await config.revocationChecker(did, document);
            if (revocationStatus === 'revoked') {
              throw new DIDResolverError('DID revoked', 'REVOKED');
            }
          }

          if (config.cache && cacheTtlMs > 0 && (cacheNullResults || document)) {
            await config.cache.set(did, {
              document,
              expiresAt: Date.now() + cacheTtlMs,
            });
          }

          return {
            document,
            metadata: {
              resolver: adapter.name,
              cache: 'miss',
              durationMs: Date.now() - started,
              revocationStatus,
            },
          };
        } catch (error) {
          lastError = error;
          const resolvedError =
            error instanceof DIDResolverError
              ? error
              : new DIDResolverError('Resolution failed', 'RESOLUTION_FAILED', { cause: error });
          config.metrics?.({
            did,
            resolver: adapter.name,
            cache: config.cache ? 'miss' : 'bypass',
            durationMs: Date.now() - started,
            errorCode: resolvedError.code,
          });
        }
      }

      if (lastError instanceof DIDResolverError) {
        config.metrics?.({
          did,
          resolver: 'none',
          cache: config.cache ? 'miss' : 'bypass',
          durationMs: Date.now() - started,
          errorCode: lastError.code,
        });
        throw lastError;
      }
      if (lastError) {
        config.metrics?.({
          did,
          resolver: 'none',
          cache: config.cache ? 'miss' : 'bypass',
          durationMs: Date.now() - started,
          errorCode: 'RESOLUTION_FAILED',
        });
        throw new DIDResolverError('Resolution failed', 'RESOLUTION_FAILED', { cause: lastError });
      }

      const result: DIDResolutionResult = {
        document: null,
        metadata: {
          resolver: 'none',
          cache: config.cache ? 'miss' : 'bypass',
          durationMs: Date.now() - started,
        },
      };
      config.metrics?.({ did, ...result.metadata });
      return result;
    },
  };
}
