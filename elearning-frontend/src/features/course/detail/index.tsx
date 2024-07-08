import { useRouter } from 'next/router';
import { useCourseDetail } from './hooks/use-course-detail';
import NotFound from '@/components/ui/not-found';
import CourseOverview from './course-overview';
import CourseContent from './couse-content';
import CourseReviews from './course-reviews';
import Teacher from './teacher';

export default function CourseDetail() {
  const courseId = useRouter().query.id as string;

  const { course, isError } = useCourseDetail(courseId);

  if (isError) {
    return <NotFound />;
  }

  if (!course) {
    return null;
  }

  return (
    <div>
      <CourseOverview course={course} />
      <div className="mx-auto w-full max-w-6xl px-8">
        <CourseContent course={course} />
        <Teacher userId={course.teacher.id} />
        <CourseReviews course={course} />
      </div>
    </div>
  );
}
