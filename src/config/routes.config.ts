export const APP_ROUTES = {
  HOME: '/',
  FORBIDDEN: '/forbidden',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  USER: {
    DASHBOARD: '/user/dashboard',
    BOOKS: '/user/books',
    BOOK_DETAILS: (id: string) => `/user/books/${id}`,
    TUTORIALS: '/user/tutorials',
    LIBRARY: '/user/library',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    MANAGE_BOOKS: '/admin/manage-books',
    ADD_BOOK: '/admin/manage-books/add',
    EDIT_BOOK: (id: string) => `/admin/manage-books/edit/${id}`,
    MANAGE_GENRES: '/admin/manage-genres',
    MANAGE_TUTORIALS: '/admin/manage-tutorials',
    MANAGE_USERS: '/admin/manage-users',
    REVIEWS: '/admin/reviews',
  },
} as const;
