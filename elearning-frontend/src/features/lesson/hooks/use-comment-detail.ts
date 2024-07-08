import { LearnService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useCommentDetail = (commentId?: string) => {
  const lessonId = useRouter().query.lessonId as string | undefined;

  const { data: comment, isError } = useQuery({
    queryKey: ['comments', commentId],
    queryFn: () =>
      LearnService.learnControllerGetComment({
        commentId: commentId!,
        lessonId: lessonId!,
      }),
    enabled: !!commentId && !!lessonId,
  });

  return { comment, isError };
};
