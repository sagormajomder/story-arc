import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';

export interface IDashboardStats {
  totalBooks?: number;
  totalUsers?: number;
  pendingReviews?: number;
  totalReviews?: number;
  totalTutorials?: number;
  [key: string]: unknown;
}

export interface IChartData {
  name: string;
  value: number;
}

export const dashboardApi = {
  getStats: async (): Promise<IDashboardStats> => {
    const res = await apiClient.get<{
      success: boolean;
      message: string;
      data: IDashboardStats;
    }>(API_ENDPOINTS.DASHBOARD.STATS);
    return res.data;
  },

  getCharts: async (): Promise<{ genreData: IChartData[] }> => {
    const res = await apiClient.get<{
      success: boolean;
      message: string;
      data: { genreData?: IChartData[] } | IChartData[];
    }>(API_ENDPOINTS.DASHBOARD.CHARTS);

    if (Array.isArray(res.data)) {
      return { genreData: res.data };
    }
    return { genreData: res.data?.genreData || [] };
  },
};
