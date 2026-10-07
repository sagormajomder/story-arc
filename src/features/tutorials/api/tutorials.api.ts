import { API_ENDPOINTS } from '@/config/api.config';
import { apiClient } from '@/lib/api-client';
import { ITutorial, ITutorialsResponse } from '../types/tutorial.types';

export const tutorialsApi = {
  getTutorials: (page = 1, limit = 10) =>
    apiClient.get<ITutorialsResponse>(API_ENDPOINTS.TUTORIALS.BASE, {
      params: { page, limit },
    }),

  create: (data: unknown, token?: string) =>
    apiClient.post<{ tutorial: ITutorial }>(
      API_ENDPOINTS.TUTORIALS.BASE,
      data,
      { token }
    ),

  update: (id: string, data: unknown, token?: string) =>
    apiClient.put<{ tutorial: ITutorial }>(
      API_ENDPOINTS.TUTORIALS.BY_ID(id),
      data,
      { token }
    ),

  delete: (id: string, token?: string) =>
    apiClient.delete(API_ENDPOINTS.TUTORIALS.BY_ID(id), { token }),
};
