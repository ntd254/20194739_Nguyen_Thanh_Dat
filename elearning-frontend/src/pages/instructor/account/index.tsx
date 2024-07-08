import TeacherLayout from '@/components/layout/teacher/teacher-layout';
import AccountFeature from '@/features/instructor/account';
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';

const Page: NextPageWithLayout = () => {
  return <AccountFeature />;
};

Page.getLayout = (page) => <TeacherLayout>{page}</TeacherLayout>;

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default Page;
