import { useQuery } from '@tanstack/react-query';
import { FilterCourse } from '../filter-course';
import { CoursesService } from '@/client-sdk';
import { getCourses } from '@/constants/query-keys';

export const LIMIT = 6;
export const useGetCourses = (filter: FilterCourse) => {
  const { data: courses, isPending } = useQuery({
    queryFn: () =>
      CoursesService.courseControllerGetCourses({
        ...filter,
        rating: filter.rating || undefined,
        limit: LIMIT,
        page: filter.page,
      }),
    queryKey: getCourses(filter),
  });

  return { courses, isPending };
};
