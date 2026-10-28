export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: (id: string) => `/users/${id}`,
    ROLE: (id: string) => `/users/${id}/role`,
  },
  SHELF: {
    BASE: '/shelf',
    STATS: '/shelf/stats',
    GOAL: '/shelf/goal',
    RECOMMENDATIONS: '/shelf/recommendations',
    BOOK: (bookId: string) => `/shelf/book/${bookId}`,
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
  REVIEWS: {
    BASE: '/reviews',
    ME: '/reviews/me',
    BY_BOOK_ID: (bookId: string) => `/reviews/book/${bookId}`,
    BY_ID: (id: string) => `/reviews/${id}`,
    STATUS: (id: string) => `/reviews/${id}/status`,
    ADMIN: '/reviews/admin',
  },
  TUTORIALS: {
    BASE: '/tutorials',
    BY_ID: (id: string) => `/tutorials/${id}`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    CHARTS: '/dashboard/charts',
  },
} as const;
