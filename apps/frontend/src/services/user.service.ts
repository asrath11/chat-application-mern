import axiosInstance from '@/lib/axios';

export type UserListItem = {
  id: string;
  userName: string;
  avatar?: string;
};

class UserService {
  async getAllUsers() {
    const response = await axiosInstance.get<UserListItem[]>('/users');
    return response.data;
  }
}

export const userService = new UserService();
