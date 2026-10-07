import { API_ENDPOINTS } from '@/config/api.config';
import { apiClient } from '@/lib/api-client';
import { IUser } from '../types/user.types';

export interface IUsersResponse {
  users: IUser[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export const usersApi = {
  getUsers: (page = 1, limit = 10, token?: string) =>
    apiClient.get<IUsersResponse>(API_ENDPOINTS.USERS.BASE, {
      params: { page, limit },
      token,
    }),

  updateRole: (userId: string, role: string, token?: string) =>
    apiClient.patch(API_ENDPOINTS.USERS.ROLE(userId), { role }, { token }),

  deleteUser: (userId: string, token?: string) =>
    apiClient.delete(API_ENDPOINTS.USERS.BY_ID(userId), { token }),

  getUserById: (userId: string, token?: string) =>
    apiClient.get<{ user: IUser } | IUser>(API_ENDPOINTS.USERS.BY_ID(userId), {
      token,
    }),

  getUserStats: (userId: string, token?: string) =>
    apiClient.get(API_ENDPOINTS.USERS.STATS(userId), { token }),

  getUserRecommendations: (userId: string, token?: string) =>
    apiClient.get(API_ENDPOINTS.USERS.RECOMMENDATIONS(userId), { token }),

  updateGoal: (userId: string, goal: number, token?: string) =>
    apiClient.patch(API_ENDPOINTS.USERS.GOAL(userId), { goal }, { token }),
};
