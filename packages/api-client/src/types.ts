export interface ApiClientOptions {
  baseUrl: string;
  timeout?: number; // default 30000
  retries?: number; // default 3
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  durationMs: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  retryable: boolean;
}

export interface IApiClient {
  get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T>(path: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}
