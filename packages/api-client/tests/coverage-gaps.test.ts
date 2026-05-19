import type { Dispatcher } from 'undici';
import { describe, it, expect, vi } from 'vitest';

import {
  ApiClientError,
  GTCXError,
  HttpError,
  NetworkError,
  AbortError,
  SigningError,
  ConfigurationError,
  createApiClient,
} from '../src/index';
import { enqueueOrThrow } from '../src/request';
import { buildUrl, mergeSignals, resolveBody, parseResponse, sleep } from '../src/utils';

describe('api-client coverage gaps', () => {
  describe('error subclasses', () => {
    const baseOpts = {
      code: 'TEST' as const,
      category: 'http' as const,
      retryable: false,
    };

    it('constructs GTCXError', () => {
      const err = new GTCXError('msg', baseOpts);
      expect(err.name).toBe('GTCXError');
      expect(err.message).toBe('msg');
    });

    it('constructs HttpError', () => {
      const err = new HttpError('msg', baseOpts);
      expect(err.name).toBe('HttpError');
    });

    it('constructs NetworkError', () => {
      const err = new NetworkError('msg', baseOpts);
      expect(err.name).toBe('NetworkError');
    });

    it('constructs AbortError', () => {
      const err = new AbortError('msg', baseOpts);
      expect(err.name).toBe('AbortError');
    });

    it('constructs SigningError', () => {
      const err = new SigningError('msg', baseOpts);
      expect(err.name).toBe('SigningError');
    });

    it('constructs ConfigurationError', () => {
      const err = new ConfigurationError('msg', baseOpts);
      expect(err.name).toBe('ConfigurationError');
    });

    it('preserves optional status and cause on ApiClientError', () => {
      const cause = new Error('root');
      const err = new ApiClientError('msg', {
        ...baseOpts,
        status: 418,
        cause,
      });
      expect(err.status).toBe(418);
      expect(err.cause).toBe(cause);
    });
  });

  describe('buildUrl', () => {
    it('returns baseUrl when path is empty', () => {
      expect(buildUrl('https://api.test', '')).toBe('https://api.test');
    });

    it('merges slashes when both have them', () => {
      expect(buildUrl('https://api.test/', '/path')).toBe('https://api.test/path');
    });

    it('adds slash when neither has it', () => {
      expect(buildUrl('https://api.test', 'path')).toBe('https://api.test/path');
    });

    it('concatenates when only one has slash', () => {
      expect(buildUrl('https://api.test/', 'path')).toBe('https://api.test/path');
      expect(buildUrl('https://api.test', '/path')).toBe('https://api.test/path');
    });
  });

  describe('mergeSignals', () => {
    it('uses AbortSignal.any when available', () => {
      if (typeof AbortSignal !== 'undefined' && 'any' in AbortSignal) {
        const s1 = new AbortController().signal;
        const s2 = new AbortController().signal;
        const merged = mergeSignals(s1, s2);
        expect(merged).toBeDefined();
      }
    });

    it('returns immediately aborted signal if either is aborted', () => {
      const c1 = new AbortController();
      c1.abort();
      const c2 = new AbortController();
      const merged = mergeSignals(c1.signal, c2.signal);
      expect(merged.aborted).toBe(true);
    });

    it('aborts when primary fires', () => {
      const c1 = new AbortController();
      const c2 = new AbortController();
      const merged = mergeSignals(c1.signal, c2.signal);
      expect(merged.aborted).toBe(false);
      c1.abort();
      expect(merged.aborted).toBe(true);
    });

    it('aborts when secondary fires', () => {
      const c1 = new AbortController();
      const c2 = new AbortController();
      const merged = mergeSignals(c1.signal, c2.signal);
      c2.abort();
      expect(merged.aborted).toBe(true);
    });

    it('falls back to manual signal merging when AbortSignal.any is unavailable', () => {
      const originalAny = (AbortSignal as unknown as { any?: unknown }).any;
      // @ts-expect-error removing native helper to test fallback
      delete (AbortSignal as unknown as { any?: unknown }).any;
      try {
        const c1 = new AbortController();
        const c2 = new AbortController();
        const merged = mergeSignals(c1.signal, c2.signal);
        expect(merged.aborted).toBe(false);
        c1.abort();
        expect(merged.aborted).toBe(true);
      } finally {
        // @ts-expect-error restoring native helper
        (AbortSignal as unknown as { any?: unknown }).any = originalAny;
      }
    });
  });

  describe('resolveBody', () => {
    it('returns undefined for null and undefined', () => {
      const h: Record<string, string> = {};
      expect(resolveBody(undefined, h)).toBeUndefined();
      expect(resolveBody(null, h)).toBeUndefined();
    });

    it('passes through strings', () => {
      expect(resolveBody('text', {})).toBe('text');
    });

    it('passes through ArrayBuffer', () => {
      const buf = new ArrayBuffer(4);
      expect(resolveBody(buf, {})).toBe(buf);
    });

    it('passes through Uint8Array', () => {
      const arr = new Uint8Array(4);
      expect(resolveBody(arr, {})).toBe(arr);
    });

    it('passes through FormData', () => {
      if (typeof FormData !== 'undefined') {
        const fd = new FormData();
        expect(resolveBody(fd, {})).toBe(fd);
      }
    });

    it('passes through Blob', () => {
      if (typeof Blob !== 'undefined') {
        const blob = new Blob(['x']);
        expect(resolveBody(blob, {})).toBe(blob);
      }
    });

    it('sets content-type and stringifies JSON when missing', () => {
      const h: Record<string, string> = {};
      expect(resolveBody({ a: 1 }, h)).toBe('{"a":1}');
      expect(h['content-type']).toBe('application/json');
    });

    it('does not overwrite existing content-type', () => {
      const h: Record<string, string> = { 'content-type': 'text/plain' };
      expect(resolveBody({ a: 1 }, h)).toBe('{"a":1}');
      expect(h['content-type']).toBe('text/plain');
    });

    it('does not overwrite existing Content-Type', () => {
      const h: Record<string, string> = { 'Content-Type': 'text/plain' };
      expect(resolveBody({ a: 1 }, h)).toBe('{"a":1}');
      expect(h['Content-Type']).toBe('text/plain');
    });
  });

  describe('createMtlsDispatcher', () => {
    it('throws ConfigurationError when undici is unavailable', async () => {
      vi.resetModules();
      vi.doMock('undici', () => {
        throw new Error('not found');
      });
      const { createMtlsDispatcher: cmt } = await import('../src/utils');
      await expect(cmt({ cert: 'c', key: 'k' })).rejects.toThrow(/mTLS dispatcher unavailable/);
      vi.doUnmock('undici');
    });
  });

  describe('parseResponse', () => {
    it('throws on oversized response', async () => {
      const res = new Response('x', {
        status: 200,
        headers: { 'content-length': '20000000' },
      });
      await expect(parseResponse(res)).rejects.toThrow(/exceeds maximum size/);
    });

    it('returns text for non-JSON responses', async () => {
      const res = new Response('plain text', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      });
      const result = await parseResponse(res);
      expect(result).toBe('plain text');
    });

    it('returns text when content-type header is missing', async () => {
      const res = new Response('no type');
      const result = await parseResponse(res);
      expect(result).toBe('no type');
    });
  });

  describe('sleep', () => {
    it('resolves after delay', async () => {
      const start = Date.now();
      await sleep(10);
      expect(Date.now() - start).toBeGreaterThanOrEqual(5);
    });
  });

  describe('enqueueOrThrow', () => {
    it('returns queued response when offline handler is configured', async () => {
      const offline = {
        enqueue: vi.fn().mockResolvedValue('op-123'),
      };
      const result = await enqueueOrThrow('POST', '/items', { x: 1 }, undefined, offline);
      expect(result).toEqual({ queued: true, operationId: 'op-123' });
      expect(offline.enqueue).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'POST', path: '/items', body: { x: 1 } })
      );
    });

    it('throws NetworkError when offline handler is missing', async () => {
      await expect(
        enqueueOrThrow('GET', '/items', undefined, undefined, undefined)
      ).rejects.toBeInstanceOf(NetworkError);
    });
  });

  describe('retryPolicy integration', () => {
    it('does not retry when retryPolicy says non-retryable', async () => {
      const fetcher = vi
        .fn()
        .mockRejectedValueOnce(new Error('boom'))
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        );

      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        retries: 2,
        retryPolicy: {
          maxRetries: 2,
          baseDelayMs: 10,
          maxDelayMs: 50,
          retryable: () => false,
        },
      });

      await expect(client.get('/test')).rejects.toThrow('boom');
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });

  describe('request with dispatcher', () => {
    it('uses dispatcher when provided via mtls', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );

      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        mtls: { cert: 'cert', key: 'key' },
      });

      const result = await client.get('/test');
      expect(result.data).toEqual({ ok: true });
    });

    it('uses explicit dispatcher when provided', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const dispatcher = { connect: vi.fn() } as unknown as Dispatcher;
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        dispatcher,
      });
      const result = await client.get('/test');
      expect(result.data).toEqual({ ok: true });
    });
  });

  describe('offline handling', () => {
    it('enqueues request when offline.isOnline returns false', async () => {
      const fetcher = vi.fn();
      const offline = {
        isOnline: vi.fn().mockReturnValue(false),
        enqueue: vi.fn().mockResolvedValue('op-456'),
      };
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        offline,
      });
      const result = await client.get('/test');
      expect(result).toEqual({ queued: true, operationId: 'op-456' });
      expect(offline.isOnline).toHaveBeenCalled();
      expect(fetcher).not.toHaveBeenCalled();
    });

    it('executes request normally when offline.isOnline returns true', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const offline = {
        isOnline: vi.fn().mockReturnValue(true),
        enqueue: vi.fn(),
      };
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        offline,
      });
      const result = await client.get('/test');
      expect(result.data).toEqual({ ok: true });
      expect(offline.enqueue).not.toHaveBeenCalled();
    });
  });

  describe('traceContext as function', () => {
    it('resolves traceContext when it is a function', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const traceContext = vi.fn().mockReturnValue({
        traceId: 'a'.repeat(32),
        spanId: 'b'.repeat(16),
        sampled: true,
      });
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        traceContext,
      });
      await client.get('/test');
      expect(traceContext).toHaveBeenCalled();
    });
  });

  describe('request interceptors', () => {
    it('applies partial request interceptor results with fallbacks', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        interceptors: {
          request: [async (_ctx) => ({ headers: { 'x-partial': '1' } })],
        },
      });
      await client.post('/test', { body: 'data' });
      const [url, init] = (fetcher as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe('https://api.test/test');
      expect(init.method).toBe('POST');
      expect(init.headers).toMatchObject({ 'x-partial': '1' });
    });

    it('returns original context when request interceptors array is empty', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        interceptors: { request: [] },
      });
      await client.get('/test');
      expect(fetcher).toHaveBeenCalledWith(
        'https://api.test/test',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('returns original response when response interceptors array is empty', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        interceptors: { response: [] },
      });
      const result = await client.get('/test');
      if ('queued' in result) throw new Error('unexpected queue');
      expect(result.data).toEqual({ ok: true });
    });
  });

  describe('request signing options', () => {
    it('skips signing when request options.unsigned is true', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const signer = vi.fn().mockResolvedValue({ 'x-signature': 'signed' });
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        signer,
      });
      const result = await client.get('/test', { unsigned: true });
      expect(signer).not.toHaveBeenCalled();
      expect(result.data).toEqual({ ok: true });
    });

    it('throws SigningError when signer rejects', async () => {
      const fetcher = vi.fn();
      const signer = vi.fn().mockRejectedValue(new Error('signing failed'));
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        signer,
        retries: 0,
      });
      await expect(client.get('/test')).rejects.toBeInstanceOf(SigningError);
    });
  });

  describe('abort signal handling', () => {
    it('merges external abort signal with internal timeout signal', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const controller = new AbortController();
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
      });
      await client.get('/test', { signal: controller.signal });
      expect(fetcher).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    it('throws AbortError when fetch aborts from external signal', async () => {
      const fetcher = vi.fn((_url: string, init?: RequestInit) => {
        return new Promise<Response>((_, reject) => {
          const onAbort = () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          };
          if (init?.signal?.aborted) {
            onAbort();
            return;
          }
          init?.signal?.addEventListener('abort', onAbort, { once: true });
        });
      });
      const controller = new AbortController();
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher: fetcher as typeof fetch,
        retries: 0,
      });
      const promise = client.get('/test', { signal: controller.signal });
      await new Promise((r) => setTimeout(r, 10));
      controller.abort();
      await expect(promise).rejects.toBeInstanceOf(AbortError);
    });
  });

  describe('telemetry resilience', () => {
    it('survives telemetry hook exceptions', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        telemetry: {
          onRequestStart: () => {
            throw new Error('telemetry boom');
          },
        },
      });
      const result = await client.get('/test');
      expect(result.data).toEqual({ ok: true });
    });

    it('does not throw when telemetry complete hook is missing', async () => {
      const fetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const onStart = vi.fn();
      const client = createApiClient({
        baseUrl: 'https://api.test',
        fetcher,
        telemetry: { onRequestStart: onStart },
      });
      const result = await client.get('/test');
      expect(result.data).toEqual({ ok: true });
      expect(onStart).toHaveBeenCalled();
    });
  });
});
