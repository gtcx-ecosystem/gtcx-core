import { describe, it, expect } from 'vitest';

import { createApiClient } from '../src/index';
import type { ApiClientOptions, ApiResponse, ApiError, RequestOptions } from '../src/types';

describe('@gtcx/api-client', () => {
  describe('createApiClient', () => {
    it('should return a stub API client', () => {
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      expect(client).toBeDefined();
      expect(typeof client.get).toBe('function');
      expect(typeof client.post).toBe('function');
      expect(typeof client.put).toBe('function');
      expect(typeof client.delete).toBe('function');
    });

    it('should throw "API client not implemented" on get', async () => {
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      await expect(client.get('/test')).rejects.toThrow('API client not implemented');
    });

    it('should throw "API client not implemented" on post', async () => {
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      await expect(client.post('/test', {})).rejects.toThrow('API client not implemented');
    });

    it('should throw "API client not implemented" on put', async () => {
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      await expect(client.put('/test', {})).rejects.toThrow('API client not implemented');
    });

    it('should throw "API client not implemented" on delete', async () => {
      const client = createApiClient({ baseUrl: 'https://api.example.com' });
      await expect(client.delete('/test')).rejects.toThrow('API client not implemented');
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
      const error: ApiError = { message: 'fail', retryable: false };
      const requestOpts: RequestOptions = { timeout: 5000 };

      expect(options).toBeDefined();
      expect(response).toBeDefined();
      expect(error).toBeDefined();
      expect(requestOpts).toBeDefined();
    });
  });
});
