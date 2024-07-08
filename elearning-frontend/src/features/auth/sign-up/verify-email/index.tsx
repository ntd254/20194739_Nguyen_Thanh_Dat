import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import { getMe } from '@/constants/query-keys';
import { setNewToken } from '@/lib/utils/set-new-token';

type VerifyEmailProps = {
  accessToken: string;
  refreshToken: string;
};

const VerifyEmail: FC<VerifyEmailProps> = ({ accessToken, refreshToken }) => {
  const router = useRouter();
  const redirect = router.query.redirect as string | undefined;
  const queryClient = useQueryClient();

  useEffect(() => {
    setNewToken(accessToken, refreshToken);
    queryClient.invalidateQueries({ queryKey: getMe });

    // Broadcast to all tabs that the user has signed up to reload
    const boardCastChannel = new BroadcastChannel('sign-up');
    boardCastChannel.postMessage('success');

    router.push(redirect ?? '/courses', undefined, {
      unstable_skipClientCache: true,
    });

    return () => {
      boardCastChannel.close();
    };
  }, []);

  return null;
};

export default VerifyEmail;
