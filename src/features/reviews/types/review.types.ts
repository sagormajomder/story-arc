export interface IReview {
  _id: string;
  bookId: string;
  userId?: string;
  userEmail?: string;
  userName: string;
  userImage?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCover?: string;
  role?: string;
  rating: number;
  comment: string;
  status?: 'pending' | 'approved' | string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface IReviewFormData {
  rating: number;
  comment: string;
}
