import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FC, useMemo, useState } from 'react';
import { useMyLearning } from './hooks/use-my-learning';
import { useRouter } from 'next/router';
import { MyLearningCourseDto } from '@/client-sdk';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MyLearning: FC = () => {
  const courses = useMyLearning();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClickCourse = (courseId: string, lessonId: string) => {
    router.push(`/learn/courses/${courseId}/lessons/${lessonId}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverTrigger asChild>
        <Button className="mr-3">Học tập</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" sideOffset={10}>
        {courses?.results.length === 0 && (
          <p className="p-1 text-center font-medium">
            Bạn chưa tham gia khóa học nào{' '}
            <Button
              className="p-0 text-base"
              variant="link"
              onClick={() => {
                router.push('/courses');
                setOpen(false);
              }}
            >
              bắt đầu ngay
            </Button>
          </p>
        )}

        {courses && courses.results.length > 0 && (
          <div>
            <div className="divide-y-2">
              {courses.results.map((course) => (
                <CourseItem
                  onClick={handleClickCourse}
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
            <Button
              onClick={() => {
                router.push('/learn/courses');
                setOpen(false);
              }}
              className="w-full rounded-none rounded-b-md py-3"
            >
              Danh sách khóa học
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

type Props = {
  course: MyLearningCourseDto;
  onClick: (courseId: string, lessonId: string) => void;
};

const CourseItem: FC<Props> = ({ course, onClick }) => {
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
    <div
      className="flex w-full cursor-pointer items-center space-x-3 p-3 hover:bg-muted"
      onClick={() => onClick(course.id, nextLesson.id)}
    >
      <div className="relative h-16 w-16">
        <Image
          className="rounded-md object-cover object-center"
          src={course.thumbnail}
          alt={course.title}
          fill
        />
      </div>
      <div className="flex-1">
        <p className="text-lg font-medium">{course.title}</p>
        <Progress value={progress} className="mt-1 h-3 bg-slate-200" />
        <div className="mt-2 flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={course.teacher.avatar || undefined}
              alt="avatar"
            />
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <p className="text-base font-medium text-primary">
            {course.teacher.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyLearning;
