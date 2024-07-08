import { LearnService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';

export const useSetLessonCookie = () => {
  const { mutate: setCookie, isSuccess } = useMutation({
    mutationFn: (lessonId: string) =>
      LearnService.learnControllerCreateSignedCookies({ lessonId }),
  });

  return { setCookie, isSuccess };
};
