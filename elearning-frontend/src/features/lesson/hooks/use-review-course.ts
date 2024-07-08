import { LearnService, Rating } from '@/client-sdk';
import { useToast } from '@/components/ui/use-toast';
import { socket } from '@/constants/socket';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useReviewCourse = () => {
  const courseId = useRouter().query.courseId as string;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: review } = useMutation({
    mutationFn: (data: { rating: Rating; content?: string }) =>
      LearnService.learnControllerReviewCourse({ courseId, requestBody: data }),
    onSuccess: () => {
      socket.emit('review', { courseId });
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
      toast({ title: 'Cảm ơn bạn đã đánh giá', variant: 'success' });
    },
  });

  return review;
};
