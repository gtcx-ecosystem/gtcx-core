import { Buffer } from 'node:buffer';

import type { Dispatcher } from 'undici';

import { ConfigurationError, HttpError } from './errors';
import type { MtlsOptions } from './types';

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

export function buildUrl(baseUrl: string, path: string): string {
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

export function headersToRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

export function mergeSignals(primary: AbortSignal, secondary: AbortSignal): AbortSignal {
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

export type RequestBody = RequestInit['body'];

export function resolveBody(
  body: unknown,
  headers: Record<string, string>
): RequestBody | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }
  if (typeof body === 'string' || body instanceof ArrayBuffer || body instanceof Uint8Array) {
    return body as RequestBody;
  }
  if (typeof FormData !== 'undefined' && body instanceof FormData) {
    return body as RequestBody;
  }
  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    return body as RequestBody;
  }
  if (!headers['content-type'] && !headers['Content-Type']) {
    headers['content-type'] = 'application/json';
  }
  return JSON.stringify(body) as RequestBody;
}

function normalizeMtlsValue(value?: string | Uint8Array): string | Buffer | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value;
  }
  return Buffer.from(value);
}

export async function createMtlsDispatcher(options: MtlsOptions): Promise<Dispatcher> {
  try {
    const undici = await import('undici');
    const Agent = undici.Agent;
    const key = normalizeMtlsValue(options.key);
    const cert = normalizeMtlsValue(options.cert);
    const ca = normalizeMtlsValue(options.ca);
    return new Agent({
      connect: {
        key,
        cert,
        ca,
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

export async function parseResponse<T>(response: Response): Promise<T> {
  const contentLength = response.headers.get('content-length');
  if (contentLength && Number(contentLength) > 10_000_000) {
    throw new HttpError('Response body exceeds maximum size (10MB)', {
      status: response.status,
      code: 'HTTP_ERROR',
      category: 'http',
      retryable: false,
    });
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  const text = await response.text();
  return text as unknown as T;
}
