import { UsersService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';

export const LIMIT = 12;

export const useLearningCourses = (page: number) => {
  const { data: courses } = useQuery({
    queryFn: () =>
      UsersService.userControllerGetMyLearningCourses({ limit: LIMIT, page }),
    queryKey: ['my-learning-courses', page],
  });

  return courses;
};
