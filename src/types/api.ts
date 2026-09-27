export interface IPaginatedResponse<T> {
  books?: T[];
  tutorials?: T[];
  users?: T[];
  genres?: T[];
  data?: T[];
  totalBooks?: number;
  totalTutorials?: number;
  totalUsers?: number;
  totalPages: number;
  currentPage: number;
  count?: number;
}

export interface IApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface IPageProps<P = Record<string, string>, S = Record<string, string | string[] | undefined>> {
  params: Promise<P>;
  searchParams?: Promise<S>;
}
