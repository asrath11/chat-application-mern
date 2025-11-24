import axiosInstance from '@/lib/axios';

// Define types based on backend expectations
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
  accessToken?: string;
}

class AuthService {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/register',
      credentials
    );
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  }

  async logout(): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(
      '/auth/logout'
    );
    return response.data;
  }

  async getMe(): Promise<AuthResponse> {
    const response = await axiosInstance.get<AuthResponse>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await axiosInstance.post<{ accessToken: string }>(
      '/auth/refresh'
    );
    return response.data;
  }
}

export const authService = new AuthService();
