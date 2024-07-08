import { CoursesService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';

export const useSearchCourses = (keyword: string) => {
  const { data: courses, refetch } = useQuery({
    queryFn: () => CoursesService.courseControllerSearchCourses({ keyword }),
    queryKey: ['searchCourses', keyword],
    enabled: !!keyword,
  });

  return { courses, refetch };
};
