import { MyLearningCourseDto } from '@/client-sdk';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Rating from '@/components/ui/rating';
import { convertRating } from '@/lib/utils/convert-rating';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useMemo } from 'react';
import { FaPlayCircle } from 'react-icons/fa';

type Props = {
  course: MyLearningCourseDto;
};

const CourseItem: FC<Props> = ({ course }) => {
  const progress = useMemo(() => {
    const totalLessons = course.sections.reduce(
      (acc, section) => acc + section.lessons.length,
      0,
    );

    const completedLessons = course.sections.reduce(
      (acc, section) =>
        acc +
        section.lessons.filter((lesson) => lesson.userLessons.length > 0)
          .length,
      0,
    );

    return (completedLessons / totalLessons) * 100;
  }, [course.sections]);

  const nextLesson = useMemo(() => {
    const lessons = course.sections.flatMap((section) => section.lessons);

    const lesson = lessons.find((lesson) => lesson.userLessons.length === 0);

    return lesson || lessons[lessons.length - 1];
  }, [course.sections]);

  return (
    <Card className="group rounded-lg p-3">
      <Link
        href={`/learn/courses/${course.id}/lessons/${nextLesson.id}`}
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
        </CardContent>
        <CardFooter className="mt-2 block p-0">
          <div>
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className="h-2.5 rounded-full bg-blue-600"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="mb-1 flex justify-between">
              <span className="text-base font-medium text-blue-700">
                Hoàn thành {progress}%
              </span>
            </div>
          </div>

          {course.reviews.length > 0 && (
            <div className="flex flex-col items-end">
              <Rating rating={convertRating(course.reviews[0].rating)} />
              <p className="text-sm">Xếp hạng của bạn</p>
            </div>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default CourseItem;
