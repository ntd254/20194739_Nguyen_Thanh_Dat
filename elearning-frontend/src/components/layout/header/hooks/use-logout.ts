import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { COOKIE_KEY } from '@/constants/cookie';
import { AuthService } from '@/client-sdk';
import { useRouter } from 'next/router';
import { pageList } from '@/constants/page-list';
import { socket } from '@/constants/socket';

export const useLogout = () => {
  const refreshToken = Cookies.get(COOKIE_KEY.refreshToken)!;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: logout } = useMutation({
    mutationFn: () =>
      AuthService.authControllerLogout({ requestBody: { refreshToken } }),
    onSuccess: () => {
      Cookies.remove(COOKIE_KEY.accessToken);
      Cookies.remove(COOKIE_KEY.refreshToken);
      queryClient.clear();
      router.push(pageList.logIn);
      socket.disconnect();
    },
  });

  return { logout };
};
