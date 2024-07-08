import { CourseDetailDto } from '@/client-sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { departments } from '@/constants/department';
import { cn } from '@/lib/utils/cn';
import { convertSecondToHour } from '@/lib/utils/convert-second';
import Link from 'next/link';
import { MdOutlineOndemandVideo } from 'react-icons/md';
import { MdOutlineCategory } from 'react-icons/md';
import { LuUsers } from 'react-icons/lu';
import { formatPrice } from '@/lib/utils/format-price';
import Image from 'next/image';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';
import { FC, useMemo } from 'react';
import { LuChevronRight } from 'react-icons/lu';
import { useBuyCourse } from './hooks/use-buy-course';
import { useCartStore } from '@/lib/hooks/use-cart';
import { pageList } from '@/constants/page-list';
import { useLoggedIn } from '@/lib/hooks/use-logged-in';
import { useRouter } from 'next/router';
import { useEnrollFreeCourse } from './hooks/use-enroll-free-course';

type CourseOverviewProps = {
  course: CourseDetailDto;
};

const CourseOverview: FC<CourseOverviewProps> = ({ course }) => {
  const { user } = useLogInUser();
  const isEnrolled = useMemo(() => {
    return (
      user?.courseEnrollments.find(
        (enrolledCourse) => enrolledCourse.courseId === course.id,
      ) ||
      user?.teachingCourses.find(
        (createCourse) => createCourse.id === course.id,
      )
    );
  }, [course.id, user?.courseEnrollments, user?.teachingCourses]);

  const { hours, minutes } = convertSecondToHour(course.duration);
  const category = departments.find(
    (d) => d.value === course.department,
  )?.label;

  const courseInCart = useCartStore((state) => state.courses);
  const courseHasAdded = useMemo(() => {
    return Boolean(
      courseInCart.find((addedCourse) => addedCourse.id === course.id),
    );
  }, [courseInCart, course.id]);

  const addCourseToCart = useCartStore((state) => state.addCourse);

  const { buyCourse, isPending } = useBuyCourse();

  const router = useRouter();
  const isLoggedIn = useLoggedIn();
  const handleBuyCourse = () => {
    if (isLoggedIn) {
      buyCourse(course.id);
    } else {
      const newUrl = new URL(pageList.logIn, window.location.origin);
      newUrl.searchParams.set('redirect', router.asPath);
      router.push(newUrl);
    }
  };

  const { enroll, isPending: isPendingEnroll } = useEnrollFreeCourse();
  const handleStartLearning = () => {
    if (!isLoggedIn) {
      const newUrl = new URL(pageList.logIn, window.location.origin);
      newUrl.searchParams.set('redirect', router.asPath);
      router.push(newUrl);
      return;
    }

    if (isEnrolled) {
      router.push(
        pageList.learn.lesson(course.id, course.sections[0].lessons[0].id),
      );
    } else {
      enroll(course.id, {
        onSuccess: () =>
          router.push(
            pageList.learn.lesson(course.id, course.sections[0].lessons[0].id),
          ),
      });
    }
  };

  return (
    <div className="bg-muted p-3">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-8">
        <div className="flex w-1/2 flex-col gap-4">
          <div>
            <p className="text-5xl">{course.title}</p>
            <p className="mt-2 whitespace-pre-wrap text-lg">
              {course.description}
            </p>
          </div>
          <p className="flex items-center">
            <Avatar className="mr-2">
              <AvatarImage src={course.teacher.avatar || undefined} />
              <AvatarFallback>avatar</AvatarFallback>
            </Avatar>
            Hướng dẫn:
            <Link
              href="#"
              className={cn(buttonVariants({ variant: 'link' }), 'px-1')}
            >
              {course.teacher.name}
            </Link>
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <MdOutlineOndemandVideo className="mr-2 text-xl" /> Thời lượng:{' '}
              {hours && `${hours} giờ`} {minutes && `${minutes} phút`}
            </Badge>
            <Badge variant="outline">
              <LuUsers className="mr-2 text-xl" /> Người học:{' '}
              {course.numberOfStudents}
            </Badge>
            <Badge variant="outline">
              <MdOutlineCategory className="mr-2 text-xl" /> Thể loại:{' '}
              {category}
            </Badge>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <p className="text-lg font-semibold">
              {isEnrolled
                ? 'Đã sở hữu'
                : course.price
                  ? formatPrice(course.price)
                  : 'Miễn phí'}
            </p>
            {course.price && !isEnrolled ? (
              <>
                <Button loading={isPending} onClick={handleBuyCourse}>
                  Mua ngay
                </Button>
                <Button
                  variant="outline"
                  disabled={courseHasAdded}
                  onClick={() => {
                    addCourseToCart(course);
                  }}
                >
                  {courseHasAdded && 'Đã'} Thêm vào giỏ hàng
                </Button>
              </>
            ) : (
              <Button
                loading={isPendingEnroll}
                className="gap-1"
                onClick={handleStartLearning}
              >
                Bắt đầu ngay <LuChevronRight className="text-lg" />
              </Button>
            )}
          </div>
        </div>
        <div className="relative aspect-video w-1/2">
          <Image
            src={course.thumbnail}
            alt="thumbnail"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
