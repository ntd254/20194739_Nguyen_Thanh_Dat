import { FC, useEffect, useMemo, useState } from 'react';
import { CourseProgressDto } from '@/client-sdk';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils/cn';
import { MdOutlineOndemandVideo, MdOutlineQuiz } from 'react-icons/md';
import { convertSecondToHour } from '@/lib/utils/convert-second';
import { LuCheckCircle, LuPlayCircle, LuFileText } from 'react-icons/lu';
import Link from 'next/link';
import { pageList } from '@/constants/page-list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/router';
import ReviewDialog from './review-dialog';
import { useLogInUser } from '@/lib/hooks/use-log-in-user';

type SideBarProps = {
  courseProgress?: CourseProgressDto;
};

const SideBar: FC<SideBarProps> = ({ courseProgress }) => {
  const lessonId = useRouter().query.lessonId as string;

  const [openingSections, setOpeningSections] = useState<string[]>([]);

  const progress = useMemo(() => {
    if (!courseProgress) {
      return 0;
    }

    const totalLessons = courseProgress.sections.reduce(
      (total, section) => total + section.lessons.length,
      0,
    );
    const totalCompletedLessons = courseProgress.sections
      .flatMap((section) => section.lessons)
      .filter((lesson) => lesson.userLessons.length > 0).length;

    return Number(((totalCompletedLessons / totalLessons) * 100).toFixed(1));
  }, [courseProgress]);

  const { user } = useLogInUser();
  const showBtnReview = useMemo(() => {
    if (
      progress > 80 &&
      user?.reviews.every((review) => review.courseId !== courseProgress?.id)
    ) {
      return true;
    }
    return false;
  }, [progress, courseProgress?.id, user?.reviews]);

  useEffect(() => {
    if (courseProgress && lessonId) {
      const sectionId = courseProgress.sections.find((section) =>
        section.lessons.some((lesson) => lesson.id === lessonId),
      )?.id;

      if (sectionId) {
        setOpeningSections([sectionId]);
      }
    }
  }, [courseProgress, lessonId]);

  return (
    <div className="h-screen">
      <div className="border-b">
        <div className="p-4">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-lg font-semibold">{courseProgress?.title}</p>
            {showBtnReview && <ReviewDialog courseProgress={progress} />}
          </div>

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
      </div>
      <div>
        <ScrollArea className="h-[calc(100vh-125px)]">
          <Accordion
            value={openingSections}
            onValueChange={(value) => setOpeningSections(value)}
            type="multiple"
          >
            {courseProgress?.sections.map((section, index) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="border-2 border-r-0 border-t-0"
              >
                <AccordionTrigger
                  className={cn(
                    'justify-between bg-muted px-3',
                    openingSections.includes(section.id) && 'border-b-2',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {index + 1}
                    </div>
                    <p className="text-lg">{section.title}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  {section.lessons.map((lesson) => {
                    if (lesson.video) {
                      const { hours, minutes, seconds } = convertSecondToHour(
                        lesson.video.duration,
                      );

                      return (
                        <Link
                          href={pageList.learn.lesson(
                            courseProgress.id,
                            lesson.id,
                          )}
                          scroll={false}
                          key={lesson.id}
                          className={cn(
                            'flex items-center gap-2 p-4 pl-5 hover:bg-slate-200',
                            lessonId === lesson.id && 'bg-slate-200',
                          )}
                        >
                          {lesson.userLessons.length > 0 ? (
                            <LuCheckCircle className="mr-3 text-xl text-[#5cb85c]" />
                          ) : lesson.video ? (
                            <LuPlayCircle className="mr-3 text-xl" />
                          ) : (
                            <LuFileText className="mr-3 text-xl" />
                          )}
                          <MdOutlineOndemandVideo className="text-lg" />
                          <p className="text-base">{lesson.title}</p>
                          <p className="ml-auto text-muted-foreground">
                            {hours && `${hours} giờ`}{' '}
                            {minutes && `${minutes} phút`}{' '}
                            {seconds && `${seconds} giây`}
                          </p>
                        </Link>
                      );
                    }

                    return (
                      <Link
                        href={pageList.learn.lesson(
                          courseProgress.id,
                          lesson.id,
                        )}
                        scroll={false}
                        key={lesson.id}
                        className={cn(
                          'flex items-center gap-2 p-4 pl-5 hover:bg-slate-200',
                          lessonId === lesson.id && 'bg-slate-200',
                        )}
                      >
                        {lesson.userLessons.length > 0 ? (
                          <LuCheckCircle className="mr-3 text-xl text-[#5cb85c]" />
                        ) : lesson.video ? (
                          <LuPlayCircle className="mr-3 text-xl" />
                        ) : (
                          <LuFileText className="mr-3 text-xl" />
                        )}
                        <MdOutlineQuiz className="text-lg" />
                        <p className="text-base">Quiz: {lesson.title}</p>
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SideBar;
