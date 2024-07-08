import { LearnService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useCourseProgress = () => {
  const courseId = useRouter().query.courseId as string;

  const { data: courseProgress, isError } = useQuery({
    queryFn: () => LearnService.learnControllerGetProgress({ courseId }),
    queryKey: ['courseProgress', courseId],
    enabled: Boolean(courseId),
  });

  return { courseProgress, isError };
};
