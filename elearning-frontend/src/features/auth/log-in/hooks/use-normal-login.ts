import { AuthService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';
import { LogInFormValues } from '../index';
import { useToast } from '@/components/ui/use-toast';
import { AxiosError } from 'axios';

export const useNormalLogin = () => {
  const { toast } = useToast();

  const {
    mutate: normalLogin,
    isError,
    isPending,
  } = useMutation({
    mutationFn: (values: LogInFormValues) =>
      AuthService.authControllerLogin({ requestBody: values }),
    onError: (error: AxiosError) => {
      switch (error.status) {
        case 400:
          toast({
            title: 'Đăng nhập thất bại',
            description: 'Email hoặc mật khẩu không đúng',
            variant: 'destructive',
          });
          break;
        case 500:
          toast({
            title: 'Đăng nhập thất bại',
            description: 'Lỗi hệ thống, vui lòng thử lại sau',
            variant: 'destructive',
          });
          break;
        default:
          break;
      }
    },
  });

  return { normalLogin, isError, isPending };
};
