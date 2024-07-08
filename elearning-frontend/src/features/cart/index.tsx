import { Button, buttonVariants } from '@/components/ui/button';
import { pageList } from '@/constants/page-list';
import { useCartStore } from '@/lib/hooks/use-cart';
import { cn } from '@/lib/utils/cn';
import { formatPrice } from '@/lib/utils/format-price';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import { useBuyCourses } from './hooks/use-buy-courses';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CartFeature: FC = () => {
  const courses = useCartStore((state) => state.courses);
  const removeCourse = useCartStore((state) => state.removeCourse);
  const clearCart = useCartStore((state) => state.clearCart);

  const { buyCourses, isPending } = useBuyCourses();
  const handleBuyCourses = () => {
    buyCourses(
      courses.map((course) => course.id),
      {
        onSuccess: () => {
          clearCart();
        },
      },
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Giỏ hàng</h2>
      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course.id} className="flex items-start gap-3 p-3">
            <div className="relative aspect-video w-56">
              <Image
                src={course.thumbnail}
                alt="thumbnail"
                fill
                className="object-cover object-center"
              />
            </div>
            <div>
              <div className="mb-2">
                <Link
                  href={pageList.courses.detail(course.id)}
                  className={cn(
                    buttonVariants({ variant: 'link' }),
                    'px-0 text-lg',
                  )}
                >
                  {course.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
              </div>
              <p className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={course.teacher.avatar || undefined} />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
                <span>{course.teacher.name}</span>
              </p>
            </div>
            <div className="ml-auto flex items-center gap-6">
              <p className="font-semibold text-primary">
                {formatPrice(course.price)}
              </p>
              <p
                className="cursor-pointer text-lg"
                onClick={() => removeCourse(course)}
              >
                &#10005;
              </p>
            </div>
          </div>
        ))}
        <div className="flex-c flex border-t">
          <div className="ml-auto flex flex-col">
            <p className="mr-10 mt-3">
              <span className="text-muted-foreground">Tổng: </span>
              <span className="text-lg font-semibold">
                {formatPrice(
                  courses.reduce((total, course) => total + course.price, 0),
                )}
              </span>
            </p>
            <Button
              loading={isPending}
              className="mt-2"
              onClick={handleBuyCourses}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartFeature;
