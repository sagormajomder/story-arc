import type { IShelfItem } from '@src/features/books/books.index';

export type UserRole = 'admin' | 'user' | string;

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  token?: string;
  shelf?: IShelfItem[];
  status?: 'active' | 'suspended' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserStats {
  totalUsers?: number;
  activeUsers?: number;
  adminCount?: number;
}
