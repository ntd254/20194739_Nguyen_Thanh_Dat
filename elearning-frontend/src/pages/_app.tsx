import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import NextNProgress from 'nextjs-progressbar';

import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils/cn';
import StudentLayout from '@/components/layout/student/layout';
import { Toaster } from '@/components/ui/toaster';
import { ReactElement, ReactNode, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { ApiError } from '@/client-sdk';
import { useLoggedIn } from '@/lib/hooks/use-logged-in';
import { socket } from '@/constants/socket';

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: Error | ApiError) => {
        if (
          error instanceof ApiError &&
          (error.status === 404 || error.status === 400)
        ) {
          return false;
        } else if (failureCount < 2) {
          return true;
        } else {
          return false;
        }
      },
    },
  },
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const isLoggedIn = useLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      socket.connect();
      return () => {
        socket.disconnect();
      };
    }
  }, [isLoggedIn]);

  const getLayout =
    Component.getLayout ?? ((page) => <StudentLayout>{page}</StudentLayout>);

  return (
    <>
      <Head>
        <title>Hust Course</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <>
          <NextNProgress
            options={{ showSpinner: false }}
            color="#2563eb"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={false}
          />
          <main
            className={cn(
              'flex min-h-screen flex-col bg-background antialiased',
              inter.className,
            )}
          >
            {getLayout(<Component {...pageProps} />)}
          </main>
          <Toaster />
        </>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}
