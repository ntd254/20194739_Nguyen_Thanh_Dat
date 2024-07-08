import { LearnService } from '@/client-sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const LIMIT = 5;

export const useGetReplies = (commentId: string, enable: boolean) => {
  const lessonId = useRouter().query.lessonId as string;

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['replies', lessonId, commentId],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => {
        return LearnService.learnControllerGetReplies({
          lessonId,
          commentId,
          limit: LIMIT,
          page: pageParam,
        });
      },
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil(lastPage.total / LIMIT);
        const isLastPage = lastPage.page >= totalPages;
        return isLastPage ? undefined : lastPage.page + 1;
      },
      enabled: !!lessonId && enable,
    });

  return { data, isFetchingNextPage, fetchNextPage, hasNextPage };
};
