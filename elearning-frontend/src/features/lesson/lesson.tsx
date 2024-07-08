import Footer from '@/components/layout/footer';
import { FC } from 'react';
import { LessonResDto } from '@/client-sdk';
import { Button, buttonVariants } from '@/components/ui/button';
import { useMarkComplete } from './hooks/use-mark-complete';
import Link from 'next/link';
import { pageList } from '@/constants/page-list';
import { useRouter } from 'next/router';
import ListComments from './list-comments';
import VideoLesson from './video-lesson';
import QuizLesson from './quiz-lesson';

type Props = {
  lesson?: LessonResDto;
};

const Lesson: FC<Props> = ({ lesson }) => {
  const query = useRouter().query;
  const courseId = query.courseId as string;

  const { markComplete } = useMarkComplete();

  return (
    <div className="flex-1">
      <div className="p-8">
        <h3 className="mb-2 text-xl font-semibold">{lesson?.title}</h3>
        {/* Set overflow-hidden for avoiding shift layout when change lesson */}

        {lesson && lesson.video && <VideoLesson lesson={lesson} />}

        {lesson && lesson.questions.length > 0 && (
          <QuizLesson lesson={lesson} />
        )}

        <div className="mt-6 flex items-center justify-between border-b pb-4">
          {lesson && lesson.hasCompleted ? (
            <Button onClick={() => markComplete({ completed: false })}>
              Đánh dấu chưa hoàn thành
            </Button>
          ) : (
            <Button onClick={() => markComplete({ completed: true })}>
              Đánh dấu hoàn thành
            </Button>
          )}
          <div className="space-x-2">
            {lesson && lesson.prevLessonId && (
              <Link
                className={buttonVariants({ variant: 'secondary' })}
                href={pageList.learn.lesson(courseId, lesson.prevLessonId)}
                scroll={false}
              >
                Bài học trước
              </Link>
            )}
            {lesson && lesson.nextLessonId && (
              <Link
                className={buttonVariants({ variant: 'secondary' })}
                href={pageList.learn.lesson(courseId, lesson.nextLessonId)}
                scroll={false}
              >
                Bài học tiếp theo
              </Link>
            )}
          </div>
        </div>

        <ListComments />
      </div>
      <Footer />
    </div>
  );
};

export default Lesson;
