export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    GOOGLE: '/users/google',
  },
  BOOKS: {
    BASE: '/books',
    BY_ID: (id: string) => `/books/${id}`,
    GENRES: '/books/genres',
  },
  GENRES: {
    BASE: '/genres',
    BY_ID: (id: string) => `/genres/${id}`,
  },
  TUTORIALS: {
    BASE: '/tutorials',
    BY_ID: (id: string) => `/tutorials/${id}`,
  },
  REVIEWS: {
    BASE: '/reviews',
    BY_BOOK_ID: (bookId: string) => `/reviews/${bookId}`,
    BY_ID: (id: string) => `/reviews/${id}`,
    APPROVE: (id: string) => `/reviews/${id}/approve`,
    ADMIN_ALL: '/reviews/admin/all',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    ROLE: (id: string) => `/users/${id}/role`,
    STATS: (id: string) => `/users/${id}/stats`,
    GOAL: (id: string) => `/users/${id}/goal`,
    RECOMMENDATIONS: (id: string) => `/users/${id}/recommendations`,
    SHELF: (id: string) => `/users/${id}/shelf`,
    SHELF_BOOK: (userId: string, bookId: string) =>
      `/users/${userId}/shelf/${bookId}`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    CHARTS: '/dashboard/charts',
  },
} as const;
