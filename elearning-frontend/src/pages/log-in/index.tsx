import LogInFeature from '@/features/auth/log-in';
import { GetServerSideProps } from 'next';

export default function LogInPage() {
  return <LogInFeature />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
