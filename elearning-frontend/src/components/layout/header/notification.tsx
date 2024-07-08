import {
  FC,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useGetNotification } from './hooks/use-get-notification';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bell } from 'lucide-react';
import {
  CommentResource,
  EnrollmentResource,
  MyNotificationDto,
  NotificationType,
  ReplyResource,
  ReviewResource,
} from '@/client-sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Rating from '@/components/ui/rating';
import { convertRating } from '@/lib/utils/convert-rating';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInView } from 'react-intersection-observer';
import { useRouter } from 'next/router';
import { useGetUnreadNoti } from './hooks/use-get-unread-noti';
import { useMarkReadNoti } from './hooks/use-mark-read-noti';
import { cn } from '@/lib/utils/cn';
import { socket } from '@/constants/socket';
import { useQueryClient } from '@tanstack/react-query';

const Notification: FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetNotification();

  const queryClient = useQueryClient();
  const refetchNoti = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['unread-noti'] });
  }, [queryClient]);
  useEffect(() => {
    if (socket.connected) {
      socket.on('notification', refetchNoti);
      return () => {
        socket.off('notification', refetchNoti);
      };
    }
  }, [refetchNoti]);

  const unreadNoti = useGetUnreadNoti();
  const mark = useMarkReadNoti();

  const [open, setOpen] = useState(false);

  const notifications = useMemo(() => {
    if (!data) return [];

    return data.pages.flatMap((page) => page.results);
  }, [data]);

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const handleClickItem = (notiId: string) => {
    setOpen(false);
    mark(notiId);
  };

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <button className="relative rounded-full border-2 border-[#D0DBE9] bg-white p-3 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground">
          <Bell size={20} />
          {!!unreadNoti && (
            <div className="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-gray-900">
              {unreadNoti}
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        // Prevent go to next focusable element when close popover
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="w-96 p-0"
        sideOffset={10}
      >
        <ScrollArea className="max-h-96">
          {notifications.length === 0 && (
            <p className="p-3 text-center text-muted-foreground">
              Không có thông báo
            </p>
          )}

          {notifications.length > 0 && (
            <div>
              <div className="divide-y-2">
                {notifications.map((notification, index) => {
                  if (index === notifications.length - 1) {
                    return (
                      <NotiItem
                        onClick={() => handleClickItem(notification.id)}
                        key={notification.id}
                        ref={ref}
                        notification={notification}
                      />
                    );
                  }
                  return (
                    <NotiItem
                      onClick={() => handleClickItem(notification.id)}
                      key={notification.id}
                      notification={notification}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

type Props = {
  notification: MyNotificationDto;
  onClick: () => void;
};

const NotiItem = forwardRef<HTMLDivElement, Props>(
  ({ notification, onClick }, ref) => {
    let message: ReactNode = '';
    switch (notification.type) {
      case NotificationType.NEW_ENROLLMENT: {
        const resource = notification.resource as EnrollmentResource;
        message = (
          <span>
            đã đăng ký khóa học{' '}
            <span className="font-medium">{resource.course.title}</span> của bạn
          </span>
        );
        break;
      }
      case NotificationType.NEW_COMMENT: {
        const resource = notification.resource as CommentResource;
        message = (
          <span>
            đã bình luận ở bài học{' '}
            <span className="font-medium">{resource.lesson.title}</span> của
            bạn: {`"${resource.content}"`}
          </span>
        );
        break;
      }
      case NotificationType.NEW_REVIEW: {
        const resource = notification.resource as ReviewResource;
        message = (
          <span>
            đã đánh giá khóa học{' '}
            <span className="font-medium">{resource.course.title}</span> của
            bạn:{' '}
            <Rating
              className="inline-flex translate-y-[2px]"
              rating={convertRating(resource.rating)}
            />
          </span>
        );
        break;
      }
      case NotificationType.NEW_REPLY: {
        const resource = notification.resource as ReplyResource;
        message = (
          <span>
            đã trả lời bình luận của bạn ở bài học{' '}
            <span className="font-medium">{resource.lesson.title}</span>:{' '}
            {`"${resource.content}"`}
          </span>
        );
        break;
      }
    }

    const router = useRouter();
    const handleClick = () => {
      switch (notification.type) {
        case NotificationType.NEW_COMMENT: {
          const resource = notification.resource as CommentResource;
          onClick();
          router.push(
            `/learn/courses/${resource.lesson.section.courseId}/lessons/${resource.lesson.id}?commentId=${resource.id}`,
            undefined,
            { scroll: false },
          );
          break;
        }
        case NotificationType.NEW_REVIEW: {
          const resource = notification.resource as ReviewResource;
          onClick();
          router.push(
            `/courses/${resource.course.id}?reviewId=${resource.id}`,
            undefined,
            { scroll: false },
          );
          break;
        }
        case NotificationType.NEW_ENROLLMENT: {
          const resource = notification.resource as EnrollmentResource;
          onClick();
          router.push(`/courses/${resource.course.id}`, undefined, {
            scroll: true,
          });
          break;
        }
        case NotificationType.NEW_REPLY: {
          const resource = notification.resource as ReplyResource;
          onClick();
          router.push(
            `/learn/courses/${resource.lesson.section.courseId}/lessons/${resource.lesson.id}?commentId=${resource.parentId}&replyId=${resource.id}`,
            undefined,
            { scroll: false },
          );
          break;
        }
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full cursor-pointer items-start gap-3 p-3 hover:bg-slate-200',
          !notification.read && 'bg-muted',
        )}
        onClick={handleClick}
      >
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={notification.sourceUser.avatar || undefined}
            alt="avatar"
          />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <div className="text-nowrap flex-1">
          <p className="line-clamp-3">
            <span className="font-medium">{notification.sourceUser.name}</span>{' '}
            {message}
          </p>
        </div>
      </div>
    );
  },
);

NotiItem.displayName = 'NotiItem';

export default Notification;
