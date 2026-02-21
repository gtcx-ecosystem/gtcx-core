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

export interface ApiClientOptions {
  baseUrl: string;
  timeout?: number; // default 30000
  retries?: number; // default 3
  headers?: Record<string, string>;
  signer?: RequestSigner;
  fetcher?: typeof fetch;
  dispatcher?: Dispatcher;
  mtls?: MtlsOptions;
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

export interface IApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
  signer?: RequestSigner;
  unsigned?: boolean;
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
