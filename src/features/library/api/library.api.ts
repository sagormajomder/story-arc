import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';
import type { IBook } from '@src/features/books/books.index';

export interface IShelfItemApi {
  id: string;
  bookId: string;
  userId: string;
  status: string;
  progress: number;
  totalPages: number;
  startedAt: string | null;
  finishedAt: string | null;
  addedAt: string;
  createdAt?: string;
  updatedAt?: string;
  book: IBook;
}

export interface IShelfResponse {
  items: IShelfItemApi[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface IReadingStats {
  booksReadThisYear: number;
  totalPagesRead: number;
  totalBooksRead: number;
  currentStreak: number;
  readingGoal?: {
    targetBooks: number;
    booksRead: number;
    year: number;
    progressPercentage: number;
  };
}

export const libraryApi = {
  getMyShelf: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const res = await apiClient.get<{
      success: boolean;
      meta?: { page: number; limit: number; total: number; totalPages: number };
      data: IShelfItemApi[];
    }>(API_ENDPOINTS.SHELF.BASE, { params });

    return {
      items: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      totalPages: res.meta?.totalPages ?? 1,
      page: res.meta?.page ?? (params?.page || 1),
      limit: res.meta?.limit ?? (params?.limit || 10),
    };
  },

  addToShelf: async (data: {
    bookId: string;
    status: string;
    progress?: number;
    totalPages?: number;
  }) => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: IShelfItemApi;
    }>(API_ENDPOINTS.SHELF.BASE, data);
    return res.data;
  },

  checkBookInShelf: async (bookId: string) => {
    const res = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        isInShelf: boolean;
        shelfItem: IShelfItemApi | null;
      };
    }>(API_ENDPOINTS.SHELF.BOOK(bookId));
    return res.data;
  },

  updateShelfProgress: async (
    bookId: string,
    data: { progress?: number; totalPages?: number; status?: string }
  ) => {
    const res = await apiClient.patch<{
      success: boolean;
      message: string;
      data: IShelfItemApi;
    }>(API_ENDPOINTS.SHELF.BOOK(bookId), data);
    return res.data;
  },

  removeFromShelf: async (bookId: string) => {
    return apiClient.delete(API_ENDPOINTS.SHELF.BOOK(bookId));
  },

  getStats: async (): Promise<IReadingStats> => {
    const res = await apiClient.get<{
      success: boolean;
      message: string;
      data: IReadingStats;
    }>(API_ENDPOINTS.SHELF.STATS);
    return res.data;
  },

  updateGoal: async (data: { target: number; year?: number }) => {
    const res = await apiClient.patch<{
      success: boolean;
      message: string;
      data: {
        targetBooks: number;
        booksRead: number;
        year: number;
        progressPercentage: number;
      };
    }>(API_ENDPOINTS.SHELF.GOAL, data);
    return res.data;
  },

  getRecommendations: async (): Promise<IBook[]> => {
    const res = await apiClient.get<{
      success: boolean;
      message: string;
      data: IBook[];
    }>(API_ENDPOINTS.SHELF.RECOMMENDATIONS);
    return res.data || [];
  },
};
