import type { CircuitBreaker, RetryPolicy } from '@gtcx/resilience';
import type { SpanContext } from '@gtcx/telemetry';
import type { Dispatcher } from 'undici';

export type ApiErrorCategory =
  | 'http'
  | 'network'
  | 'timeout'
  | 'abort'
  | 'auth'
  | 'signing'
  | 'config'
  | 'unknown';

export type ApiErrorCode =
  | 'HTTP_ERROR'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'ABORTED'
  | 'AUTH_ERROR'
  | 'SIGNING_ERROR'
  | 'CONFIG_ERROR'
  | 'REQUEST_FAILED';

export interface OfflineQueueEntry {
  method: string;
  path: string;
  body?: unknown | undefined;
  options?: RequestOptions | undefined;
  enqueuedAt: number;
}

export interface OfflineHandler {
  isOnline(): boolean;
  enqueue(entry: OfflineQueueEntry): Promise<string>;
}

export interface RequestInterceptor {
  (context: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: unknown;
  }):
    | Promise<{ method?: string; url?: string; headers?: Record<string, string>; body?: unknown }>
    | { method?: string; url?: string; headers?: Record<string, string>; body?: unknown };
}

export interface ResponseInterceptor {
  <T>(context: {
    response: ApiResponse<T>;
    method: string;
    url: string;
  }): Promise<ApiResponse<T> | void> | ApiResponse<T> | void;
}

export interface TelemetryHooks {
  onRequestStart?(context: { method: string; url: string; headers: Record<string, string> }): void;
  onRequestComplete?(context: {
    method: string;
    url: string;
    status: number;
    durationMs: number;
    attempt: number;
  }): void;
  onRequestError?(context: {
    method: string;
    url: string;
    error: unknown;
    retryable: boolean;
    attempt: number;
  }): void;
}

export interface ApiClientOptions {
  baseUrl: string;
  timeout?: number; // default 30000
  retries?: number; // default 3
  headers?: Record<string, string>;
  signer?: RequestSigner;
  fetcher?: typeof fetch;
  dispatcher?: Dispatcher;
  mtls?: MtlsOptions;
  offline?: OfflineHandler;
  /** Request/response interceptors for cross-cutting concerns */
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
  };
  /** Circuit breaker for preventing cascade failures */
  circuitBreaker?: CircuitBreaker;
  /** Adaptive retry policy (replaces fixed exponential backoff) */
  retryPolicy?: RetryPolicy;
  /** Deduplicate in-flight requests with the same key */
  dedupe?: boolean;
  /** Telemetry hooks for metrics/tracing integration */
  telemetry?: TelemetryHooks;
  /** Inject W3C traceparent header automatically */
  traceContext?: SpanContext | (() => SpanContext | undefined);
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  durationMs: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: ApiErrorCode;
  category: ApiErrorCategory;
  retryable: boolean;
  cause?: unknown;
}

export interface QueuedResponse {
  queued: true;
  operationId: string;
}

export interface IApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T> | QueuedResponse>;
  post<T>(
    path: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T> | QueuedResponse>;
  put<T>(
    path: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T> | QueuedResponse>;
  patch<T>(
    path: string,
    body: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T> | QueuedResponse>;
  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T> | QueuedResponse>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
  signer?: RequestSigner;
  unsigned?: boolean;
  /** Key for request deduplication — in-flight requests with the same key share the same promise */
  dedupeKey?: string;
}

export interface RequestSigningContext {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  attempt: number;
}

export type RequestSigner = (
  context: RequestSigningContext
) => Promise<Record<string, string>> | Record<string, string>;

export interface MtlsOptions {
  key: string | Uint8Array;
  cert: string | Uint8Array;
  ca?: string | Uint8Array;
  passphrase?: string;
  serverName?: string;
  rejectUnauthorized?: boolean;
}
