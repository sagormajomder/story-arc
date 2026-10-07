import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';

export interface IDashboardStats {
  totalBooks?: number;
  totalUsers?: number;
  totalReviews?: number;
  totalTutorials?: number;
  [key: string]: unknown;
}

export interface IChartData {
  name: string;
  value: number;
}

export const dashboardApi = {
  getStats: (token?: string) =>
    apiClient.get<IDashboardStats>(API_ENDPOINTS.DASHBOARD.STATS, { token }),

  getCharts: (token?: string) =>
    apiClient.get<IChartData[]>(API_ENDPOINTS.DASHBOARD.CHARTS, { token }),
};
