import { CoursesService } from '@/client-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useEnrollFreeCourse = () => {
  const queryClient = useQueryClient();

  const { mutate: enroll, isPending } = useMutation({
    mutationFn: (courseId: string) =>
      CoursesService.courseControllerEnrollFreeCourse({
        requestBody: { id: courseId },
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['my-learning'] }),
  });

  return { enroll, isPending };
};
