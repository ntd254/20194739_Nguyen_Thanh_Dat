import { NotificationService } from '@/client-sdk';
import { useInfiniteQuery } from '@tanstack/react-query';

const LIMIT = 6;

export const useGetNotification = () => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['notifications'],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => {
        return NotificationService.notificationControllerGetMyNotifications({
          limit: LIMIT,
          page: pageParam,
        });
      },
      getNextPageParam: (lastPage) => {
        const totalPages = Math.ceil(lastPage.total / LIMIT);
        const isLastPage = lastPage.page >= totalPages;
        return isLastPage ? undefined : lastPage.page + 1;
      },
    });

  return { data, isFetchingNextPage, fetchNextPage, hasNextPage };
};
