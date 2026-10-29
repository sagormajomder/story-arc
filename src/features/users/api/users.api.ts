import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';
import { IUser } from '../types/user.types';

export interface IUsersResponse {
  users: IUser[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export const usersApi = {
  getUsers: async (
    page = 1,
    limit = 10,
    search?: string,
    role?: string
  ): Promise<IUsersResponse> => {
    const res = await apiClient.get<{
      success: boolean;
      meta?: { page: number; limit: number; total: number; totalPages: number };
      data?: IUser[];
      users?: IUser[];
    }>(API_ENDPOINTS.USERS.BASE, {
      params: {
        page,
        limit,
        ...(search ? { search } : {}),
        ...(role && role !== 'all' ? { role } : {}),
      },
    });

    const users = Array.isArray(res.data) ? res.data : (res.users || []);
    return {
      users,
      currentPage: res.meta?.page ?? page,
      totalPages: res.meta?.totalPages ?? 1,
      totalUsers: res.meta?.total ?? users.length,
    };
  },

  getUserById: async (userId: string): Promise<IUser> => {
    const res = await apiClient.get<{
      success: boolean;
      data: IUser;
    }>(API_ENDPOINTS.USERS.BY_ID(userId));
    return res.data;
  },

  updateRole: async (userId: string, role: string) => {
    const res = await apiClient.patch<{
      success: boolean;
      message: string;
      data: IUser;
    }>(API_ENDPOINTS.USERS.ROLE(userId), { role });
    return res.data;
  },

  getMe: async (): Promise<IUser> => {
    const res = await apiClient.get<{
      success: boolean;
      data: IUser;
    }>(API_ENDPOINTS.USERS.ME);
    return res.data;
  },

  updateMe: async (data: { fullName?: string; profileImage?: string }) => {
    const res = await apiClient.patch<{
      success: boolean;
      message: string;
      data: IUser;
    }>(API_ENDPOINTS.USERS.ME, data);
    return res.data;
  },
};
