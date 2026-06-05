import { createCircuitBreaker } from '@gtcx/resilience';
import { describe, it, expect, vi } from 'vitest';

import { createApiClient, ApiClientError } from '../src/index';

describe('enhanced api-client', () => {
  function mockFetcher(response: Response): typeof fetch {
    return vi.fn(() => Promise.resolve(response)) as unknown as typeof fetch;
  }

  function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }

  it('supports PATCH method', async () => {
    const fetcher = mockFetcher(jsonResponse({ ok: true }));
    const client = createApiClient({ baseUrl: 'https://api.test', fetcher });
    const result = await client.patch('/items/1', { name: 'updated' });
    if ('queued' in result) throw new Error('unexpected queue');
    expect(result.data).toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledWith(
      'https://api.test/items/1',
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('applies request interceptors', async () => {
    const fetcher = mockFetcher(jsonResponse({ ok: true }));
    const client = createApiClient({
      baseUrl: 'https://api.test',
      fetcher,
      interceptors: {
        request: [
          async (ctx) => ({
            ...ctx,
            headers: { ...ctx.headers, 'x-custom': '1' },
          }),
        ],
      },
    });
    await client.get('/test');
    const [, init] = (fetcher as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers).toMatchObject({ 'x-custom': '1' });
  });

  it('applies response interceptors', async () => {
    const fetcher = mockFetcher(jsonResponse({ value: 1 }));
    const client = createApiClient({
      baseUrl: 'https://api.test',
      fetcher,
      interceptors: {
        response: [
          async (ctx) => ({
            ...ctx.response,
            data: { ...ctx.response.data, intercepted: true },
          }),
        ],
      },
    });
    const result = await client.get('/test');
    if ('queued' in result) throw new Error('unexpected queue');
    expect(result.data).toEqual({ value: 1, intercepted: true });
  });

  it('deduplicates in-flight requests by dedupeKey', async () => {
    let calls = 0;
    const fetcher = vi.fn(async () => {
      calls++;
      await new Promise((r) => setTimeout(r, 50));
      return jsonResponse({ calls });
    }) as unknown as typeof fetch;

    const client = createApiClient({ baseUrl: 'https://api.test', fetcher, dedupe: true });

    const [r1, r2] = await Promise.all([
      client.get('/test', { dedupeKey: 'same' }),
      client.get('/test', { dedupeKey: 'same' }),
    ]);

    if ('queued' in r1 || 'queued' in r2) throw new Error('unexpected queue');
    expect(calls).toBe(1);
    expect(r1.data).toEqual(r2.data);
  });

  it('uses adaptive retry policy when configured', async () => {
    let calls = 0;
    const fetcher = vi.fn(async () => {
      calls++;
      if (calls < 2) {
        return new Response('error', { status: 503 });
      }
      return jsonResponse({ ok: true });
    }) as unknown as typeof fetch;

    const client = createApiClient({
      baseUrl: 'https://api.test',
      fetcher,
      retries: 2,
      retryPolicy: { strategy: 'fixed', baseDelayMs: 10, jitter: 'none' },
    });

    const result = await client.get('/test');
    if ('queued' in result) throw new Error('unexpected queue');
    expect(result.data).toEqual({ ok: true });
    expect(calls).toBe(2);
  });

  it('integrates with circuit breaker', async () => {
    const cb = createCircuitBreaker({ failureThreshold: 1 });
    const fetcher = mockFetcher(new Response('error', { status: 500 }));

    const client = createApiClient({
      baseUrl: 'https://api.test',
      fetcher,
      circuitBreaker: cb,
      retries: 0,
    });

    await expect(client.get('/test')).rejects.toBeInstanceOf(ApiClientError);
    expect(cb.state).toBe('open');
    await expect(client.get('/test')).rejects.toThrow('OPEN');
  });

  it('injects traceparent header when traceContext is provided', async () => {
    const fetcher = mockFetcher(jsonResponse({ ok: true }));
    const client = createApiClient({
      baseUrl: 'https://api.test',
      fetcher,
      traceContext: {
        traceId: 'a'.repeat(32),
        spanId: 'b'.repeat(16),
        sampled: true,
      },
    });

    await client.get('/test');
    const [, init] = (fetcher as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers.traceparent).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
  });

  it('calls telemetry hooks', async () => {
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    const fetcher = mockFetcher(jsonResponse({ ok: true }));
    const client = createApiClient({
      baseUrl: 'https://api.test',
      fetcher,
      telemetry: {
        onRequestStart: onStart,
        onRequestComplete: onComplete,
        onRequestError: onError,
      },
    });

    await client.get('/test');
    expect(onStart).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', url: expect.stringContaining('/test') })
    );
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', status: 200, attempt: 0 })
    );
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls telemetry error hook on failure', async () => {
    const onError = vi.fn();
    const fetcher = mockFetcher(new Response('error', { status: 500 }));

    const client = createApiClient({
      baseUrl: 'https://api.test',
      fetcher,
      retries: 0,
      telemetry: { onRequestError: onError },
    });

    await expect(client.get('/test')).rejects.toBeInstanceOf(ApiClientError);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', retryable: true })
    );
  });

  it('remains backward compatible with old options', async () => {
    const fetcher = mockFetcher(jsonResponse({ ok: true }));
    const client = createApiClient({
      baseUrl: 'https://api.test',
      fetcher,
      timeout: 5000,
      retries: 2,
      headers: { 'x-api-key': 'secret' },
    });

    const result = await client.get('/test');
    if ('queued' in result) throw new Error('unexpected queue');
    expect(result.data).toEqual({ ok: true });
    const [, init] = (fetcher as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers['x-api-key']).toBe('secret');
  });
});
