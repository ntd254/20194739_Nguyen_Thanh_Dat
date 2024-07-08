import { NotificationService } from '@/client-sdk';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMarkReadNoti = () => {
  const queryClient = useQueryClient();

  const { mutate: mark } = useMutation({
    mutationFn: (notiId: string) => {
      return NotificationService.notificationControllerMarkAsRead({
        requestBody: { id: notiId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unread-noti'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return mark;
};
