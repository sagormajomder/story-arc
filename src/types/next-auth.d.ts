import { DefaultSession } from 'next-auth';
import 'next-auth/jwt';
import type { IShelfItem } from '@src/features/books/books.index';

export interface ISessionUser {
  id?: string;
  _id?: string;
  role?: 'user' | 'admin' | string;
  profileImage?: string | null;
  shelf?: IShelfItem[];
}

export interface IAuthUser {
  _id?: string;
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: 'user' | 'admin' | string;
  token?: string;
  profileImage?: string | null;
}

export interface IJWTPayload {
  id?: string;
  role?: 'user' | 'admin' | string;
  accessToken?: string;
  picture?: string | null;
}

declare module 'next-auth' {
  interface Session {
    token?: string;
    user: ISessionUser & DefaultSession['user'];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends IAuthUser {}
}

declare module 'next-auth/jwt' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface JWT extends IJWTPayload {}
}
