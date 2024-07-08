import { ConnectedAccountService } from '@/client-sdk';
import { useMutation } from '@tanstack/react-query';

export const useLoginStripe = () => {
  const { mutate: login, isPending } = useMutation({
    mutationFn: () =>
      ConnectedAccountService.connectedAccountControllerLoginDashboard(),
    onSuccess: ({ url }) => window.open(url, '_blank'),
  });

  return { login, isPending };
};
