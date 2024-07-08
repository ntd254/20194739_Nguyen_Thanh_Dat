import Header from '@/components/layout/header';
import LessonFeature from '@/features/lesson';
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';

const Page: NextPageWithLayout = () => {
  return <LessonFeature />;
};

Page.getLayout = (page) => (
  <>
    <Header />
    <div className="flex-1">{page}</div>
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default Page;
