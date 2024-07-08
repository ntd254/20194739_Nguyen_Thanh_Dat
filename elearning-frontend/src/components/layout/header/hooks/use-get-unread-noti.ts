import { NotificationService } from '@/client-sdk';
import { useQuery } from '@tanstack/react-query';

export const useGetUnreadNoti = () => {
  const { data } = useQuery({
    queryFn: () => NotificationService.notificationControllerGetMyUnreadCount(),
    queryKey: ['unread-noti'],
  });

  return data;
};
