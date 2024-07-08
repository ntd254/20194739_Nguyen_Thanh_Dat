import { CoursesService } from '@/client-sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const LIMIT = 5;

export const useGetReviews = () => {
  const courseId = useRouter().query.id as string;
  const reviewId = useRouter().query.reviewId as string | undefined;

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['reviews', courseId],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => {
        return CoursesService.courseControllerGetCourseReview({
          courseId,
          limit: LIMIT,
          page: pageParam,
        });
      },
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil(lastPage.total / LIMIT);
        const isLastPage = lastPage.page >= totalPages;
        return isLastPage ? undefined : lastPage.page + 1;
      },
      enabled: !!courseId && !reviewId,
    });

  return { data, isFetchingNextPage, fetchNextPage, hasNextPage };
};
