import { ReviewsService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

export const useReviewDetail = () => {
  const reviewId = useRouter().query.reviewId as string | undefined;

  const { data: review, isError } = useQuery({
    queryKey: ['reviews', reviewId],
    queryFn: () =>
      ReviewsService.reviewControllerGetReviewDetail({ id: reviewId! }),
    enabled: !!reviewId,
  });

  return { review, isError };
};
