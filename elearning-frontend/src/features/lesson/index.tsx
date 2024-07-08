import { FC } from 'react';
import SideBar from './side-bar';
import Lesson from './lesson';
import { useCourseProgress } from './hooks/use-course-progress';
import NotFound from '@/components/ui/not-found';
import { useGetLesson } from './hooks/use-get-lesson';

const LessonFeature: FC = () => {
  const { courseProgress, isError } = useCourseProgress();
  const { lesson, isError: lessonIsError } = useGetLesson();

  if (isError || lessonIsError) {
    return <NotFound />;
  }

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r">
        <div className="sticky top-0">
          <SideBar courseProgress={courseProgress} />
        </div>
      </div>
      {/* Setting key for workaround video player error */}
      <Lesson key={lesson?.id} lesson={lesson} />
    </div>
  );
};

export default LessonFeature;
