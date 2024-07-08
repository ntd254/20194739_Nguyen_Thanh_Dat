import { CourseDto } from '@/client-sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Rating from '@/components/ui/rating';
import { pageList } from '@/constants/page-list';
import { convertSecondToHour } from '@/lib/utils/convert-second';
import { formatPrice } from '@/lib/utils/format-price';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlayCircle } from 'react-icons/fa';

type CourseCardProps = {
  course: CourseDto;
};

export default function CourseCard({ course }: CourseCardProps) {
  const { hours, minutes } = convertSecondToHour(course.duration);

  return (
    <Card key={course.id} className="group rounded-lg p-3">
      <Link
        href={pageList.courses.detail(course.id)}
        className="flex h-full flex-col"
      >
        <CardContent className="p-0">
          <div className="relative h-44 overflow-hidden rounded-lg">
            <Image
              fill
              className="object-cover object-center"
              alt="thumbnail"
              src={course.thumbnail}
            />
            <FaPlayCircle className="group absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-5xl group-hover:block" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={course.teacher.avatar || undefined}
                alt="avatar"
              />
              <AvatarFallback>avatar</AvatarFallback>
            </Avatar>
            <p className="font-medium">{course.teacher.name}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">{course.title}</p>
            <p className="text-sm text-muted-foreground">
              {course.description}
            </p>
          </div>

          <div className="mb-1 flex items-center gap-2">
            <p className="font-medium">
              {(
                course.sumRating && course.sumRating / course.totalRating
              ).toFixed(1)}
            </p>
            <Rating
              rating={Math.round(
                course.sumRating && course.sumRating / course.totalRating,
              )}
            />
            <p className="text-muted-foreground">
              ({course.totalRating} đánh giá)
            </p>
          </div>
        </CardContent>
        <CardFooter className="mt-auto flex items-center justify-between p-0">
          <p className="font-medium">
            {hours && `${hours} giờ`} {minutes && `${minutes} phút`}
          </p>
          <p className="font-medium">
            {course.price ? formatPrice(course.price) : 'Miễn phí'}
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
