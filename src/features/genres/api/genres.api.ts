import { API_ENDPOINTS } from '@/config/api.config';
import { apiClient } from '@/lib/api-client';
import { IGenre } from '@/features/books';

export interface IGenreWithCount extends IGenre {
  bookCount?: number;
}

export const genresApi = {
  getGenres: (limit = 100) =>
    apiClient.get<{ genres: IGenreWithCount[] }>(API_ENDPOINTS.GENRES.BASE, {
      params: { limit },
    }),

  create: (name: string, token?: string) =>
    apiClient.post<{ genre: IGenre }>(
      API_ENDPOINTS.GENRES.BASE,
      { name },
      { token }
    ),

  update: (id: string, name: string, token?: string) =>
    apiClient.put<{ genre: IGenre }>(
      API_ENDPOINTS.GENRES.BY_ID(id),
      { name },
      { token }
    ),

  delete: (id: string, token?: string) =>
    apiClient.delete(API_ENDPOINTS.GENRES.BY_ID(id), { token }),
};
