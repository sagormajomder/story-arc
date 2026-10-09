import {
  IAuthResponse,
  IForgotPasswordPayload,
  ILoginPayload,
  IRegisterPayload,
  IResendVerificationPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from '@src/types/auth.types';

export const authApi = {
  login: async (data: ILoginPayload): Promise<IAuthResponse> => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Login failed');
    }
    return result.data;
  },

  googleLogin: async (
    token: string,
    type: 'access' | 'id' = 'access'
  ): Promise<IAuthResponse> => {
    const payload =
      type === 'access' ? { accessToken: token } : { idToken: token };
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Google login failed');
    }
    return result.data;
  },

  register: async (data: IRegisterPayload): Promise<{ message: string }> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Registration failed');
    }
    return result;
  },

  verifyEmail: async (
    data: IVerifyEmailPayload
  ): Promise<{ message: string }> => {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Email verification failed');
    }
    return result;
  },

  resendVerification: async (
    data: IResendVerificationPayload
  ): Promise<{ message: string }> => {
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to resend verification email');
    }
    return result;
  },

  forgotPassword: async (
    data: IForgotPasswordPayload
  ): Promise<{ message: string }> => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to send password reset email');
    }
    return result;
  },

  resetPassword: async (
    data: IResetPasswordPayload
  ): Promise<{ message: string }> => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Password reset failed');
    }
    return result;
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
