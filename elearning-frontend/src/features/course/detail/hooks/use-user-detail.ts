import { UsersService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';

export const useUserDetail = (userId: string) => {
  const { data: user } = useQuery({
    queryFn: () => UsersService.userControllerGetUserDetail({ id: userId }),
    queryKey: ['users', userId],
  });

  return user;
};
