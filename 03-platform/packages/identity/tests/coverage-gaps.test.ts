/**
 * @gtcx/identity — Coverage gap tests
 */

import { describe, it, expect, vi } from 'vitest';

import { createHttpDIDResolverAdapter, createDIDResolver } from '../src/resolver';

describe('fetchWithRetry — timeout/abort branches', () => {
  it('throws TIMEOUT when fetch is slow', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => {
      const signal = (init as { signal?: AbortSignal }).signal;
      return new Promise((_, reject) => {
        const timer = setTimeout(() => reject(new Error('slow')), 200);
        signal?.addEventListener('abort', () => {
          clearTimeout(timer);
          const err = new Error('Aborted');
          err.name = 'AbortError';
          reject(err);
        });
      });
    });

    const adapter = createHttpDIDResolverAdapter({
      baseUrl: 'https://resolver.test',
      timeoutMs: 50,
      retries: 0,
    });
    const resolver = createDIDResolver({ adapters: [adapter] });

    await expect(resolver.resolve('did:gtcx:timeout')).rejects.toMatchObject({
      code: 'TIMEOUT',
    });
  }, 10_000);

  it('throws when response is non-JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('not json', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    );

    const adapter = createHttpDIDResolverAdapter({
      baseUrl: 'https://resolver.test',
      retries: 0,
    });
    const resolver = createDIDResolver({ adapters: [adapter] });

    await expect(resolver.resolve('did:gtcx:plain')).rejects.toMatchObject({
      code: 'RESOLUTION_FAILED',
    });
  });
});

describe('mergeSignals — AbortSignal fallback', () => {
  it('merges signals when AbortSignal.any is unavailable', async () => {
    const originalAny = AbortSignal.any;
    // @ts-expect-error simulating old environment
    AbortSignal.any = undefined;

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 404 }));

    const adapter = createHttpDIDResolverAdapter({
      baseUrl: 'https://resolver.test',
      retries: 0,
    });
    const resolver = createDIDResolver({ adapters: [adapter] });

    const result = await resolver.resolve('did:gtcx:oldenv');
    expect(result.document).toBeNull();

    AbortSignal.any = originalAny;
  });

  it('merges already-aborted signal', async () => {
    const controller = new AbortController();
    controller.abort();

    vi.spyOn(globalThis, 'fetch').mockImplementation((_url, init) => {
      const signal = (init as { signal?: AbortSignal }).signal;
      if (signal?.aborted) {
        const err = new Error('Aborted');
        err.name = 'AbortError';
        return Promise.reject(err);
      }
      return Promise.resolve(new Response('{}', { status: 404 }));
    });

    const adapter = createHttpDIDResolverAdapter({
      baseUrl: 'https://resolver.test',
      retries: 0,
    });
    const resolver = createDIDResolver({ adapters: [adapter] });

    await expect(
      resolver.resolve('did:gtcx:aborted', { signal: controller.signal })
    ).rejects.toMatchObject({ code: 'TIMEOUT' });
  });
});
