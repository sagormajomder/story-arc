export interface IShelfItem {
  bookId: string | { _id?: string; [key: string]: unknown };
  status?: string;
  [key: string]: unknown;
}

export interface IUser {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  profileImage: string;
  role?: 'user' | 'admin' | string;
  shelf?: IShelfItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

export interface ISession {
  user: IUser | null;
  token?: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
}

export interface IVerifyEmailPayload {
  token: string;
}

export interface IResendVerificationPayload {
  email: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface IAuthContext {
  user: IUser | null;
  token: string | null;
  status: AuthStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: ILoginPayload) => Promise<void>;
  register: (data: IRegisterPayload) => Promise<{ success: boolean; message: string }>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
}
