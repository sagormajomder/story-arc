export interface IGenre {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBook {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  cover: string;
  year?: string | number;
  rating?: number;
  totalReviews?: number;
  totalRatings?: number;
  totalPages?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILibraryItem {
  bookId: string;
  book: IBook;
  status: string;
  progress: number;
  totalPages: number;
}

export interface IShelfItem {
  bookId: string | IBook;
  status: 'reading' | 'completed' | 'want_to_read' | string;
  addedAt?: string;
}

export interface IBookFormData {
  title: string;
  author: string;
  genre: string;
  description: string;
  cover: string;
  year?: string | number;
}

export interface IBookFilterParams {
  search?: string;
  genre?: string[];
  minRating?: number;
  maxRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}
