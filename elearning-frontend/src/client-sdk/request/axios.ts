import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from 'axios';
import Cookies from 'js-cookie';
import { OpenAPI } from '../core/OpenAPI';
import { COOKIE_KEY } from '@/constants/cookie';
import { pageList } from '@/constants/page-list';
import { setNewToken } from '@/lib/utils/set-new-token';

type RefreshTokenResult = { accessToken: string; refreshToken: string };

let requestsToRetry: Function[] = [];

function onAccessTokenFetched(response: RefreshTokenResult) {
  requestsToRetry.forEach((fetchFunction: Function) => fetchFunction(response));
}

function addRequestToRetry(fetchFunction: Function) {
  requestsToRetry.push(fetchFunction);
}

function addRequestInterceptor(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config) => {
      const accessToken = Cookies.get(COOKIE_KEY.accessToken);
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
}

export function isAuthError(error: any) {
  return (
    error.response?.status === 403 ||
    error.response?.status === 401 ||
    error.response?.data?.status === 401 ||
    error.response?.data?.status === 403
  );
}

function isAuthUrl(url: string) {
  return ['/api/auth/login'].some((item) => url.includes(item));
}

// This variable is to prevent multiple requests to refresh token
let refreshingAccessToken = false;

function addResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalConfig: AxiosRequestConfig = error.config;
      const refreshToken = Cookies.get(COOKIE_KEY.refreshToken);
      const accessToken = Cookies.get(COOKIE_KEY.accessToken);

      if (!refreshToken) return Promise.reject(error);

      if (
        error instanceof AxiosError &&
        error.response &&
        isAuthError(error) &&
        !isAuthUrl(originalConfig.url as string) &&
        !refreshingAccessToken
      ) {
        refreshingAccessToken = true;
        axios
          .post<RefreshTokenResult>(`${OpenAPI.BASE}/api/auth/refresh-token`, {
            accessToken,
            refreshToken,
          })
          .then(({ data }) => {
            setNewToken(data.accessToken, data.refreshToken);
            onAccessTokenFetched(data);
          })
          .catch(() => {
            Cookies.remove(COOKIE_KEY.accessToken);
            Cookies.remove(COOKIE_KEY.refreshToken);
            const currentOrigin = window.location.origin;
            const currentPath = window.location.pathname;
            const redirectUrl = new URL(pageList.logIn, currentOrigin);
            redirectUrl.searchParams.set('redirect', currentPath);
            window.location.href = redirectUrl.href;
          })
          .finally(() => {
            refreshingAccessToken = false;
            requestsToRetry = [];
          });

        const retryRequest = new Promise((resolve) => {
          addRequestToRetry((response: RefreshTokenResult) => {
            if (originalConfig.headers) {
              originalConfig.headers['Authorization'] =
                `Bearer ${response.accessToken}`;
            }
            resolve(axios.request(originalConfig));
          });
        });

        return retryRequest;
      }

      return Promise.reject(error);
    },
  );
}

function createAxiosInstance(
  config: CreateAxiosDefaults<any> = {
    timeout: 10 * 1000,
  },
) {
  const instance = axios.create(config);

  addRequestInterceptor(instance);
  addResponseInterceptor(instance);

  return instance;
}

const customAxiosInstance = createAxiosInstance();

export * from 'axios';

export default customAxiosInstance;
