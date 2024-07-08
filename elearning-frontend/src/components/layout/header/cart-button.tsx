import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { pageList } from '@/constants/page-list';
import { useCartStore } from '@/lib/hooks/use-cart';
import { formatPrice } from '@/lib/utils/format-price';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useBuyCourses } from './hooks/use-buy-courses';
import { CourseDetailDto } from '@/client-sdk';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLoggedIn } from '@/lib/hooks/use-logged-in';

const CartButton: FC = () => {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState(false);

  const courses = useCartStore((state) => state.courses);
  const removeCourse = useCartStore((state) => state.removeCourse);
  const clearCart = useCartStore((state) => state.clearCart);

  const isLoggedIn = useLoggedIn();
  const { buyCourses, isPending } = useBuyCourses();
  const handleBuyCourses = (courses: CourseDetailDto[]) => {
    if (isLoggedIn) {
      buyCourses(
        courses.map((course) => course.id),
        {
          onSuccess: () => {
            clearCart();
          },
        },
      );
    } else {
      const newUrl = new URL(pageList.logIn, window.location.origin);
      newUrl.searchParams.set('redirect', router.asPath);
      setOpenSheet(false);
      router.push(newUrl);
    }
  };

  const totalPrices = courses.reduce(
    (total, course) => total + course.price,
    0,
  );

  return (
    <Sheet open={openSheet} onOpenChange={(open) => setOpenSheet(open)}>
      <SheetTrigger asChild>
        <button className="relative rounded-full border-2 border-[#D0DBE9] bg-white p-3 text-muted-foreground outline-none transition-all hover:bg-primary hover:text-primary-foreground">
          <ShoppingCart size={20} />
          {courses.length > 0 && (
            <div className="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary text-xs font-bold text-white">
              {courses.length}
            </div>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="p-0 pt-6">
        <SheetHeader className="border-b pb-3">
          <SheetTitle className="px-6">Giỏ hàng ({courses.length})</SheetTitle>
        </SheetHeader>
        <div>
          {courses.length === 0 ? (
            <p className="px-6 py-5 text-center text-muted-foreground">
              Giỏ hàng trống
            </p>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-240px)]">
              <div className="divide-y">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="relative flex cursor-pointer items-start gap-4 px-6 py-5 transition-all hover:bg-muted"
                    onClick={() => {
                      setOpenSheet(false);
                      router.push(pageList.courses.detail(course.id));
                    }}
                  >
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover object-center"
                    />
                    <div>
                      <p className="text-lg font-semibold">{course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                    <div className="ml-auto space-y-2">
                      <p className="font-semibold">
                        {formatPrice(course.price)}
                      </p>
                      <Button
                        variant="outline"
                        className="py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCourse(course);
                        }}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <div className="border-t px-6 py-3">
            <div className="flex">
              <p>Phí giao dịch</p>
              <p className="ml-auto font-semibold">Miễn phí</p>
            </div>
            <div className="flex">
              <p>Tổng cộng</p>
              <p className="ml-auto font-semibold">
                {formatPrice(totalPrices)}
              </p>
            </div>
          </div>
          {courses.length > 0 && (
            <div className="p-6">
              <Button
                loading={isPending}
                className="w-full"
                onClick={() => handleBuyCourses(courses)}
              >
                Thanh toán <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;
