import TeacherLayout from '@/components/layout/teacher/teacher-layout';
import CreateCourseFeature from '@/features/instructor/courses/create';
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';

const Page: NextPageWithLayout = () => {
  return <CreateCourseFeature />;
};

Page.getLayout = (page) => (
  <>
    <TeacherLayout>{page}</TeacherLayout>
  </>
);

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default Page;
