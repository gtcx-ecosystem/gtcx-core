import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDID, createDIDDocument } from '../src/did';
import { createIdentity } from '../src/identity';
import {
  createDIDResolver,
  createHttpDIDResolverAdapter,
  createInMemoryDIDCache,
  createStaticDIDResolverAdapter,
  DIDResolverError,
} from '../src/resolver';

describe('DID resolver', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves a DID via adapter', async () => {
    const { identity } = await createIdentity();
    const did = createDID(identity);
    const document = createDIDDocument(identity);

    const resolver = createDIDResolver({
      adapters: [createStaticDIDResolverAdapter({ [did]: document })],
    });

    const result = await resolver.resolve(did);
    expect(result.document?.id).toBe(did);
    expect(result.metadata.resolver).toBe('static');
  });

  it('uses cache for repeated resolutions', async () => {
    const { identity } = await createIdentity();
    const did = createDID(identity);
    const document = createDIDDocument(identity);
    let calls = 0;

    const adapter = {
      name: 'counting',
      resolve: async () => {
        calls += 1;
        return document;
      },
    };

    const resolver = createDIDResolver({
      adapters: [adapter],
      cache: createInMemoryDIDCache(),
      cacheTtlMs: 10_000,
    });

    await resolver.resolve(did);
    await resolver.resolve(did);

    expect(calls).toBe(1);
  });

  it('rejects revoked identities via revocation checker', async () => {
    const { identity } = await createIdentity();
    const did = createDID(identity);
    const document = createDIDDocument(identity);

    const resolver = createDIDResolver({
      adapters: [createStaticDIDResolverAdapter({ [did]: document })],
      revocationChecker: async () => 'revoked',
    });

    await expect(resolver.resolve(did)).rejects.toBeInstanceOf(DIDResolverError);
  });

  it('throws on invalid DID format', async () => {
    const resolver = createDIDResolver({
      adapters: [createStaticDIDResolverAdapter({})],
    });

    await expect(resolver.resolve('not-a-did')).rejects.toMatchObject({
      code: 'INVALID_DID',
    });
  });

  it('resolves using HTTP adapter and handles 404', async () => {
    const { identity } = await createIdentity();
    const did = createDID(identity);
    const document = createDIDDocument(identity);

    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(document), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );
    fetchSpy.mockResolvedValueOnce(new Response('', { status: 404 }));

    const adapter = createHttpDIDResolverAdapter({ baseUrl: 'https://resolver.test' });
    const resolver = createDIDResolver({ adapters: [adapter] });

    const first = await resolver.resolve(did);
    expect(first.document?.id).toBe(did);

    const second = await resolver.resolve('did:gtcx:missing');
    expect(second.document).toBeNull();
  });

  it('emits metrics callback on resolution failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('oops', { status: 500, headers: { 'content-type': 'text/plain' } })
    );

    const metrics = vi.fn();
    const adapter = createHttpDIDResolverAdapter({ baseUrl: 'https://resolver.test', retries: 0 });
    const resolver = createDIDResolver({ adapters: [adapter], metrics });

    await expect(resolver.resolve('did:gtcx:broken')).rejects.toBeInstanceOf(DIDResolverError);
    expect(metrics).toHaveBeenCalled();
  });
});
