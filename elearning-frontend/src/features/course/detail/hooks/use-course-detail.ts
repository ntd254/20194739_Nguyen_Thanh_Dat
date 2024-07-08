import { CoursesService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';

export const useCourseDetail = (courseId: string) => {
  const { data: course, isError } = useQuery({
    queryFn: () => CoursesService.courseControllerGetCourseDetail({ courseId }),
    queryKey: ['courseDetail', courseId],
    enabled: !!courseId,
  });

  return { course, isError };
};
