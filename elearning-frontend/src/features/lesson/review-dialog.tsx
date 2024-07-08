import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Rating } from 'react-simple-star-rating';
import { Textarea } from '@/components/ui/textarea';
import { useReviewCourse } from './hooks/use-review-course';
import { useReview } from '@/lib/hooks/use-review';
import { useRouter } from 'next/router';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';
import { Rating as RatingEnum } from '@/client-sdk';

const reviewSchema = z.object({
  rating: z.nativeEnum(RatingEnum, {
    required_error: 'Chưa chọn rating',
  }),
  content: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const ReviewDialog: FC<{ courseProgress: number }> = ({ courseProgress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useLogInUser();
  const reviewState = useReview();

  const courseId = useRouter().query.courseId as string;
  const hasRejectReview = useMemo(() => {
    if (!user) {
      // If don't have user, we don't want to ask for review
      return true;
    }

    const askedCourses = reviewState.reviews[user.id] || [];
    return askedCourses.some((id) => id === courseId);
  }, [user, reviewState.reviews, courseId]);

  useEffect(() => {
    if (courseProgress > 80 && !hasRejectReview) {
      setIsOpen(true);
    }
  }, [courseProgress, hasRejectReview]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && user && !hasRejectReview) {
          reviewState.addCourseId(user.id, courseId);
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Đánh giá & nhận xét</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá khóa học</DialogTitle>
          <FormReview onCloseDialog={() => setIsOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const FormReview: FC<{ onCloseDialog: () => void }> = ({ onCloseDialog }) => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const createReview = useReviewCourse();

  const onSubmit = (values: ReviewFormValues) => {
    createReview(values, { onSuccess: onCloseDialog });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="text-center">
                  <Rating
                    SVGclassName="inline-block"
                    onClick={(rate) => {
                      switch (rate) {
                        case 1:
                          field.onChange(RatingEnum.ONE);
                          break;
                        case 2:
                          field.onChange(RatingEnum.TWO);
                          break;
                        case 3:
                          field.onChange(RatingEnum.THREE);
                          break;
                        case 4:
                          field.onChange(RatingEnum.FOUR);
                          break;
                        case 5:
                          field.onChange(RatingEnum.FIVE);
                          break;
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhận xét</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Nhận xét của bạn về khóa học..."
                  {...field}
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex justify-end space-x-2">
          <Button type="submit">Gửi</Button>
        </div>
      </form>
    </Form>
  );
};

export default ReviewDialog;
