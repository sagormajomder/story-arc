import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';
import { IReview } from '../types/review.types';

export const reviewsApi = {
  getByBookId: async (bookId: string): Promise<IReview[]> => {
    const res = await apiClient.get<{
      success: boolean;
      meta?: { page: number; limit: number; total: number; totalPages: number };
      data: IReview[];
    }>(API_ENDPOINTS.REVIEWS.BY_BOOK_ID(bookId));
    return Array.isArray(res.data) ? res.data : [];
  },

  getMyReviews: async (page = 1, limit = 10): Promise<IReview[]> => {
    const res = await apiClient.get<{
      success: boolean;
      data: IReview[];
    }>(API_ENDPOINTS.REVIEWS.ME, {
      params: { page, limit },
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  getAdminReviews: async (
    status?: string,
    page = 1,
    limit = 20
  ): Promise<IReview[]> => {
    const res = await apiClient.get<{
      success: boolean;
      data: IReview[];
    }>(API_ENDPOINTS.REVIEWS.ADMIN, {
      params: {
        ...(status ? { status } : {}),
        page,
        limit,
      },
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  create: async (data: {
    bookId: string;
    rating: number;
    comment: string;
  }) => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: IReview;
    }>(API_ENDPOINTS.REVIEWS.BASE, data);
    return res.data;
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected') => {
    const res = await apiClient.patch<{
      success: boolean;
      message: string;
      data: IReview;
    }>(API_ENDPOINTS.REVIEWS.STATUS(id), { status });
    return res.data;
  },

  approve: async (id: string) => {
    return reviewsApi.updateStatus(id, 'approved');
  },

  reject: async (id: string) => {
    return reviewsApi.updateStatus(id, 'rejected');
  },

  delete: async (id: string) => {
    return apiClient.delete(API_ENDPOINTS.REVIEWS.BY_ID(id));
  },
};
