import { calculateDelay, isRetryableError } from '@gtcx/resilience';
import { injectTraceContext } from '@gtcx/telemetry';
import type { Dispatcher } from 'undici';

import {
  ApiClientError,
  AuthError,
  HttpError,
  NetworkError,
  SigningError,
  TimeoutError,
  AbortError,
} from './errors';
import {
  applyRequestInterceptors,
  applyResponseInterceptors,
  emitTelemetry,
  getTraceContext,
} from './interceptors';
import type {
  ApiClientOptions,
  ApiResponse,
  OfflineQueueEntry,
  QueuedResponse,
  RequestOptions,
  RequestSigner,
  RequestSigningContext,
} from './types';
import {
  headersToRecord,
  mergeSignals,
  parseResponse,
  resolveBody,
  sleep,
  isRetryableStatus,
} from './utils';

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 250;
const RETRY_MAX_DELAY_MS = 2_000;

export interface RequestRuntime {
  fetcher: typeof fetch;
  signer?: RequestSigner | undefined;
  dispatcherPromise?: Promise<Dispatcher> | undefined;
}

export async function request<T>(
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

  // Apply request interceptors
  const intercepted = await applyRequestInterceptors(
    method,
    url,
    baseHeaders,
    requestBody,
    clientOptions.interceptors?.request
  );
  method = intercepted.method;
  url = intercepted.url;
  const headers = intercepted.headers;
  const interceptedBody = intercepted.body;

  // Inject traceparent if trace context is configured
  const spanContext = getTraceContext(clientOptions.traceContext);
  if (spanContext) {
    injectTraceContext(headers, spanContext);
  }

  emitTelemetry(clientOptions.telemetry, 'start', { method, url, headers });

  for (let attempt = 0; attempt <= retries; attempt++) {
    const attemptHeaders = { ...headers };
    const signer = options?.unsigned ? undefined : (options?.signer ?? runtime.signer);
    if (signer) {
      try {
        const signingContext: RequestSigningContext = {
          method,
          url,
          headers: attemptHeaders,
          body: interceptedBody,
          attempt,
        };
        const signedHeaders = await signer(signingContext);
        Object.assign(attemptHeaders, signedHeaders);
      } catch (error) {
        emitTelemetry(clientOptions.telemetry, 'error', {
          method,
          url,
          error,
          retryable: false,
          attempt,
        });
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
      const init = {
        method,
        headers: attemptHeaders,
        signal,
      } as RequestInit & { dispatcher?: Dispatcher | undefined };
      if (interceptedBody !== undefined && interceptedBody !== null) {
        (init as Record<string, unknown>)['body'] = interceptedBody;
      }
      if (dispatcher) {
        (init as Record<string, unknown>)['dispatcher'] = dispatcher;
      }

      const response = await runtime.fetcher(url, init);
      clearTimeout(timeout);

      const durationMs = Date.now() - start;
      if (response.ok) {
        const data = await parseResponse<T>(response);
        let apiResponse: ApiResponse<T> = {
          data,
          status: response.status,
          headers: headersToRecord(response.headers),
          durationMs,
        };
        apiResponse = await applyResponseInterceptors(
          apiResponse,
          method,
          url,
          clientOptions.interceptors?.response
        );
        emitTelemetry(clientOptions.telemetry, 'complete', {
          method,
          url,
          status: response.status,
          durationMs,
          attempt,
        });
        return apiResponse;
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
        emitTelemetry(clientOptions.telemetry, 'error', {
          method,
          url,
          error,
          retryable: false,
          attempt,
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
        emitTelemetry(clientOptions.telemetry, 'error', {
          method,
          url,
          error,
          retryable,
          attempt,
        });
        throw error;
      }
    } catch (error) {
      clearTimeout(timeout);

      if (error instanceof ApiClientError) {
        if (!error.retryable || attempt >= retries) {
          emitTelemetry(clientOptions.telemetry, 'error', {
            method,
            url,
            error,
            retryable: error.retryable,
            attempt,
          });
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
          emitTelemetry(clientOptions.telemetry, 'error', {
            method,
            url,
            error: classifiedError,
            retryable: classifiedError.retryable,
            attempt,
          });
          throw classifiedError;
        }

        error = classifiedError;
      }

      // Check retry policy for custom retryability
      if (clientOptions.retryPolicy && !isRetryableError(error, clientOptions.retryPolicy)) {
        emitTelemetry(clientOptions.telemetry, 'error', {
          method,
          url,
          error,
          retryable: false,
          attempt,
        });
        throw error;
      }
    }

    // Use adaptive retry delay if policy configured, otherwise fall back to fixed exponential
    let delay: number;
    if (clientOptions.retryPolicy) {
      delay = calculateDelay(attempt, clientOptions.retryPolicy);
    } else {
      delay = Math.min(RETRY_BASE_DELAY_MS * 2 ** attempt, RETRY_MAX_DELAY_MS);
    }
    await sleep(delay);
  }

  throw new ApiClientError('Request failed', {
    code: 'REQUEST_FAILED',
    category: 'unknown',
    retryable: false,
  });
}

export async function enqueueOrThrow(
  method: string,
  path: string,
  body: unknown,
  requestOptions: RequestOptions | undefined,
  offline: ApiClientOptions['offline']
): Promise<QueuedResponse> {
  if (offline) {
    const entry: OfflineQueueEntry = {
      method,
      path,
      body: body !== undefined ? body : undefined,
      options: requestOptions,
      enqueuedAt: Date.now(),
    };
    const operationId = await offline.enqueue(entry);
    return { queued: true, operationId };
  }
  throw new NetworkError('Device is offline and no offline handler is configured', {
    code: 'NETWORK_ERROR',
    category: 'network',
    retryable: true,
  });
}
