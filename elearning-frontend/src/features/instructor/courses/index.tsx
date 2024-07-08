import Image from 'next/image';
import { useGetMyTutorCourse } from './hooks/use-get-my-tutor-course';
import { Lock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/format-price';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useCreateStripeAccount } from '../account/hooks/use-create-stripe-account';
import { useCompleteStripeAccount } from '../account/hooks/use-complete-stripe-account';
import { cn } from '@/lib/utils/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateVisibility } from './create/hooks/use-update-visibility';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Status } from '@/client-sdk';

export default function TeacherCoursesFeature() {
  const { courses } = useGetMyTutorCourse();
  const { user } = useLogInUser();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const courseId = router.query.courseId as string | undefined;
  const scrollCourseRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (courseId) {
      scrollCourseRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [courseId]);

  const { create, isPending } = useCreateStripeAccount();
  const { complete, isPending: isPendingComplete } = useCompleteStripeAccount();

  const handleCreateCourse = () => {
    if (user?.stripeAccount?.detailsSubmitted) {
      router.push('/instructor/courses/create');
      return;
    }
    setShowModal(true);
  };

  const { toast } = useToast();
  const update = useUpdateVisibility();
  const queryClient = useQueryClient();
  const handleUpdateVisibility = (courseId: string, isVisible: boolean) => {
    update(
      { courseId, isVisible },
      {
        onSuccess: () => {
          toast({
            title: 'Thay đổi chế độ hiển thị thành công',
            variant: 'success',
          });
          queryClient.invalidateQueries({ queryKey: ['tutor-courses'] });
        },
        onError: () => {
          toast({
            title: 'Thay đổi chế độ hiển thị thất bại',
            description: 'Khóa học đã có người đăng ký',
            variant: 'destructive',
          });
        },
      },
    );
  };

  return (
    <>
      <div className="flex flex-col">
        <h2 className="mb-3 text-2xl font-semibold">Khóa học của bạn</h2>
        <Button className="mb-3 ml-auto" onClick={handleCreateCourse}>
          Tạo khóa học
        </Button>
        <div className="space-y-3">
          {courses &&
            courses.map((course) => (
              <div
                ref={courseId === course.id ? scrollCourseRef : null}
                key={course.id}
                className={cn(
                  'p flex items-start gap-3 rounded-lg border p-5',
                  course.public &&
                    course.status === Status.COMPLETED &&
                    'cursor-pointer hover:bg-gray-50',
                )}
                onClick={() => {
                  if (course.public && course.status === Status.COMPLETED) {
                    router.push(`/courses/${course.id}`);
                  }
                }}
              >
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={200}
                  height={100}
                  className="rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  {course.status === Status.PENDING && (
                    <Badge variant="outline" className="min-w-max text-sm">
                      Đang xử lý
                    </Badge>
                  )}

                  <p className="py-1 font-semibold">
                    {course.price > 0
                      ? `Giá: ${formatPrice(course.price)}`
                      : 'Miễn phi'}
                  </p>

                  <Select
                    value={course.public ? 'public' : 'private'}
                    onValueChange={(value: 'public' | 'private') => {
                      handleUpdateVisibility(course.id, value === 'public');
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chế độ hiển thị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <span className="flex items-center gap-1">
                          <Users />
                          Công khai
                        </span>
                      </SelectItem>
                      <SelectItem value="private">
                        <span className="flex items-center gap-1">
                          <Lock />
                          Riêng tư
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-500">
              Chưa có tài khoản Stripe
            </DialogTitle>
            <DialogDescription>
              <p>
                Để có thể nhận tiền từ khóa học, bạn cần có tài khoản Stripe
              </p>
              <p className="mt-4 text-right">
                <Button
                  loading={isPending || isPendingComplete}
                  onClick={() => {
                    if (user?.stripeAccount === null) {
                      create();
                    } else {
                      complete();
                    }
                  }}
                >
                  Tạo tài khoản
                </Button>
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
