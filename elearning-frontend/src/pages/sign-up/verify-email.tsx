import { AuthService } from '@/client-sdk';
import { pageList } from '@/constants/page-list';
import VerifyEmail from '@/features/auth/sign-up/verify-email';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { FC } from 'react';

const Page: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  accessToken,
  refreshToken,
}) => {
  return <VerifyEmail accessToken={accessToken} refreshToken={refreshToken} />;
};

export const getServerSideProps = (async ({ query }) => {
  const token = query.token as string | undefined;
  if (!token) {
    return { redirect: { destination: pageList.logIn, permanent: false } };
  }

  try {
    const { accessToken, refreshToken } =
      await AuthService.authControllerVerifyEmail({
        requestBody: { token },
      });
    return { props: { accessToken, refreshToken } };
  } catch {
    return { redirect: { destination: pageList.logIn, permanent: false } };
  }
}) satisfies GetServerSideProps<{
  accessToken: string | null;
  refreshToken: string | null;
}>;

export default Page;
