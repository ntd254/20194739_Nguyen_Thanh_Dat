import { LearnService } from '@/client-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useVoteComment = () => {
  const lessonId = useRouter().query.lessonId as string;
  const queryClient = useQueryClient();

  const { mutate: upvote } = useMutation({
    mutationFn: (data: { vote: boolean; commentId: string }) =>
      LearnService.learnControllerUpvoteComment({
        lessonId,
        commentId: data.commentId,
        requestBody: { upvote: data.vote },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
    },
  });

  return { upvote };
};
