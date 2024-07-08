import { LearnService } from '@/client-sdk';
import { socket } from '@/constants/socket';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useCreateComment = () => {
  const lessonId = useRouter().query.lessonId as string;
  const courseId = useRouter().query.courseId as string;

  const queryClient = useQueryClient();

  const { mutate: create } = useMutation({
    mutationFn: (data: { content: string; parentId?: string }) =>
      LearnService.learnControllerCreateComment({
        lessonId,
        requestBody: data,
      }),
    onSuccess(_, variables) {
      socket.emit('comment', { courseId, parentId: variables.parentId });
      queryClient.invalidateQueries({ queryKey: ['comments', lessonId] });
      queryClient.invalidateQueries({
        queryKey: ['replies', lessonId, variables.parentId],
      });
    },
  });

  return { create };
};
