import axiosInstance from '@/services/api/client';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '@chat-app/shared-types';

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/register',
    credentials
  );
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/login',
    credentials
  );
  return response.data;
};

export const logout = async (): Promise<{ message: string }> => {
  const response = await axiosInstance.post<{ message: string }>(
    '/auth/logout'
  );
  return response.data;
};

export const getMe = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.get<AuthResponse>('/auth/me');
  return response.data;
};

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const response = await axiosInstance.post<{ accessToken: string }>(
    '/auth/refresh'
  );
  return response.data;
};

export const getWsToken = async (): Promise<{ token: string }> => {
  const response = await axiosInstance.get<{ token: string }>('/auth/ws-token');
  return response.data;
};
