import { ApiError, PaymentService } from '@/client-sdk';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useBuyCourses = () => {
  const { toast } = useToast();

  const { mutate: buyCourses, isPending } = useMutation({
    mutationFn: (courseIds: string[]) =>
      PaymentService.paymentControllerCreateCheckoutSession({
        requestBody: { courseIds },
      }),
    onSuccess: (data) => (window.location.href = data.url),
    onError: (error: ApiError) =>
      toast({ title: error.body.message, variant: 'destructive' }),
  });

  return { buyCourses, isPending };
};
