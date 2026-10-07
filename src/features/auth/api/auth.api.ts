import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';

export const authApi = {
  register: <T>(data: FormData | Record<string, unknown>) =>
    apiClient.post<T>(API_ENDPOINTS.AUTH.REGISTER, data),

  login: <T>(data: Record<string, unknown>) =>
    apiClient.post<T>(API_ENDPOINTS.AUTH.LOGIN, data),

  getSession: async () => {
    const res = await fetch('/api/auth/session');
    if (!res.ok) throw new Error('Failed to fetch session');
    return res.json();
  },
};
