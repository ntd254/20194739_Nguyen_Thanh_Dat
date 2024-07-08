import { LearnService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useCheckAnswer = () => {
  const lessonId = useRouter().query.lessonId as string;

  const { mutate: checkAnswer, data } = useMutation({
    mutationFn: (data: { questionId: string; answerIds: string[] }) => {
      return LearnService.learnControllerCheckAnswer({
        requestBody: data,
        lessonId,
      });
    },
  });

  return { checkAnswer, data };
};
