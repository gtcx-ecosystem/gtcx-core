import { readFileSync } from 'node:fs';
import https from 'node:https';
import { AddressInfo } from 'node:net';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { AuthError, TimeoutError, createApiClient } from '../src/index';
import type {
  ApiClientOptions,
  ApiResponse,
  ApiError,
  ApiErrorCategory,
  ApiErrorCode,
  MtlsOptions,
  RequestOptions,
  RequestSigner,
} from '../src/types';

describe('@gtcx/api-client', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createApiClient', () => {
    it('should return a configured API client', () => {
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      expect(client).toBeDefined();
      expect(typeof client.get).toBe('function');
      expect(typeof client.post).toBe('function');
      expect(typeof client.put).toBe('function');
      expect(typeof client.delete).toBe('function');
    });

    it('should perform a GET request and return response data', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      const response = await client.get<{ ok: boolean }>('/test');

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({ method: 'GET' })
      );
      expect(response.data).toEqual({ ok: true });
      expect(response.status).toBe(200);
    });

    it('should retry on retryable errors', async () => {
      const fetchSpy = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response('error', { status: 503 }))
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          })
        );
      const client = createApiClient({ baseUrl: 'https://api.example.com', retries: 1 });
      const response = await client.get<{ ok: boolean }>('/retry');

      expect(fetchSpy).toHaveBeenCalledTimes(2);
      expect(response.data).toEqual({ ok: true });
    });

    it('should set JSON content type when posting objects', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })
      );
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      await client.post('/test', { hello: 'world' });

      const [, options] = fetchSpy.mock.calls[0] ?? [];
      const headers = (options?.headers ?? {}) as Record<string, string>;
      expect(headers['content-type'] ?? headers['Content-Type']).toBe('application/json');
    });

    it('should throw a structured error on non-retryable failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('nope', { status: 400 }));
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      await expect(client.get('/bad')).rejects.toMatchObject({
        status: 400,
        retryable: false,
      });
    });

    it('should apply request signing headers when signer is provided', async () => {
      const fetcher = vi.fn(async () => {
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      });
      const signer = vi.fn(async () => ({ 'x-signature': 'signed' }));
      const client = createApiClient({
        baseUrl: 'https://api.example.com',
        fetcher,
        signer,
      });

      await client.get('/signed');
      const [, init] = fetcher.mock.calls[0] ?? [];
      const headers = (init?.headers ?? {}) as Record<string, string>;
      expect(headers['x-signature']).toBe('signed');
    });

    it('should classify auth errors', async () => {
      const fetcher = vi.fn(async () => new Response('unauthorized', { status: 401 }));
      const client = createApiClient({ baseUrl: 'https://api.example.com', fetcher, retries: 0 });

      await expect(client.get('/auth')).rejects.toBeInstanceOf(AuthError);
    });

    it('should classify timeouts as timeout errors', async () => {
      const fetcher = vi.fn(
        async (_url: string, init?: RequestInit): Promise<Response> =>
          new Promise((_, reject) => {
            init?.signal?.addEventListener('abort', () => {
              const error = new Error('AbortError');
              error.name = 'AbortError';
              reject(error);
            });
          })
      );
      const client = createApiClient({
        baseUrl: 'https://api.example.com',
        fetcher,
        timeout: 1,
        retries: 0,
      });

      await expect(client.get('/timeout')).rejects.toBeInstanceOf(TimeoutError);
    });

    it('should support mTLS with node dispatcher', async () => {
      const ca = readFileSync(new URL('./fixtures/mtls/ca.crt', import.meta.url));
      const serverKey = readFileSync(new URL('./fixtures/mtls/server.key', import.meta.url));
      const serverCert = readFileSync(new URL('./fixtures/mtls/server.crt', import.meta.url));
      const clientKey = readFileSync(new URL('./fixtures/mtls/client.key', import.meta.url));
      const clientCert = readFileSync(new URL('./fixtures/mtls/client.crt', import.meta.url));

      const server = https.createServer(
        {
          key: serverKey,
          cert: serverCert,
          ca,
          requestCert: true,
          rejectUnauthorized: true,
        },
        (_req, res) => {
          res.writeHead(200, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        }
      );

      try {
        await new Promise<void>((resolve, reject) =>
          server.listen(0, () => resolve()).on('error', reject)
        );
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === 'EPERM') {
          return;
        }
        throw error;
      }
      const address = server.address() as AddressInfo;
      const baseUrl = `https://localhost:${address.port}`;

      try {
        const client = createApiClient({
          baseUrl,
          mtls: {
            cert: clientCert,
            key: clientKey,
            ca,
            serverName: 'localhost',
          },
        });

        const response = await client.get<{ ok: boolean }>('/mtls');
        expect(response.data).toEqual({ ok: true });
      } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
      }
    });
  });

  describe('types', () => {
    it('should export all type interfaces', () => {
      // Type-level checks — these verify the types compile correctly
      const options: ApiClientOptions = { baseUrl: 'https://api.example.com' };
      const response: ApiResponse<string> = {
        data: 'test',
        status: 200,
        headers: {},
        durationMs: 0,
      };
      const error: ApiError = {
        message: 'fail',
        retryable: false,
        category: 'http',
      };
      const category: ApiErrorCategory = 'network';
      const code: ApiErrorCode = 'NETWORK_ERROR';
      const signer: RequestSigner = () => ({});
      const mtls: MtlsOptions = {
        key: 'key',
        cert: 'cert',
      };
      const requestOpts: RequestOptions = { timeout: 5000 };

      expect(options).toBeDefined();
      expect(response).toBeDefined();
      expect(error).toBeDefined();
      expect(category).toBeDefined();
      expect(code).toBeDefined();
      expect(signer).toBeDefined();
      expect(mtls).toBeDefined();
      expect(requestOpts).toBeDefined();
    });
  });
});
