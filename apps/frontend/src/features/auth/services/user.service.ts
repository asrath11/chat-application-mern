import axiosInstance from '@/services/api/client';
import type { AuthResponse } from '@chat-app/shared-types';

export type UserListItem = {
  id: string;
  userName: string;
  avatar?: string;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get<UserListItem[]>('/users');
  return response.data;
};

export interface UpdateProfileData {
  userName: string;
  avatar?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const updateProfile = async (
  data: UpdateProfileData
): Promise<AuthResponse> => {
  const response = await axiosInstance.put<AuthResponse>('/users/profile', data);
  return response.data;
};

export const updatePassword = async (
  data: UpdatePasswordData
): Promise<{ message: string }> => {
  const response = await axiosInstance.put<{ message: string }>(
    '/users/password',
    data
  );
  return response.data;
};
