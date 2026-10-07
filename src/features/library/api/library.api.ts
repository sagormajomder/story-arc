import { API_ENDPOINTS } from '@/config/api.config';
import { apiClient } from '@/lib/api-client';

export interface IShelfApiResponseItem {
  bookId: string;
  status?: string;
  progress?: number;
  totalPages?: number;
}

export const libraryApi = {
  getUserShelf: (userId: string, token?: string) =>
    apiClient.get<{ shelf: IShelfApiResponseItem[] }>(
      API_ENDPOINTS.USERS.BY_ID(userId),
      { token }
    ),

  updateShelfBook: (
    userId: string,
    bookId: string,
    data: { progress?: number; totalPages?: number; status?: string },
    token?: string
  ) =>
    apiClient.patch(API_ENDPOINTS.USERS.SHELF_BOOK(userId, bookId), data, {
      token,
    }),
};
