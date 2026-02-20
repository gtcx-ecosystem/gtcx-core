export * from './types';

import type {
  ApiClientOptions,
  ApiErrorCategory,
  ApiErrorCode,
  ApiResponse,
  IApiClient,
  MtlsOptions,
  RequestOptions,
  RequestSigner,
  RequestSigningContext,
} from './types';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 250;
const RETRY_MAX_DELAY_MS = 2_000;

export class ApiClientError extends Error {
  status?: number;
  code: ApiErrorCode;
  category: ApiErrorCategory;
  retryable: boolean;
  cause?: unknown;

  constructor(
    message: string,
    options: {
      status?: number;
      code: ApiErrorCode;
      category: ApiErrorCategory;
      retryable: boolean;
      cause?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.code = options.code;
    this.category = options.category;
    this.retryable = options.retryable;
    this.cause = options.cause;
  }
}

export class GTCXError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'GTCXError';
  }
}

export class HttpError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'HttpError';
  }
}

export class AuthError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'AuthError';
  }
}

export class NetworkError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'TimeoutError';
  }
}

export class AbortError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'AbortError';
  }
}

export class SigningError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'SigningError';
  }
}

export class ConfigurationError extends ApiClientError {
  constructor(message: string, options: ConstructorParameters<typeof ApiClientError>[1]) {
    super(message, options);
    this.name = 'ConfigurationError';
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

async function createMtlsDispatcher(options: MtlsOptions): Promise<unknown> {
  try {
    const undici = await import('undici');
    const Agent = undici.Agent;
    return new Agent({
      connect: {
        key: options.key,
        cert: options.cert,
        ca: options.ca,
        passphrase: options.passphrase,
        servername: options.serverName,
        rejectUnauthorized: options.rejectUnauthorized,
      },
    });
  } catch (error) {
    throw new ConfigurationError('mTLS dispatcher unavailable in this runtime', {
      code: 'CONFIG_ERROR',
      category: 'config',
      retryable: false,
      cause: error,
    });
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  const text = await response.text();
  return text as unknown as T;
}

interface RequestRuntime {
  fetcher: typeof fetch;
  signer?: RequestSigner;
  dispatcherPromise?: Promise<unknown>;
}

async function request<T>(
  method: string,
  url: string,
  body: unknown,
  options: RequestOptions | undefined,
  clientOptions: ApiClientOptions,
  runtime: RequestRuntime
): Promise<ApiResponse<T>> {
  const timeoutMs = options?.timeout ?? clientOptions.timeout ?? DEFAULT_TIMEOUT_MS;
  const retries = clientOptions.retries ?? DEFAULT_RETRIES;
  const baseHeaders: Record<string, string> = {
    ...(clientOptions.headers ?? {}),
    ...(options?.headers ?? {}),
  };
  const requestBody = resolveBody(body, baseHeaders);
  const start = Date.now();

  for (let attempt = 0; attempt <= retries; attempt++) {
    const headers = { ...baseHeaders };
    const signer = options?.unsigned ? undefined : (options?.signer ?? runtime.signer);
    if (signer) {
      try {
        const signingContext: RequestSigningContext = {
          method,
          url,
          headers,
          body,
          attempt,
        };
        const signedHeaders = await signer(signingContext);
        Object.assign(headers, signedHeaders);
      } catch (error) {
        throw new SigningError((error as Error).message || 'Request signing failed', {
          code: 'SIGNING_ERROR',
          category: 'signing',
          retryable: false,
          cause: error,
        });
      }
    }

    const controller = new AbortController();
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    const signal = options?.signal
      ? mergeSignals(options.signal, controller.signal)
      : controller.signal;

    try {
      const dispatcher = runtime.dispatcherPromise ? await runtime.dispatcherPromise : undefined;
      const init: RequestInit & { dispatcher?: unknown } = {
        method,
        headers,
        body: requestBody,
        signal,
      };
      if (dispatcher) {
        init.dispatcher = dispatcher;
      }

      const response = await runtime.fetcher(url, init);
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
      if (response.status === 401 || response.status === 403) {
        const error = new AuthError(message, {
          status: response.status,
          code: 'AUTH_ERROR',
          category: 'auth',
          retryable: false,
        });
        throw error;
      }

      const error = new HttpError(message, {
        status: response.status,
        code: 'HTTP_ERROR',
        category: 'http',
        retryable,
      });
      if (!retryable || attempt >= retries) {
        throw error;
      }
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof ApiClientError) {
        if (!error.retryable || attempt >= retries) {
          throw error;
        }
      } else {
        let classifiedError: ApiClientError;
        if (timedOut) {
          classifiedError = new TimeoutError('Request timed out', {
            code: 'TIMEOUT',
            category: 'timeout',
            retryable: true,
            cause: error,
          });
        } else if ((error as Error).name === 'AbortError') {
          classifiedError = new AbortError('Request aborted', {
            code: 'ABORTED',
            category: 'abort',
            retryable: false,
            cause: error,
          });
        } else {
          classifiedError = new NetworkError((error as Error).message || 'Network error', {
            code: 'NETWORK_ERROR',
            category: 'network',
            retryable: true,
            cause: error,
          });
        }

        if (!classifiedError.retryable || attempt >= retries) {
          throw classifiedError;
        }
      }
    }

    const delay = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
    await sleep(delay);
  }

  throw new ApiClientError('Request failed', {
    code: 'REQUEST_FAILED',
    category: 'unknown',
    retryable: false,
  });
}

export function createApiClient(options: ApiClientOptions): IApiClient {
  const baseUrl = options.baseUrl;
  const fetcher = options.fetcher ?? fetch;
  const dispatcherPromise = options.dispatcher
    ? Promise.resolve(options.dispatcher)
    : options.mtls
      ? createMtlsDispatcher(options.mtls)
      : undefined;
  const runtime: RequestRuntime = {
    fetcher,
    signer: options.signer,
    dispatcherPromise,
  };
  return {
    get: <T>(path: string, requestOptions?: RequestOptions) =>
      request<T>('GET', buildUrl(baseUrl, path), undefined, requestOptions, options, runtime),
    post: <T>(path: string, body: unknown, requestOptions?: RequestOptions) =>
      request<T>('POST', buildUrl(baseUrl, path), body, requestOptions, options, runtime),
    put: <T>(path: string, body: unknown, requestOptions?: RequestOptions) =>
      request<T>('PUT', buildUrl(baseUrl, path), body, requestOptions, options, runtime),
    delete: <T>(path: string, requestOptions?: RequestOptions) =>
      request<T>('DELETE', buildUrl(baseUrl, path), undefined, requestOptions, options, runtime),
  };
}
