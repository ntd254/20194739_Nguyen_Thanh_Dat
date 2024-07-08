import { parseAsInteger, useQueryState } from 'nuqs';
import { FC } from 'react';
import { LIMIT, useLearningCourses } from './hooks/use-learning-courses';
import CourseItem from './course-item';
import CustomPagination from '@/components/ui/custom-pagination';

const MyCourseFeature: FC = () => {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const courses = useLearningCourses(page);

  return (
    <div className="flex flex-1 flex-col pb-5">
      <h2 className="mb-3 text-lg font-semibold">Danh sách khóa học</h2>

      <div className="grid grid-cols-4 gap-x-5 gap-y-7">
        {courses?.results.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>

      {courses && (
        <CustomPagination
          className="mt-auto"
          page={page}
          pageSize={LIMIT}
          total={courses.total}
          onChange={(page) => setPage(page)}
        />
      )}
    </div>
  );
};

export default MyCourseFeature;
