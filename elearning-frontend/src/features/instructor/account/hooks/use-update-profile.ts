import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileFormValues } from '..';
import { UsersService } from '@/client-sdk';
import { useToast } from '@/components/ui/use-toast';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const { mutate: update, isPending } = useMutation({
    mutationFn: (data: ProfileFormValues) =>
      UsersService.userControllerUpdateProfile({
        requestBody: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getMe'] });
      toast({ variant: 'success', title: 'Cập nhật thông tin thành công' });
    },
  });

  return { update, isPending };
};
