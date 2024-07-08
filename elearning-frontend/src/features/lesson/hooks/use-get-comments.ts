import { LearnService } from '@/client-sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const LIMIT = 5;

export const useGetComments = () => {
  const lessonId = useRouter().query.lessonId as string;
  const commentId = useRouter().query.commentId as string | undefined;

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['comments', lessonId],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => {
        return LearnService.learnControllerGetComments({
          lessonId,
          limit: LIMIT,
          page: pageParam,
        });
      },
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil(lastPage.total / LIMIT);
        const isLastPage = lastPage.page >= totalPages;
        return isLastPage ? undefined : lastPage.page + 1;
      },
      enabled: !!lessonId && !commentId,
    });

  return { data, isFetchingNextPage, fetchNextPage, hasNextPage };
};
