import SignUpFeature from '@/features/auth/sign-up/form';
import { GetServerSideProps } from 'next';

export default function SignUp() {
  return <SignUpFeature />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
