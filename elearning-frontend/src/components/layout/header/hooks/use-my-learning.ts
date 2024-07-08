import { UsersService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';

export const useMyLearning = () => {
  const { data: courses } = useQuery({
    queryFn: () =>
      UsersService.userControllerGetMyLearningCourses({ limit: 5, page: 1 }),
    queryKey: ['my-learning'],
  });

  return courses;
};
