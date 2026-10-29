import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';
import { IBook, IBookFilterParams } from '../types/book.types';

export interface IBooksResponse {
  books: IBook[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const booksApi = {
  getBooks: async (params?: IBookFilterParams): Promise<IBooksResponse> => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params?.search) queryParams.search = params.search;
    if (params?.genre && params.genre.length > 0)
      queryParams.genre = params.genre.join(',');
    if (params?.minRating) queryParams.minRating = params.minRating;
    if (params?.maxRating) queryParams.maxRating = params.maxRating;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const res = await apiClient.get<{
      success: boolean;
      meta?: { page: number; limit: number; total: number; totalPages: number };
      data?: IBook[];
      books?: IBook[];
    }>(API_ENDPOINTS.BOOKS.BASE, {
      params: queryParams,
    });

    const books = Array.isArray(res.data) ? res.data : (res.books || []);
    const meta = res.meta;

    return {
      books,
      total: meta?.total ?? books.length,
      totalPages: meta?.totalPages ?? 1,
      currentPage: meta?.page ?? (params?.page || 1),
    };
  },

  getBookById: async (id: string): Promise<IBook> => {
    const res = await apiClient.get<{
      success: boolean;
      data?: IBook;
      book?: IBook;
    } | IBook>(API_ENDPOINTS.BOOKS.BY_ID(id));

    if ('data' in res && res.data) return res.data;
    if ('book' in res && (res as any).book) return (res as any).book;
    return res as IBook;
  },

  getBooksByIds: async (ids: string[]): Promise<{ books: IBook[] }> => {
    const res = await apiClient.get<{
      success: boolean;
      data?: IBook[];
      books?: IBook[];
    }>(`${API_ENDPOINTS.BOOKS.BASE}?ids=${ids.join(',')}`);

    const books = Array.isArray(res.data) ? res.data : (res.books || []);
    return { books };
  },

  createBook: async (data: unknown) => {
    const res = await apiClient.post<{
      success: boolean;
      data: IBook;
    }>(API_ENDPOINTS.BOOKS.BASE, data);
    return res.data;
  },

  updateBook: async (id: string, data: unknown) => {
    const res = await apiClient.patch<{
      success: boolean;
      data: IBook;
    }>(API_ENDPOINTS.BOOKS.BY_ID(id), data);
    return res.data;
  },

  deleteBook: async (id: string) => {
    return apiClient.delete(API_ENDPOINTS.BOOKS.BY_ID(id));
  },

  getGenres: async (): Promise<{ genres: string[] }> => {
    const res = await apiClient.get<{
      success: boolean;
      data?: string[];
      genres?: string[];
    }>(API_ENDPOINTS.BOOKS.GENRES);

    const genres = Array.isArray(res.data) ? res.data : (res.genres || []);
    return { genres };
  },
};
