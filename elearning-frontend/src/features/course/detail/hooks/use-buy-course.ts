import { ApiError, CreateCheckoutResDto, PaymentService } from '@/client-sdk';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export const useBuyCourse = () => {
  const { toast } = useToast();

  const { mutate: buyCourse, isPending } = useMutation<
    CreateCheckoutResDto,
    ApiError,
    string
  >({
    mutationFn: (courseId: string) =>
      PaymentService.paymentControllerCreateCheckoutSession({
        requestBody: { courseIds: [courseId] },
      }),
    onSuccess: (data) => (window.location.href = data.url),
    onError: (error) =>
      toast({ title: error.body.message, variant: 'destructive' }),
  });

  return { buyCourse, isPending };
};
