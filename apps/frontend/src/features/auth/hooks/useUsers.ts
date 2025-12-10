import { useQuery } from '@tanstack/react-query';
import {
  getAllUsers,
  type UserListItem,
} from '@/features/auth/services/user.service';

/**
 * Hook to fetch all users
 */
export const useUsers = () => {
  return useQuery<UserListItem[]>({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });
};
