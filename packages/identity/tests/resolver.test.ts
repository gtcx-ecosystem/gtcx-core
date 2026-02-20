import { describe, expect, it } from 'vitest';

import { createDID, createDIDDocument } from '../src/did';
import { createIdentity } from '../src/identity';
import {
  createDIDResolver,
  createInMemoryDIDCache,
  createStaticDIDResolverAdapter,
  DIDResolverError,
} from '../src/resolver';

describe('DID resolver', () => {
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
});
