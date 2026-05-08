export * from './types';
export * from './canonical';
export * from './errors';

import { request, enqueueOrThrow, type RequestRuntime } from './request';
import type {
  ApiClientOptions,
  ApiResponse,
  IApiClient,
  QueuedResponse,
  RequestOptions,
} from './types';
import { buildUrl, createMtlsDispatcher } from './utils';

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

  // Request deduplication: in-flight promises by dedupe key
  const inflight = new Map<string, Promise<unknown>>();

  const maybeOffline = async <T>(
    method: string,
    path: string,
    body: unknown,
    requestOptions: RequestOptions | undefined
  ): Promise<ApiResponse<T> | QueuedResponse> => {
    if (options.offline && !options.offline.isOnline()) {
      return enqueueOrThrow(method, path, body, requestOptions, options.offline);
    }

    const executeRequest = async (): Promise<ApiResponse<T> | QueuedResponse> => {
      const dedupeKey = requestOptions?.dedupeKey;
      if (dedupeKey && options.dedupe !== false) {
        const existing = inflight.get(dedupeKey);
        if (existing) {
          return existing as Promise<ApiResponse<T> | QueuedResponse>;
        }
        const promise = request<T>(
          method,
          buildUrl(baseUrl, path),
          body,
          requestOptions,
          options,
          runtime
        );
        inflight.set(dedupeKey, promise);
        promise
          .then(() => {
            inflight.delete(dedupeKey);
          })
          .catch(() => {
            inflight.delete(dedupeKey);
          });
        return promise;
      }

      return request<T>(method, buildUrl(baseUrl, path), body, requestOptions, options, runtime);
    };

    if (options.circuitBreaker) {
      return options.circuitBreaker.execute(executeRequest);
    }

    return executeRequest();
  };

  return {
    get: <T>(path: string, requestOptions?: RequestOptions) =>
      maybeOffline<T>('GET', path, undefined, requestOptions),
    post: <T>(path: string, body: unknown, requestOptions?: RequestOptions) =>
      maybeOffline<T>('POST', path, body, requestOptions),
    put: <T>(path: string, body: unknown, requestOptions?: RequestOptions) =>
      maybeOffline<T>('PUT', path, body, requestOptions),
    patch: <T>(path: string, body: unknown, requestOptions?: RequestOptions) =>
      maybeOffline<T>('PATCH', path, body, requestOptions),
    delete: <T>(path: string, requestOptions?: RequestOptions) =>
      maybeOffline<T>('DELETE', path, undefined, requestOptions),
  };
}
