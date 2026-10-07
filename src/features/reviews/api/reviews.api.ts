import { API_ENDPOINTS } from '@/config/api.config';
import { apiClient } from '@/lib/api-client';
import { IReview } from '../types/review.types';

export const reviewsApi = {
  getByBookId: (bookId: string) =>
    apiClient.get<IReview[]>(API_ENDPOINTS.REVIEWS.BY_BOOK_ID(bookId)),

  create: (data: unknown, token?: string) =>
    apiClient.post<{ review: IReview }>(API_ENDPOINTS.REVIEWS.BASE, data, {
      token,
    }),

  delete: (id: string, token?: string) =>
    apiClient.delete(API_ENDPOINTS.REVIEWS.BY_ID(id), { token }),

  approve: (id: string, token?: string) =>
    apiClient.patch(API_ENDPOINTS.REVIEWS.APPROVE(id), {}, { token }),

  getAdminReviews: (status?: string, token?: string) =>
    apiClient.get<IReview[]>(API_ENDPOINTS.REVIEWS.ADMIN_ALL, {
      params: status ? { status } : undefined,
      token,
    }),
};
