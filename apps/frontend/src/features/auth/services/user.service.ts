import axiosInstance from '@/services/api/client';

export type UserListItem = {
  id: string;
  userName: string;
  avatar?: string;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get<UserListItem[]>('/users');
  return response.data;
};
