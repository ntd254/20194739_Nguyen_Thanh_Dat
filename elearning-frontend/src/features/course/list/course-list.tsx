import { FilterCourse } from './filter-course';
import { LIMIT, useGetCourses } from './hooks/use-get-courses';
import CourseCard from './course-card';
import CustomPagination from '@/components/ui/custom-pagination';
import { useDebounce } from 'use-debounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderCourseBy } from '@/client-sdk';

type CourseListProps = {
  filter: FilterCourse;
  onPageChange: (page: number) => void;
  onFilterChange: (filter: Partial<FilterCourse>) => void;
};

export default function CourseList({
  filter,
  onPageChange,
  onFilterChange,
}: CourseListProps) {
  const [debouncedFiller] = useDebounce(filter, 200);
  const { courses } = useGetCourses(debouncedFiller);

  return (
    <div className="flex flex-1 flex-col justify-start self-stretch pb-5">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{courses?.total} Kết quả</h3>
        <div className="flex items-center gap-1">
          <p className="min-w-max text-lg font-semibold">Sắp xếp theo: </p>
          <Select
            value={filter.orderBy}
            onValueChange={(value: OrderCourseBy) =>
              onFilterChange({ orderBy: value })
            }
          >
            <SelectTrigger className="w-[185px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderCourseBy.NUMBER_OF_STUDENTS}>
                Nhiều người học nhất
              </SelectItem>
              <SelectItem value={OrderCourseBy.RATE}>
                Đánh giá cao nhất
              </SelectItem>
              <SelectItem value={OrderCourseBy.CREATED_AT}>Mới nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-5 grid gap-x-3 gap-y-5 lg:grid-cols-2 xl:grid-cols-3">
        {courses?.results.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      {courses && (
        <CustomPagination
          className="mt-auto"
          page={filter.page}
          pageSize={LIMIT}
          total={courses.total}
          onChange={(page) => onPageChange(page)}
        />
      )}
    </div>
  );
}
