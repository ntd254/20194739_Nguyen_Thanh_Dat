import { CoursesService } from '@/client-sdk';
import { getMyTutorCourse } from '@/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useGetMyTutorCourse = () => {
  const {
    data: courses,
    isPending,
    isError,
  } = useQuery({
    queryFn: CoursesService.courseControllerGetMyTutorCourse,
    queryKey: getMyTutorCourse,
  });

  return { courses, isPending, isError };
};
