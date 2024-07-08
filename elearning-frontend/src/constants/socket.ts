import { Socket, io } from 'socket.io-client';
import { COOKIE_KEY } from './cookie';
import Cookies from 'js-cookie';

const isBrowser = typeof window !== 'undefined';

export const socket = (
  isBrowser
    ? io(process.env.NEXT_PUBLIC_API!, {
        autoConnect: false,
        path: '/api/socket.io',
        auth: (cb) => {
          cb({ accessToken: Cookies.get(COOKIE_KEY.accessToken) });
        },
      })
    : {}
) as Socket;
