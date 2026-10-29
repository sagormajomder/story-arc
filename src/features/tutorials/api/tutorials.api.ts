import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';
import { ITutorial, ITutorialsResponse } from '../types/tutorial.types';

export const tutorialsApi = {
  getTutorials: async (
    page = 1,
    limit = 10,
    category?: string
  ): Promise<ITutorialsResponse> => {
    const res = await apiClient.get<{
      success: boolean;
      meta?: { page: number; limit: number; total: number; totalPages: number };
      data?: ITutorial[];
      tutorials?: ITutorial[];
    }>(API_ENDPOINTS.TUTORIALS.BASE, {
      params: {
        page,
        limit,
        ...(category && category !== 'All' ? { category } : {}),
      },
    });

    const tutorials = Array.isArray(res.data) ? res.data : (res.tutorials || []);
    return {
      tutorials,
      currentPage: res.meta?.page ?? page,
      totalPages: res.meta?.totalPages ?? 1,
      totalTutorials: res.meta?.total ?? tutorials.length,
    };
  },

  getTutorialById: async (id: string): Promise<ITutorial> => {
    const res = await apiClient.get<{
      success: boolean;
      data: ITutorial;
    }>(API_ENDPOINTS.TUTORIALS.BY_ID(id));
    return res.data;
  },

  create: async (data: unknown) => {
    const res = await apiClient.post<{
      success: boolean;
      data: ITutorial;
    }>(API_ENDPOINTS.TUTORIALS.BASE, data);
    return res.data;
  },

  update: async (id: string, data: unknown) => {
    const res = await apiClient.patch<{
      success: boolean;
      data: ITutorial;
    }>(API_ENDPOINTS.TUTORIALS.BY_ID(id), data);
    return res.data;
  },

  delete: async (id: string) => {
    return apiClient.delete(API_ENDPOINTS.TUTORIALS.BY_ID(id));
  },
};
