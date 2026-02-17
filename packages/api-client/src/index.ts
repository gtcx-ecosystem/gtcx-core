export * from './types';

import type { ApiClientOptions, IApiClient } from './types';

export function createApiClient(_options: ApiClientOptions): IApiClient {
  const notImplemented = async () => {
    throw new Error('API client not implemented');
  };
  return {
    get: notImplemented,
    post: notImplemented,
    put: notImplemented,
    delete: notImplemented,
  };
}
