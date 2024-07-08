import ListCourseFeature from '@/features/course/list';
import { GetServerSideProps } from 'next';

export default function Course() {
  return <ListCourseFeature />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};
