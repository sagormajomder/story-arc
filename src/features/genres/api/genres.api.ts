import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from '@src/lib/api-client';
import type { IGenre } from '@src/features/books/books.index';

export interface IGenreWithCount extends IGenre {
  bookCount?: number;
}

export const genresApi = {
  getGenres: async (
    limit = 100,
    page = 1
  ): Promise<{ genres: IGenreWithCount[]; totalGenres: number }> => {
    const res = await apiClient.get<{
      success: boolean;
      meta?: { page: number; limit: number; total: number; totalPages: number };
      data?: IGenreWithCount[];
      genres?: IGenreWithCount[];
    }>(API_ENDPOINTS.GENRES.BASE, {
      params: { limit, page },
    });

    const genres = Array.isArray(res.data) ? res.data : (res.genres || []);
    return {
      genres,
      totalGenres: res.meta?.total ?? genres.length,
    };
  },

  create: async (name: string, description?: string) => {
    const res = await apiClient.post<{
      success: boolean;
      data: IGenre;
    }>(API_ENDPOINTS.GENRES.BASE, { name, description });
    return res.data;
  },

  update: async (id: string, name: string, description?: string) => {
    const res = await apiClient.patch<{
      success: boolean;
      data: IGenre;
    }>(API_ENDPOINTS.GENRES.BY_ID(id), { name, description });
    return res.data;
  },

  delete: async (id: string) => {
    return apiClient.delete(API_ENDPOINTS.GENRES.BY_ID(id));
  },
};
