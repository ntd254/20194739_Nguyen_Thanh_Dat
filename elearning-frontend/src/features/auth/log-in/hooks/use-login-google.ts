import { AuthService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';

export const useLoginGoogle = () => {
  const { mutate: loginGoogle } = useMutation({
    mutationFn: (idToken: string) => {
      return AuthService.authControllerLoginWithGoogle({
        requestBody: { idToken },
      });
    },
  });

  return { loginGoogle };
};
