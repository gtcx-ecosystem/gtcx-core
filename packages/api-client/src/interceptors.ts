import { type SpanContext } from '@gtcx/telemetry';

import type { ApiClientOptions, ApiResponse, TelemetryHooks } from './types';

export function getTraceContext(
  traceContext: ApiClientOptions['traceContext']
): SpanContext | undefined {
  if (typeof traceContext === 'function') {
    return traceContext();
  }
  return traceContext;
}

export async function applyRequestInterceptors(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: unknown,
  interceptors: NonNullable<ApiClientOptions['interceptors']>['request']
): Promise<{ method: string; url: string; headers: Record<string, string>; body: unknown }> {
  if (!interceptors || interceptors.length === 0) {
    return { method, url, headers, body };
  }
  let ctx = { method, url, headers, body };
  for (const interceptor of interceptors) {
    const result = await interceptor(ctx);
    if (result) {
      ctx = {
        method: result.method ?? ctx.method,
        url: result.url ?? ctx.url,
        headers: result.headers ?? ctx.headers,
        body: result.body ?? ctx.body,
      };
    }
  }
  return ctx;
}

export async function applyResponseInterceptors<T>(
  response: ApiResponse<T>,
  method: string,
  url: string,
  interceptors: NonNullable<ApiClientOptions['interceptors']>['response']
): Promise<ApiResponse<T>> {
  if (!interceptors || interceptors.length === 0) {
    return response;
  }
  let result = response;
  for (const interceptor of interceptors) {
    const intercepted = await interceptor({ response: result, method, url });
    if (intercepted) {
      result = intercepted;
    }
  }
  return result;
}

export function emitTelemetry(
  hooks: TelemetryHooks | undefined,
  event: 'start' | 'complete' | 'error',
  payload: unknown
): void {
  if (!hooks) return;
  try {
    if (event === 'start' && hooks.onRequestStart) {
      hooks.onRequestStart(
        payload as { method: string; url: string; headers: Record<string, string> }
      );
    } else if (event === 'complete' && hooks.onRequestComplete) {
      hooks.onRequestComplete(
        payload as {
          method: string;
          url: string;
          status: number;
          durationMs: number;
          attempt: number;
        }
      );
    } else if (event === 'error' && hooks.onRequestError) {
      hooks.onRequestError(
        payload as {
          method: string;
          url: string;
          error: unknown;
          retryable: boolean;
          attempt: number;
        }
      );
    }
  } catch {
    // Telemetry hooks must never break the request
  }
}
