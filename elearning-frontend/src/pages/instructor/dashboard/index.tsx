import TeacherLayout from '@/components/layout/teacher/teacher-layout';
import DashboardFeature from '@/features/instructor/dashboard';
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';

const Page: NextPageWithLayout = () => {
  return <DashboardFeature />;
};

Page.getLayout = (page) => <TeacherLayout>{page}</TeacherLayout>;

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default Page;
