import { ConnectedAccountService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';

export const useCompleteStripeAccount = () => {
  const { mutate: complete, isPending } = useMutation({
    mutationFn: () =>
      ConnectedAccountService.connectedAccountControllerFinishOnboarding(),
    onSuccess: ({ url }) => (window.location.href = url),
  });

  return { complete, isPending };
};
