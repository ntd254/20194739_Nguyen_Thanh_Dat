import { UsersService } from '@/client-sdk';
import { getMe } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';
import { useLoggedIn } from './use-logged-in';

export const useLogInUser = () => {
  const isLoggedIn = useLoggedIn();

  const {
    data: user,
    isPending,
    isError,
    isSuccess,
    isFetching,
  } = useQuery({
    queryFn: UsersService.userControllerGetMe,
    queryKey: getMe,
    enabled: isLoggedIn,
  });

  return { user, isPending, isError, isSuccess, isFetching };
};
