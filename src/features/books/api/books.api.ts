import { API_ENDPOINTS } from '@/config/api.config';
import { apiClient } from '@/lib/api-client';
import { IBook, IBookFilterParams } from '../types/book.types';

export interface IBooksResponse {
  books: IBook[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const booksApi = {
  getBooks: (params?: IBookFilterParams) => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params?.search) queryParams.search = params.search;
    if (params?.genre && params.genre.length > 0)
      queryParams.genre = params.genre.join(',');
    if (params?.minRating) queryParams.minRating = params.minRating;
    if (params?.maxRating) queryParams.maxRating = params.maxRating;
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    return apiClient.get<IBooksResponse>(API_ENDPOINTS.BOOKS.BASE, {
      params: queryParams,
    });
  },

  getBookById: (id: string) =>
    apiClient.get<{ book: IBook } | IBook>(API_ENDPOINTS.BOOKS.BY_ID(id)),

  getBooksByIds: (ids: string[]) =>
    apiClient.get<{ books: IBook[] }>(
      `${API_ENDPOINTS.BOOKS.BASE}?ids=${ids.join(',')}`
    ),

  createBook: (data: unknown, token?: string) =>
    apiClient.post<{ book: IBook }>(API_ENDPOINTS.BOOKS.BASE, data, { token }),

  updateBook: (id: string, data: unknown, token?: string) =>
    apiClient.patch<{ book: IBook }>(API_ENDPOINTS.BOOKS.BY_ID(id), data, {
      token,
    }),

  deleteBook: (id: string, token?: string) =>
    apiClient.delete(API_ENDPOINTS.BOOKS.BY_ID(id), { token }),

  getGenres: (token?: string) =>
    apiClient.get<{ genres: string[] }>(API_ENDPOINTS.BOOKS.GENRES, { token }),
};
