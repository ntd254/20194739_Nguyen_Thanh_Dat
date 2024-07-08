import { ConnectedAccountService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';

export const useCreateStripeAccount = () => {
  const { mutate: create, isPending } = useMutation({
    mutationFn: () =>
      ConnectedAccountService.connectedAccountControllerCreate(),
    onSuccess: ({ url }) => (window.location.href = url),
  });

  return { create, isPending };
};
