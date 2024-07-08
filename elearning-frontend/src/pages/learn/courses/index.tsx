import MyCourseFeature from '@/features/course/my-course';
import { GetServerSideProps } from 'next';
import { FC } from 'react';

const Page: FC = () => {
  return <MyCourseFeature />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default Page;
