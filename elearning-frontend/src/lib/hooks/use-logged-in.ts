import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { COOKIE_KEY } from '@/constants/cookie';

export const useLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const hasRefreshToken = Cookies.get(COOKIE_KEY.refreshToken);

  useEffect(() => {
    setIsLoggedIn(Boolean(hasRefreshToken));
  }, [hasRefreshToken]);

  return isLoggedIn;
};
