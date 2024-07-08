import TeacherCoursesFeature from '@/features/instructor/courses';
import TeacherLayout from '@/components/layout/teacher/teacher-layout';
import { NextPageWithLayout } from '@/pages/_app';
import { GetServerSideProps } from 'next';

const Page: NextPageWithLayout = () => {
  return <TeacherCoursesFeature />;
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
