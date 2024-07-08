import CourseDetail from '@/features/course/detail';
import { NextPageWithLayout } from '../_app';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { GetServerSideProps } from 'next';

const CourseDetailPage: NextPageWithLayout = () => {
  return <CourseDetail />;
};

CourseDetailPage.getLayout = (page) => (
  <>
    <Header />
    <div className="flex-1">{page}</div>
    <Footer />
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default CourseDetailPage;
