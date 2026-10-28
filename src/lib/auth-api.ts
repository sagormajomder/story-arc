import { API_ENDPOINTS } from '@src/config/api.config';
import { apiClient } from './api-client';
import {
  IAuthResponse,
  IForgotPasswordPayload,
  ILoginPayload,
  IRegisterPayload,
  IResendVerificationPayload,
  IResetPasswordPayload,
  IUser,
  IVerifyEmailPayload,
} from '@src/types/auth.types';

export const authApi = {
  login: async (data: ILoginPayload): Promise<IAuthResponse> => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: { user: IUser };
    }>(API_ENDPOINTS.AUTH.LOGIN, data);
    return res.data;
  },

  googleLogin: async (
    token: string,
    type: 'access' | 'id' = 'access'
  ): Promise<IAuthResponse> => {
    const payload =
      type === 'access' ? { accessToken: token } : { idToken: token };
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: { user: IUser };
    }>(API_ENDPOINTS.AUTH.GOOGLE, payload);
    return res.data;
  },

  register: async (data: IRegisterPayload): Promise<{ message: string }> => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: null;
    }>(API_ENDPOINTS.AUTH.REGISTER, data);
    return { message: res.message };
  },

  verifyEmail: async (
    data: IVerifyEmailPayload
  ): Promise<{ message: string }> => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: null;
    }>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
    return { message: res.message };
  },

  resendVerification: async (
    data: IResendVerificationPayload
  ): Promise<{ message: string }> => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: null;
    }>(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, data);
    return { message: res.message };
  },

  forgotPassword: async (
    data: IForgotPasswordPayload
  ): Promise<{ message: string }> => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: null;
    }>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return { message: res.message };
  },

  resetPassword: async (
    data: IResetPasswordPayload
  ): Promise<{ message: string }> => {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: null;
    }>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return { message: res.message };
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post<{
        success: boolean;
        message: string;
        data: null;
      }>(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore errors on logout to allow local session clearance
    }
  },

  getMe: async (): Promise<IUser> => {
    const res = await apiClient.get<{
      success: boolean;
      message: string;
      data: IUser;
    }>(API_ENDPOINTS.USERS.ME);
    return res.data;
  },
};
