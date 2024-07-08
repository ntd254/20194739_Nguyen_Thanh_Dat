import { useMutation } from '@tanstack/react-query';
import { SignUpFormValues } from '..';
import { ApiError, AuthService } from '@/client-sdk';
import { useToast } from '@/components/ui/use-toast';

export const useSignUp = () => {
  const { toast } = useToast();

  const { mutate: signUp, isPending } = useMutation({
    mutationFn: ({
      formValues,
      redirect,
    }: {
      formValues: SignUpFormValues;
      redirect?: string;
    }) =>
      AuthService.authControllerSignUp({
        requestBody: { ...formValues, redirect },
      }),
    onError: (error: ApiError) =>
      toast({ title: error.body.message, variant: 'destructive' }),
  });

  return { signUp, isPending };
};
