import { API_BASE_URL } from '@/config/api.config';

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, token, params, headers: customHeaders, ...restOptions } = options;

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const headers = new Headers(customHeaders);

  if (body && !(body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: unknown;
    let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;

    try {
      errorData = await response.json();
      if (
        typeof errorData === 'object' &&
        errorData !== null &&
        'message' in errorData &&
        typeof (errorData as { message: unknown }).message === 'string'
      ) {
        errorMessage = (errorData as { message: string }).message;
      }
    } catch {
      // response body was not JSON
    }

    throw new ApiClientError(response.status, errorMessage, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
