import { LearnService } from '@/client-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useMarkComplete = () => {
  const lessonId = useRouter().query.lessonId as string;
  const courseId = useRouter().query.courseId as string;
  const queryClient = useQueryClient();

  const { mutate: markComplete } = useMutation({
    mutationFn: ({
      completed,
      score,
    }: {
      completed: boolean;
      score?: number;
    }) =>
      LearnService.learnControllerMarkCompleted({
        lessonId,
        requestBody: { completed, score },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseProgress', courseId] });
      queryClient.invalidateQueries({ queryKey: ['lessons', lessonId] });
      queryClient.invalidateQueries({ queryKey: ['my-learning'] });
    },
  });

  return { markComplete };
};
