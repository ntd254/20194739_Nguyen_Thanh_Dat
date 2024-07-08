import { COOKIE_KEY } from '@/constants/cookie';
import Cookies from 'js-cookie';

export function setNewToken(accessToken: string, refreshToken: string) {
  Cookies.set(COOKIE_KEY.accessToken, accessToken, {
    expires: 7,
    secure: true,
  });
  Cookies.set(COOKIE_KEY.refreshToken, refreshToken, {
    expires: 7,
    secure: true,
  });
}
