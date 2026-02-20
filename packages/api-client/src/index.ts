export * from './types';

import type { ApiClientOptions, ApiResponse, IApiClient, RequestOptions } from './types';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 250;
const RETRY_MAX_DELAY_MS = 2_000;

class ApiClientError extends Error {
  status?: number;
  code?: string;
  retryable: boolean;

  constructor(message: string, options: { status?: number; code?: string; retryable: boolean }) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.code = options.code;
    this.retryable = options.retryable;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function buildUrl(baseUrl: string, path: string): string {
  if (!path) {
    return baseUrl;
  }
  if (baseUrl.endsWith('/') && path.startsWith('/')) {
    return `${baseUrl}${path.slice(1)}`;
  }
  if (!baseUrl.endsWith('/') && !path.startsWith('/')) {
    return `${baseUrl}/${path}`;
  }
  return `${baseUrl}${path}`;
}

function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

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

function resolveBody(body: unknown, headers: Record<string, string>): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }
  if (typeof body === 'string' || body instanceof ArrayBuffer || body instanceof Uint8Array) {
    return body as BodyInit;
  }
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return body;
  }
  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return body;
  }
  if (!headers['content-type'] && !headers['Content-Type']) {
    headers['content-type'] = 'application/json';
  }
  return JSON.stringify(body);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  const text = await response.text();
  return text as unknown as T;
}

async function request<T>(
  method: string,
  url: string,
  body: unknown,
  options: RequestOptions | undefined,
  clientOptions: ApiClientOptions
): Promise<ApiResponse<T>> {
  const timeoutMs = options?.timeout ?? clientOptions.timeout ?? DEFAULT_TIMEOUT_MS;
  const retries = clientOptions.retries ?? DEFAULT_RETRIES;
  const headers: Record<string, string> = {
    ...(clientOptions.headers ?? {}),
    ...(options?.headers ?? {}),
  };
  const requestBody = resolveBody(body, headers);

  const start = Date.now();

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const signal = options?.signal
      ? mergeSignals(options.signal, controller.signal)
      : controller.signal;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        signal,
      });
      clearTimeout(timeout);

      const durationMs = Date.now() - start;
      if (response.ok) {
        const data = await parseResponse<T>(response);
        return {
          data,
          status: response.status,
          headers: headersToRecord(response.headers),
          durationMs,
        };
      }

      const retryable = isRetryableStatus(response.status);
      const message = response.statusText || `HTTP ${response.status}`;
      if (!retryable || attempt >= retries) {
        throw new ApiClientError(message, {
          status: response.status,
          code: 'HTTP_ERROR',
          retryable,
        });
      }
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof ApiClientError) {
        throw error;
      }

      const retryable = true;
      if (attempt >= retries) {
        throw new ApiClientError((error as Error).message || 'Request failed', {
          code: 'NETWORK_ERROR',
          retryable,
        });
      }
    }

    const delay = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
    await sleep(delay);
  }

  throw new ApiClientError('Request failed', { code: 'REQUEST_FAILED', retryable: false });
}

export function createApiClient(options: ApiClientOptions): IApiClient {
  const baseUrl = options.baseUrl;
  return {
    get: <T>(path: string, requestOptions?: RequestOptions) =>
      request<T>('GET', buildUrl(baseUrl, path), undefined, requestOptions, options),
    post: <T>(path: string, body: unknown, requestOptions?: RequestOptions) =>
      request<T>('POST', buildUrl(baseUrl, path), body, requestOptions, options),
    put: <T>(path: string, body: unknown, requestOptions?: RequestOptions) =>
      request<T>('PUT', buildUrl(baseUrl, path), body, requestOptions, options),
    delete: <T>(path: string, requestOptions?: RequestOptions) =>
      request<T>('DELETE', buildUrl(baseUrl, path), undefined, requestOptions, options),
  };
}
