import { API_BASE_URL, API_ENDPOINTS } from '@src/config/api.config';
import { getMemoryToken, refreshAccessToken } from './auth-token';

export interface IErrorSource {
  path: string;
  message: string;
}

export class ApiClientError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown,
    public errorSources?: IErrorSource[]
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
  params?: Record<string, string | number | boolean | undefined>;
  _retry?: boolean;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, token, params, headers: customHeaders, _retry, ...restOptions } = options;

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

  // Required custom header for backend CSRF protection
  if (!headers.has('X-Requested-With')) {
    headers.set('X-Requested-With', 'XMLHttpRequest');
  }

  // Use provided token, or fall back to in-memory token if set
  const effectiveToken = token || getMemoryToken();
  if (effectiveToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${effectiveToken}`);
  }

  const config: RequestInit = {
    credentials: 'include',
    ...restOptions,
    headers,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
  };

  const response = await fetch(url, config);

  // Auto-refresh token on 401 Unauthorized
  if (
    response.status === 401 &&
    !_retry &&
    !url.includes(API_ENDPOINTS.AUTH.REFRESH) &&
    !url.includes(API_ENDPOINTS.AUTH.LOGIN) &&
    !url.includes(API_ENDPOINTS.AUTH.REGISTER) &&
    !url.includes(API_ENDPOINTS.AUTH.VERIFY_EMAIL) &&
    !url.includes(API_ENDPOINTS.AUTH.RESET_PASSWORD) &&
    !url.includes(API_ENDPOINTS.AUTH.FORGOT_PASSWORD) &&
    !url.includes(API_ENDPOINTS.AUTH.RESEND_VERIFICATION)
  ) {
    const refreshOk = await refreshAccessToken();
    if (refreshOk) {
      return request<T>(endpoint, {
        ...options,
        _retry: true,
      });
    }
  }

  if (!response.ok) {
    let errorData: unknown;
    let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
    let errorSources: IErrorSource[] | undefined;

    try {
      errorData = await response.json();
      if (typeof errorData === 'object' && errorData !== null) {
        const errorObj = errorData as Record<string, unknown>;
        if (typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        }
        if (Array.isArray(errorObj.errorSources)) {
          errorSources = errorObj.errorSources as IErrorSource[];
        }
      }
    } catch {
      // response body was not JSON
    }

    throw new ApiClientError(response.status, errorMessage, errorData, errorSources);
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
