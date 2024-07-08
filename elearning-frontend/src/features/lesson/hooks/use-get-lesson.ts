import { LearnService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useGetLesson = () => {
  const lessonId = useRouter().query.lessonId as string;
  const { data: lesson, isError } = useQuery({
    queryFn: () => LearnService.learnControllerGetLesson({ lessonId }),
    queryKey: ['lessons', lessonId],
    enabled: Boolean(lessonId),
  });

  return { lesson, isError };
};
